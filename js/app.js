(function(){

/***************************
COMPONENTS
***************************/

Vue.component("card", {
	template: `
		<div class="card" style="position:absolute;">
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
		suit: ""
	},
	data: function() {
		return {
			revealed: false
		}
	},
	watch: {},
	methods: {},
	mounted: function() {

	}
});


new Vue({
	el: "#app",
	data: {
		deck: [],
		player1: {
			hand: [],
			winPile: []
		},
		player2: {
			hand: [],
			winPile: []
		}
	},
	methods: {
		deal: function() {
			this.deck = shuffle(this.deck);
			// this.player1.hand = [];
			// this.player2.hand = [];

			var players = [
				this.player1,
				this.player2
			];

			while (this.deck.length > 0) {
				var card = this.deck.pop();
				this.player1.hand.push(card);

				card = this.deck.pop();
				this.player2.hand.push(card);
			}
		}
	},
	mounted: function() {
		var values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
		var suits = ['H','D','S','C'];
		for( var s = 0; s < suits.length; s++ ) {
	      for( var n = 0; n < values.length; n++ ) {
          this.deck.push({
						value: values[n],
						suit: suits[s]
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

/*
USE VUE
USE VUEX
*/

/***************************
CLASSES
***************************/

function Player(number, cardsInHand) {
	this.name = "Player " + number;
	this.cardsInHand = cardsInHand || [];
	this.discardPile = [];

	this.warCardEl = document.getElementById("warcard-player" + number);
	this.el = document.getElementById("player" + number);

	this.addCardToHand = function(card) {
		this.cardsInHand.push(card);

		var el = document.createElement("div");
		el.innerHTML = card.label;
		this.el.appendChild(el);
	}

	this.playCard = function() {
		var card = this.cardsInHand.pop();
		var el = document.createElement("div");
		el.innerHTML = card.label;
		this.warCardEl.appendChild(el);

		if ( this.cardsInHand.length === 0 ) {
			alert("you lose!");
		}
	}
}


function Card(value, name, suit) {
	this.value = value;
	this.name = name;
	this.suit = suit;
	this.label = name + ' of ' + suit;
	// this.img TOOD
}

// https://devdojo.com/blog/tutorials/create-a-deck-of-cards-in-javascript
function Deck() {
	this.names = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
	this.suits = ['Hearts','Diamonds','Spades','Clubs'];

	this.initCards = function() {
		var cards = [];
		var lowestCardValue = 2;
	  for( var s = 0; s < this.suits.length; s++ ) {
	      for( var n = 0; n < this.names.length; n++ ) {
	          cards.push( new Card( n+lowestCardValue, this.names[n], this.suits[s] ) );
	      }
	  }
		return cards;
	}

	this.cards = this.initCards();

	this.shuffle = function() {
		var j, x, i;
		for (i = this.cards.length - 1; i > 0; i--) {
				j = Math.floor(Math.random() * (i + 1));
				x = this.cards[i];
				this.cards[i] = this.cards[j];
				this.cards[j] = x;
		}

		return this.cards;
	}

	this.deal = function(players) {
		// clear player's hands
		for (var p=0; p<players.length; p++) {
			players[p].el.innerHTML = "";
		}

		var cards = this.shuffle();
		for (var i=0; i<cards.length; i++) {
			var curPlayer = players[i % players.length].addCardToHand(cards[i]);
		}
	}
}

// function shuffle(a) {
// 		var j, x, i;
// 		for (i = a.length - 1; i > 0; i--) {
// 				j = Math.floor(Math.random() * (i + 1));
// 				x = a[i];
// 				a[i] = a[j];
// 				a[j] = x;
// 		}
// }


/***************************
NOT CLASSES
***************************/

function playCard(playerNumber) {
	var player = players[playerNumber-1];
	player.playCard();

	// player2 == computer
	// remove play button from player 2
	// when player1 plays, then computer plays

	// define a table/battlefield object

	// when player plays, remove card from hand and add to battlefield
	// battlefield needs to know each player and what card they played

	// once all cards played, determine winner
		// if player 1 wins, they get all the cards
		// if player 2 wins, they get all the cards
		// if cards tied, start war
			// each player puts 3 cards (in a separate space on the battlefield) face down and plays the 4th card
				// determine winner
			// after each card is placed into battlefield, determine if game is over or if player needs to shuffle
}



function playHand() {

}



/***************************
SETUP
***************************/

/*
player1 = new Player(1);
player2 = new Player(2); //todo: distinguish between human and computer
players = [player1, player2]

deck = new Deck();
deck.deal(players);
*/
