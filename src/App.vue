<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { io } from 'socket.io-client'
export default {
  created () {
    io().on('message', (text) => {
      console.log('Server: ' + text)
    })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  box-sizing: content-box;
  line-height: normal;
}
body {
  margin: 0 !important;
}
</style>
