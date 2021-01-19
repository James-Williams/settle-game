<template>
  <div class="page">
    <a @click="start">Start New Game</a>
  </div>
</template>

<script>
export default {
  methods: {
    start () {
      alert('All Right!')
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
