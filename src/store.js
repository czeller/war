import { defineStore } from 'pinia'

export const wargameStore = defineStore('wargame', {
  state: () => ({
    players: [],
		losingPlayerIndexes: [],
		battles: [], //current series of battles
		cardValues: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
		cardSuits: ['H','D','S','C'],
  }),
  getters: {
		currentBattle() {
			let currentBattle = this.battles[this.battles.length-1];

		}
  },
  actions: {
		resetGameState() {
			this.players = [];
			this.losingPlayerIndexes = [];
			this.battles = [];
		},

		setPlayers(players) {
			this.players = players;
		},

		addLosingPlayer(index) {
			if (this.losingPlayerIndexes.indexOf(index) == -1) {
				this.losingPlayerIndexes.push(index);
			}
		},

		playCardFromPlayerAtIndex(index) {
			let currentBattle = this.battles[this.battles.length-1];

			//validate card can be played
			if (currentBattle && currentBattle.players[index].cards.length < currentBattle.numberOfCardsRequired) {
				let card = this.players[index].hand.pop();
				card && currentBattle.players[index].cards.push(card);
			}

		},

		endBattles(winningPlayerIndex) { //todo: can this have a better name?
			setTimeout(() => {
				this.players[winningPlayerIndex].hand = this.battles
					.map(b => b.players)
					.flat()
					.map(p => p.cards)
					.flat()
					.concat(
						this.players[winningPlayerIndex].hand
					);

				//todo: consider packaging the calling of these two methods
				this.resetBattles();
				this.addBattle();
			}, 1000);
		},

		resetBattles() {
			this.battles = [];
		},

		addBattle() {
			setTimeout(() => {
				this.battles.push({
					players: this.players.map(player => {
						return {
							...player,
							cards: []
						}
					}),
					numberOfCardsRequired: this.battles.length == 0 ? 1 : 2 //initial battle requires one card, tiebreakers require two cards
				});
			}, 1000);
		}
  },
})