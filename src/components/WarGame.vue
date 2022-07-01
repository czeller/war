<script>
import { mapStores } from 'pinia'
import { wargameStore } from '/src/store'

const cardValues = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const cardSuits = ['H','D','S','C'];

export default {
  components: {
    Player: require("/src/components/Player").default,
    Battle: require("/src/components/Battle").default,
    PlayingCard: require("/src/components/PlayingCard").default
  },
  computed: {
    ...mapStores(wargameStore)
  },
  data() {
    return {
      deck: []
    }
  },

  mounted() {
    for(let s = 0; s < cardSuits.length; s++) {
      for(let n = 0; n < cardValues.length; n++) {
        this.deck.push({
          value: cardValues[n],
          suit: cardSuits[s]
        });
      }
    }

    //shuffle cards
    this.deck.sort(() => .5 - Math.random());

    //deal cards
    let playerIndex = 0;
    let players = this.wargameStore.players.map((player) => {
      return {
        ...player,
        hand: [],
      }
    });

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
    <div style="display:grid; grid-template-columns:1fr 1fr">
      <div>
        <Player
          v-for="(player, index) in wargameStore.players"
          :key="index"
          v-bind="{
            ...player,
            index
          }"
        ></Player>
      </div>
      <div>
        <Battle
          v-for="(battle, index) in wargameStore.battles"
          :key="index"
          v-bind="{
            ...battle,
            numberOfCardsRequired: index == 0 ? 1 : 2
          }"
        ></Battle>
      </div>
    </div>
  </div>
</template>

<style>

</style>
