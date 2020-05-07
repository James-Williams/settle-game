<template>
  <div>
      <a v-for="(item, idx) in items" :href="item.path" :key="idx">{{item.label}}</a>
  </div>
</template>

<script>
export default {
  data () {
    return {
      items: []
    }
  },
  created () {
    this.items = this.$router.options.routes
      .filter((x) => x.component)
      .filter((x) => x.label)
      .filter((x) => x.path)
  }
}
</script>

<style scoped lang="scss">
div {
  text-align: left;
  a {
    margin-left: 1em;
  }
}
</style>
