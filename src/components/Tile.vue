<template>
  <svg v-if="type.blank" width="100" height="100"/>
  <svg v-else width="100" height="100" style="background: green">

    <rect v-if="type.sides[0] == 'r'" x="42" y="00" width="16" height="50" style="stroke:none;fill:white"/>
    <rect v-if="type.sides[1] == 'r'" x="50" y="42" width="50" height="16" style="stroke:none;fill:white"/>
    <rect v-if="type.sides[2] == 'r'" x="42" y="50" width="16" height="50" style="stroke:none;fill:white"/>
    <rect v-if="type.sides[3] == 'r'" x="00" y="42" width="50" height="16" style="stroke:none;fill:white"/>

    <polygon v-if="type.sides[0] == 'c'" points="000,000 100,000 050,050" style="fill:brown;" />-->
    <polygon v-if="type.sides[1] == 'c'" points="100,000 100,100 050,050" style="fill:brown;" />
    <polygon v-if="type.sides[2] == 'c'" points="000,100 100,100 050,050" style="fill:brown;" />
    <polygon v-if="type.sides[3] == 'c'" points="000,100 000,000 050,050" style="fill:brown;" />

    <polygon v-if="type.cloiser" points="36,36 50,30 64,36 64,64 36,64" style="fill:brown;" />

    <rect x="0" y="0" rx="2" ry="2" width="100" height="100" style="fill:none;stroke:black;stroke-width:2;opacity:1" />
  </svg>
</template>

<script>
export default {
  props: {
    type: {
      type: Object
    }
  }
}
</script>

<style scoped>
</style>
