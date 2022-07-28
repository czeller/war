<script>
import { mapStores } from 'pinia'
import { wargameStore } from '/src/store'
import { Fireworks } from 'fireworks-js'


export default {
	props: {
    player: {
			required: true
		}
  },

	data() {
		return {
			fireworks: undefined
		}
	},


	computed: {
		...mapStores(wargameStore),
  },


	methods: {
		showFireworks() {
			const container = document.querySelector('.fireworks')
			this.fireworks = new Fireworks(container, { acceleration: 1 });
			this.fireworks.start();
		}
	},

	beforeUnmount() {
		this.fireworks.stop();
	},

	mounted() {
		this.showFireworks();
	}
}
</script>

<template>
	<div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100vh">
		<div class="fireworks"></div>


		<div style="color:white;">
			WINNER IS {{player.name}}!!
		</div>
		<!--todo:
		animate cards
		show summary of battles
		-->

		<div style="margin-top:50px;">
			<button @click="wargameStore.resetGameState()">New Game!</button>
		</div>
	</div>
</template>

<style scoped>
.fireworks {
	z-index: -1;
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background: #000000;
}
</style>