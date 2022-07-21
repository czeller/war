<script>
import { mapStores } from 'pinia'
import { wargameStore } from '/src/store'

export default {
	components: {
    PlayingCard: require("./PlayingCard").default
  },

	props: {
		players: {
			required: true,
			type: Array
		},
		numberOfCardsRequired: { //inital battle: 1, tiebreaker battle: 2
			required: true,
			type: Number
		}
	},

	data() {
		return {
			battleResults: ""
		}
	},

	watch: {
		readyToResolve: {
			immediate: true,
			handler() {
				if (this.readyToResolve) {
					setTimeout(this.resolve, 100); //this is necessary for the DOM to finish
				}
			}
		}
	},

	computed: {
		...mapStores(wargameStore),

		readyToResolve() {
			//check if each player has played the required number of cards, excluding losers
			for (let i=0; i<this.players.length; i++) {
				if (this.players[i].cards.length != this.numberOfCardsRequired && this.wargameStore.losingPlayerIndexes.indexOf(i) == -1) {
					return false;
				}
			}

			return true;
		}
	},

	methods: {
		resolve() {
			let players = this.players
				.map((p, i) => {
					return {
						...p,
						originalPlayerIndex: i,
					}
				})
				.filter(p => { //exclude losers
					return this.wargameStore.losingPlayerIndexes.indexOf(p.originalPlayerIndex) == -1;
				})
				.map(p => {
					return {
						...p,
						score: this.wargameStore.cardValues.indexOf(p.cards[p.cards.length-1].value),
					}
				})
				.sort((a, b) => {
					return b.score - a.score;
				});

			//todo: is a stalemate possible if you end with a tiebreaker?
			if (players[0].score != players[1].score) {
				//we have a winner!
				this.battleResults = "Player " + players[0].name + " won!"; //todo: show how many cards the player won?
				this.wargameStore.endBattles(players[0].originalPlayerIndex);
			}
			else {
				//tiebreaker
				this.battleResults = "Tie breaker!";
				this.wargameStore.addBattle();
			}
		}
	},

	/*
	types of battles

	initial: 1 card from each player
	tiebreaker: 2 cards from each player with a parent battle

	winner of final battle gets all cards from previous battles
	*/
}
</script>

<template>
	<div>
		<div>
			{{battleResults}}
		</div>

		<div>
			<div style="display:flex; justify-content:center;">
				<div v-for="(player, index) in players" :key="index">
					Player {{player.name}} play {{numberOfCardsRequired - player.cards.length}} card(s)!

					<!--todo: tie breakers need two "player-card" slots (this isn't right)-->
					<div class="player-cards" v-for="cardIndex in numberOfCardsRequired" :key="cardIndex">
						<PlayingCard
							v-for="(card) in player.cards"
							:key="JSON.stringify(card)"
							revealed="true"
							v-bind="card"
						>
						</PlayingCard>
					</div>
				</div>
			</div>

			<!--todo if current battle is a tiebreaker, show cards from previous battles separately-->
			<template v-if="wargameStore.battles.length > 1">
				PLAYED CARDS...
				<div style="display:flex;">
					<!--todo: maybe put this in a wargameStore.getBattleCards (see also endBattles())?-->
					<div v-for="(card) in wargameStore.battles
						.slice(0, -1)
						.map(b => b.players)
						.flat()
						.map(p => p.cards)
						.flat()"
						:key="JSON.stringify(card)"
						style="position:relative;"
						>
						<PlayingCard
							revealed="true"
							v-bind="card"
							style="position:relative;"
						>
						</PlayingCard>
					</div>
				</div>
			</template>
		</div>

		<!--
		todo: layouts: initial, tiebreaker
		separate current battle from previous (tiebreaker) battles
		put tiebreaker cards side by side
		only reveal the final card (e.g. in a tiebreaker, it's the 2nd card)
		communicate results of each battle more clearly
		- slow down
		- show player scores (number of cards and plus/minus)
			-->

	</div>
</template>

<style scoped>
.player-cards {
	margin: 20px;
	width: 100px; /* match card */
	height: 140px; /* match card */
	border: 1px dashed black;
	text-align: center;
	display: flex;
	align-items: center;
}

.card {
	position: absolute;
}
</style>