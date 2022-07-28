<script>
import { mapStores } from 'pinia'
import { wargameStore } from '/src/store'

export default {
	components: {
    PlayingCard: require("./PlayingCard").default
  },

	computed: {
    ...mapStores(wargameStore),

		cards() {
			return this.wargameStore.battles
				.slice(0, -1)
				.map(b => b.players)
				.flat()
				.map(p => p.cards)
				.flat();
		}
  },
}
</script>

<template>
	<div style="text-align:center;">
		PLAYED CARDS...
		<div style="display:flex; flex-wrap:wrap; justify-content:center;">
			<!--todo: maybe put this in a wargameStore.getBattleCards (see also endBattles())?-->
			<div v-for="(card, index) in cards"
				:key="JSON.stringify(card)"
				>
				<PlayingCard
					revealed="true"
					v-bind="card"
					:style="index < cards.length-1 ? 'width:13px' : ''"
				> <!-- don't cut off last card -->
				</PlayingCard>
			</div>
		</div>
	</div>
</template>