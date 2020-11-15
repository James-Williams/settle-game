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
    if (this.$router) {
      this.items = this.$router.options.routes
        .filter((x) => x.component)
        .filter((x) => x.label)
        .filter((x) => x.path)
    }
  }
}
</script>

<style scoped lang="scss">
div {
  text-align: left;
  a:not(:last-child) {
    margin-right: 1em;
  }
  margin-bottom: 1ex;
  margin-left: 0.5ex;
  margin-right: 0.5ex;
  margin-top: 0.5ex;
}
</style>
