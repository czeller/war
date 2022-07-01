<script>
import { mapStores } from 'pinia'
import { wargameStore } from './store'

export default {
  name: 'App',
  components: {
    WarGame: require("/src/components/WarGame").default,
  },
  computed: {
    ...mapStores(wargameStore)
  },
  mounted() {
    this.wargameStore.setPlayers(
      [ //todo: let user define players
        {
          name: "Chris",
          human: true
        },
        {
          name: "Ryan",
          human: true
        }
      ],
    )
  }
}
</script>

<template>
  <div>
    <WarGame v-if="wargameStore.players.length > 0"></WarGame>
  </div>
</template>

<style>

</style>
