<template>
  <div class="zoom-control">
    <button @click="$emit('zoom100')" class="zoom-button">100%</button>
    <button @click="$emit('zoomSeeAll')" class="zoom-button">See all</button>
  </div>
</template>

<script>
</script>

<style scoped lang="scss">
.zoom-control {
  position: absolute;
  top: 0;
  left: 0;
  background-color: white;
  z-index: 9999;
}
.zoom-button {
  height: 32px;
}
</style>
