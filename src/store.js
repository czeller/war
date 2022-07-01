import { defineStore } from 'pinia'

export const wargameStore = defineStore('wargame', {
  state: () => ({
    players: [],
		battles: [], //current series of battles
  }),
  getters: {

  },
  actions: {
		setPlayers(players) {
			this.players = players;
		},

		playCardFromPlayerAtIndex(index) {
			//todo: validate card can be played (out of cards, already played, etc...)
			let card = this.players[index].hand.pop();
			let currentBattle = this.battles[this.battles.length-1];
			currentBattle.players[index].cards.push(card);
		},

		resetBattles() {
			this.battles = [];
		},

		addBattle() {
			this.battles.push({
				players: this.players.map(player => {
					return {
						...player,
						cards: []
					}
				})
			})
		}
  },
})