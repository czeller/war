<script>
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
	}
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
		<div v-for="(player, index) in players" :key="index">
			{{player.name}} play {{numberOfCardsRequired - player.cards.length}} card(s)!

			<PlayingCard
				v-for="(card) in player.cards"
				:key="JSON.stringify(card)"
				revealed="true"
				v-bind="card"
			>
			</PlayingCard>
		</div>

	</div>
</template>
