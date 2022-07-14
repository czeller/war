<script>
import { mapStores } from 'pinia'
import { wargameStore } from './store'

export default {
  name: 'App',
  components: {
    WarGame: require("/src/components/WarGame").default,
    NewGame: require("/src/components/NewGame").default,
  },
  computed: {
    ...mapStores(wargameStore)
  },
}
</script>

<template>
  <div>
    <WarGame v-if="wargameStore.players.length > 0"></WarGame>

    <NewGame v-show="wargameStore.players.length == 0"></NewGame>
  </div>
</template>

<style>

</style>