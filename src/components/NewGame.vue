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
  },
  created () {
    console.log('bang')
    const socket = io()
    socket.on('newState', (href) => {
      console.log('Need to read: ' + href)
    })
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
