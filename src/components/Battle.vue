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
		readyToResolve() {
			if (this.readyToResolve) {
				setTimeout(this.resolve, 100); //this is necessary for the DOM to finish
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

			if (players[0].score != players[1].score) {
				//we have a winner!
				this.battleResults = "Player " + players[0].name + " won!"; //todo: show how many cards the player won?
				this.wargameStore.endBattles(players[0].originalPlayerIndex);
			}
			else {
				//tiebreaker
				this.battleResults = "Tie breaker!";
				this.wargameStore.addBattle();

				//todo: 2 cpu players get stuck here
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

		<div v-for="(player, index) in players" :key="index">
			{{player.name}} play {{numberOfCardsRequired - player.cards.length}} card(s)!

			<PlayingCard
				v-for="(card) in player.cards"
				:key="JSON.stringify(card)"
				revealed="true"
				v-bind="card"
			>
			</PlayingCard>

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

	</div>
</template>
