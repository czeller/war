<script>
import { mapStores } from 'pinia'
import { wargameStore } from '/src/store'

export default {
	components: {
    PlayingCard: require("./PlayingCard").default
  },

	computed: {
    ...mapStores(wargameStore),

		//Playing as CPU...is there a current battle and has this player played the required number of cards?
		readyToAutomaticallyPlayCard() {
			if (this.human) {
				return false;
			}

			let currentBattle = this.wargameStore.battles[this.wargameStore.battles.length-1]; //todo: move this logic to the store

			if (!currentBattle) {
				return false;
			}

			if (currentBattle.players[this.index].cards.length != currentBattle.numberofCardsRequired) {
				return true;
			}

			return false;
		}
  },

	watch: {
		readyToAutomaticallyPlayCard() {
			if (this.readyToAutomaticallyPlayCard) {
				setTimeout(() => {
					this.playCard();
				}, 200);
			}
		}
	},

	props: {
		index: {
			required: true,
			type: Number
		},
		name: {
			required: true,
			type: String
		},
		human: {
			required: true,
			type: Boolean
		},
		hand: {
			default() {
				return []
			},
		}
	},

	methods: {
		playCard() {
			this.wargameStore.playCardFromPlayerAtIndex(this.index);
		}
	}
}
</script>

<template>
	<div class="player">
		{{name}} readyToAutomaticallyPlayCard={{readyToAutomaticallyPlayCard}}
		<div>
			<div>Cards in Hand: {{hand.length}}</div>
			<div class="cards" @click="human && playCard()">
				<PlayingCard
					v-for="(card, index) in hand"
					:key="index"
					v-bind="card"
				></PlayingCard>
			</div>
		</div>
	</div>
</template>

<style scoped>
.cards {
	position: relative;
	height: 140px; /* height of each card; todo: lose the height! */
}

.card {
	position: absolute;
}
</style>
