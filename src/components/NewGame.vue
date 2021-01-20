<template>
  <div class="page">
    <a @click="start">Start New Game</a>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  methods: {
    start () {
      axios.post('/api/game')
        .then((res) => {
          const gameId = res.data.gameId
          window.location = '/play/' + gameId
        })
    }
  }
}
</script>

<style scoped lang="scss">
.page {
  margin: 1em;
  width: 100%;
  display: flex;
  flex-direction: column;
}
a {
  cursor: pointer;
}
</style>
