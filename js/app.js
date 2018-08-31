(function() {

// const cardValues = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
// const cardSuits = ['H','D','S','C'];

const cardValues = ['2', '3', '4'];
const cardSuits = ['H','D'];

/***************************
COMPONENTS
***************************/

Vue.component("card", {
	template: `
		<div class="card">
			<img v-bind:src="imgUrl" />
		</div>
	`,
	computed: {
		imgUrl: function() {
			if (!this.revealed) return 'img/cardback.png';

			var value = this.value == '10' ? '0' : this.value;
			return 'https://deckofcardsapi.com/static/img/' + value + this.suit + '.png';
		}
	},
	props: {
		value: "",
		suit: "",
		revealed: {
			default: false
		}
	},
	// data: function() {
	// 	return {
	// 		revealed: false
	// 	}
	// },
	watch: {},
	methods: {
		setRevealed(revealed) {
			this.revealed = revealed;
		}
	},
	mounted: function() {

	}
});

Vue.component("player", {
	template: `
	<div class="player">
		{{name}}
		<div>
			<div class="hand" style="position:relative;" v-on:click="$emit('player-clicked-card')">
				<div style="position:absolute; z-index:1">{{hand.length}}</div>
				<card v-for="card in hand" v-bind="card"></card>
			</div>
			<div class="winPile" style="position:relative; margin-left:225px;">
				<card v-for="card in winPile" v-bind="card"></card>
			</div>
		</div>
	</div>`,
	props: ["name","hand","winPile"],
	watch: {
		hand: function() {
			if ( this.hand.length === 0 ) {
				this.$emit("player-hand-empty");
			}
		}
	},
	computed: {

	},
	methods: {

	}
});


new Vue({
	el: "#app",
	data: {
		deckLoaded: false,
		deck: [],
		player1: {
			name: "Player 1",
			hand: [],
			winPile: []
		},
		player2: {
			name: "Player 2 (CPU)",
			hand: [],
			winPile: []
		},
		warZone: {
			player1: [],
			player2: []
		}
	},
	computed: {
		gameState: function() {
			if ( this.deck.length ) return 'deal';		//do we need to make sure we're not doing something else?
			// if ( this.player1.playedCards.length === 0 && this.player2.playedCards.length === 0 ) return 'playRound';
			if ( this.warZone.player2.length === 0 || this.warZone.player1.length === 0 ) return 'playCards';
			if ( this.warZone.player2.length === this.warZone.player1.length ) return 'determineRoundWinner';
			// shuffle cpu cards
			// shuffle player card
			// cpu play card
			// prompt player to play card
			// war??
			// determine game winner

			return;
		},
		nextAction: function() {
			//Deal
			//player 1 play
		}
	},
	watch: {
		gameState: function(value) {
			console.log("gameState", value);
			if ( value === 'deal' ) {
				this.deal();
			}
			else if ( value === 'playCards' ) {
				this.playCard('player2');
				console.log("player1 play card....");
				//todo: tell user to click their deck to play a card
			}
			else if ( value === 'determineRoundWinner' ) {
				var _self = this;
				setTimeout(function() {
					_self.determineRoundWinner();
				}, 500);
			}
		}
	},
	methods: {
		examinePlayerHand: function(player) {

		},
		determineRoundWinner: function() {
			var player1Card = this.warZone.player1[this.warZone.player1.length-1];
			var player2Card = this.warZone.player2[this.warZone.player2.length-1];

			if ( player1Card.value === player2Card.value ) {
				console.log("war!"); //todo
				alert("war!!!!");
			}
			else if ( player1Card.value > player2Card.value ) {
				console.log("Player 1 win!");
				this.giveCardsToRoundWinner('player1');
			}
			else {
				console.log("Player 2 wins");
				this.giveCardsToRoundWinner('player2');
			}
		},
		giveCardsToRoundWinner: function(player) {
			while ( this.warZone.player1.length ) {
				var card = this.warZone.player1.pop();
				this[player].winPile.push(card);
			}
			while ( this.warZone.player2.length ) {
				var card = this.warZone.player2.pop();
				this[player].winPile.push(card);
			}
		},
		playCard: function(player) {			
			// if ( this.gameState != player + 'PlayCard') return;
			var card = this[player].hand.pop();
			card.revealed = true;
			console.log(player + " plays " + card.value + card.suit);
			this.warZone[player].push(card);
		},
		deal: function() {
			var _self = this;
			this.deck = shuffle(this.deck);
			// this.player1.hand = [];
			// this.player2.hand = [];

			var players = [
				this.player1,
				this.player2
			];

			while (this.deck.length > 0) {
				// setTimeout(function() {
					var card = _self.deck.pop();
					_self.player1.hand.push(card);

					card = _self.deck.pop();
					_self.player2.hand.push(card);
				// }, 1);
			}
		}
	},
	mounted: function() {
		for( var s = 0; s < cardSuits.length; s++ ) {
	      for( var n = 0; n < cardValues.length; n++ ) {
          this.deck.push({
						value: cardValues[n],
						suit: cardSuits[s]
					})
	      }
	  }
	}
})

function shuffle(cards) {
	var j, x, i;
	for (i = cards.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			x = cards[i];
			cards[i] = cards[j];
			cards[j] = x;
	}

	return cards;
}

})()
