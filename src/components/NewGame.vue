<script>
import { mapStores } from 'pinia'
import { wargameStore } from '/src/store'

export default {
	data() {
		return {
			newPlayer: {},
			players: []
		}
  },
	computed: {
    ...mapStores(wargameStore)
  },
	methods: {
		resetNewPlayer() {
			this.newPlayer = {
				name: "",
				human: true
			}
		},

		addPlayer() {
			//todo: limit # of players? prevent duplicate names?
			this.players.push({
				...this.newPlayer
			});

			this.resetNewPlayer()
		}
	},
	beforeMount() {
		this.resetNewPlayer();
	}
}
</script>

<template>
	<div>
		<form @submit.prevent="addPlayer">
			<input placeholder="Player Name" v-model="newPlayer.name" required>
			<label>
				<input type="checkbox" v-model="newPlayer.human" :value="true">
				Human?
			</label>
			<button>Add</button>
		</form>

		<div v-if="players.length">
			<hr />
			<h2>Players</h2>
			<div v-for="(player, index) in players" :key="index">
				{{player.name}}<br />
				Human? {{player.human ? 'Yes' : 'No'}}
				<button @click="players.splice(index, 1)">X</button>
			</div>

			<hr />

			<button @click="wargameStore.setPlayers(players)">Start Game Now!</button>
		</div>
	</div>
</template>
