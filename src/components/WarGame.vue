<script>
import { mapStores } from 'pinia'
import { wargameStore } from '/src/store'

export default {
  components: {
    Player: require("/src/components/Player").default,
    Battle: require("/src/components/Battle").default,
    PlayingCard: require("/src/components/PlayingCard").default
  },
  computed: {
    ...mapStores(wargameStore)

    //todo: determine when game is over (show winner, summary, etc...)
    //todo: start a new game after game is over
  },
  data() {
    return {
      deck: []
    }
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
          }"
        ></Battle>
      </div>
    </div>
  </div>
</template>

<style>

</style>
