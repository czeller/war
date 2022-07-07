import { defineStore } from 'pinia'

export const wargameStore = defineStore('wargame', {
  state: () => ({
    players: [],
		battles: [], //current series of battles
		cardValues: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
		cardSuits: ['H','D','S','C'],
  }),
  getters: {

  },
  actions: {
		setPlayers(players) {
			this.players = players;
		},

		playCardFromPlayerAtIndex(index) {
			let currentBattle = this.battles[this.battles.length-1];

			//todo: should we force a delay after each battle to show results? e.g. Player X won Y cards!

			//validate card can be played
			if (currentBattle.players[index].cards.length < currentBattle.numberOfCardsRequired) {
				let card = this.players[index].hand.pop();
				card && currentBattle.players[index].cards.push(card);
			}
		},

		endBattles(winningPlayerIndex) { //todo: can this have a better name?
			this.players[winningPlayerIndex].hand = this.players[winningPlayerIndex].hand.concat(
				this.battles
					.map(b => b.players)
					.flat()
					.map(p => p.cards)
					.flat() //todo: this may not be necessary in the context of multiple battles
			);

			//todo: consider packaging the calling of these two methods
			this.resetBattles();
			this.addBattle();
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
				}),
				numberOfCardsRequired: this.battles.length == 0 ? 1 : 2 //initial battle requires one card, tiebreakers require two cards
			})
		}
  },
})