<script>
import { mapStores } from 'pinia'
import { wargameStore } from '/src/store'

export default {
  components: {
    Player: require("/src/components/Player").default,
    Winner: require("/src/components/Winner").default,
    Battle: require("/src/components/Battle").default,
    PlayingCard: require("/src/components/PlayingCard").default
  },
  computed: {
    ...mapStores(wargameStore),

    //determine when game is over
    winningPlayer() {
      let playersInGame = this.wargameStore.players.filter((p, i) => {
        return this.wargameStore.losingPlayerIndexes.indexOf(i) == -1;
      });

      return playersInGame[0]; //todo

      if (playersInGame.length == 1) {
        return playersInGame[0];
      }
    }
  },
  watch: {
    "wargameStore.battles": {
      deep: true,
      handler() {
        let currentBattle = this.wargameStore.battles[this.wargameStore.battles.length-1];

        if (!currentBattle) {
          return;
        }

        for (let i=0; i<currentBattle.players.length; i++) {
          if (currentBattle.players[i].cards.length != currentBattle.numberOfCardsRequired) {
            //if player has 0 cards, they lose
            if (this.wargameStore.players[i].hand.length == 0) {
              this.wargameStore.addLosingPlayer(i);
            }
          }
        }
      },
    }
  },

  data() {
    return {
      deck: []
    }
  },

  methods: {

  },

  mounted() {
    for(let s = 0; s < this.wargameStore.cardSuits.length; s++) {
      for(let n = 0; n < this.wargameStore.cardValues.length; n++) {
        this.deck.push({
          value: this.wargameStore.cardValues[n],
          suit: this.wargameStore.cardSuits[s]
        });
      }
    }

    //shuffle cards
    this.deck.sort(() => Math.random() - .5);

    //deal cards
    let playerIndex = 0;
    let players = this.wargameStore.players.map((player) => {
      return {
        ...player,
        hand: [],
      }
    });

    //todo: all players should have same number of cards
    while (this.deck.length > 0) {
      let card = this.deck.pop();
      players[playerIndex].hand.push(card);

      playerIndex++;
      if (playerIndex > players.length-1) {
        playerIndex = 0;
      }
    }

    this.wargameStore.setPlayers(players);

    this.wargameStore.resetBattles();
    this.wargameStore.addBattle();
  }
}
</script>

<template>
  <div>
    <div v-if="winningPlayer">
      <Winner :player="winningPlayer"></Winner>
    </div>
    <div v-else>
      <div style="display:flex; justify-content:space-between">
        <Player
          v-for="(player, index) in wargameStore.players"
          :key="index"
          v-bind="{
            ...player,
            index
          }"
        ></Player>
      </div>
      <div style="min-height:50vh; background-color:gray;">
        <Battle
          v-if="wargameStore.battles.length > 0"
          v-bind="{
            ...wargameStore.battles[wargameStore.battles.length-1],
          }"
        ></Battle>
      </div>
    </div>
  </div>
</template>

<style>

</style>
