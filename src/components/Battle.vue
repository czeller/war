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
			//check if each player has played the required number of cards
			for (let i=0; i<this.players.length; i++) {
				if (this.players[i].cards.length != this.numberOfCardsRequired) {
					return false;
				}
			}

			return true;
		}
	},

	methods: {
		resolve() {
			let players = this.players.map((p, i) => {
					return {
						...p,
						originalPlayerIndex: i,
						score: this.wargameStore.cardValues.indexOf(p.cards[p.cards.length-1].value)
					}
				})
				.sort((a, b) => {
					return b.score - a.score;
				});

			if (players[0].score != players[1].score) {
				//we have a winner!
				this.wargameStore.endBattles(players[0].originalPlayerIndex);
			}
			else {
				//tiebreaker
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
			Player X wins Y cards!
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
			todo: layout for tiebreaker vs initial
			put current battle at top
			put tiebreaker cards side by side
			only reveal the final card (e.g. in a tiebreaker, it's the 2nd card)
			communicate results of each battle more clearly (slow down!)
			 -->
		</div>

	</div>
</template>
