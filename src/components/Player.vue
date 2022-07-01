<script>
import { mapStores } from 'pinia'
import { wargameStore } from '/src/store'

export default {
	components: {
    PlayingCard: require("./PlayingCard").default
  },
	computed: {
    ...mapStores(wargameStore)
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
			//get the card out of the players hand
			//add the card to the battle for the player
		}
	}
}
</script>

<template>
	<div class="player">
		{{name}}
		<div>
			<div>Cards in Hand: {{hand.length}}</div>
			<div class="cards" @click="playCard">
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
	height: 314px; /* height of each card; todo: lose the height! */
}

.card {
	position: absolute;
}
</style>
