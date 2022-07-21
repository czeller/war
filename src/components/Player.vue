<script>
import { mapStores } from 'pinia'
import { wargameStore } from '/src/store'

export default {
	components: {
    PlayingCard: require("./PlayingCard").default
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

	data() {
		return {
			playCardTimeout: undefined
		}
	},

	computed: {
    ...mapStores(wargameStore),
  },

	watch: {
		"wargameStore.battles": {
      deep: true,
      handler() {
				if (this.human) {
					return;
				}

        let currentBattle = this.wargameStore.battles[this.wargameStore.battles.length-1];

        if (!currentBattle) {
          return;
        }

        if (currentBattle.players[this.index].cards.length != currentBattle.numberofCardsRequired) {
					this.playCardTimeout = this.playCardTimeout || setTimeout(() => {
						this.playCardTimeout = undefined; //prevent multiple cards being played at the same time
						this.playCard();
					}, 500);
				}
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
		Player: {{name}}
		<div>
			<div>Cards: {{hand.length}}</div>
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
	width: 120px; /* i.e. 100px card + 20px max fan out */
}

/* todo: can we dynamically add 5px to each card relative to the card before it? */
.card+.card {
	left:5px;
}

.card+.card+.card {
	left:10px;
}

.card+.card+.card+.card {
	left:15px;
}

.card+.card+.card+.card+.card {
	left:20px;
}

.card {
	position: absolute;
}
</style>
