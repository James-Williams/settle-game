<template>
  <div class="page">
    <a @click="start">Start New Game</a>
  </div>
</template>

<script>
  export default {
    methods: {
      start () {
        alert("All Right!")
      }
    }
  }
</script>

<style scoped lang="scss">
.page {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  height: 100vh;
  height: -webkit-fill-available;
}
</style>
