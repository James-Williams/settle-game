<template>
  <div class="tile">
    <svg v-if="type.blank" class="blank" width="100" height="100"/>
    <svg v-else width="100" height="100" style="background: green">

      <rect v-if="type.sides[0] == 'r'" x="42" y="00" width="16" height="50" style="stroke:none;fill:white"/>
      <rect v-if="type.sides[1] == 'r'" x="50" y="42" width="50" height="16" style="stroke:none;fill:white"/>
      <rect v-if="type.sides[2] == 'r'" x="42" y="50" width="16" height="50" style="stroke:none;fill:white"/>
      <rect v-if="type.sides[3] == 'r'" x="00" y="42" width="50" height="16" style="stroke:none;fill:white"/>

      <polygon v-if="type.sides[0] == 'c'" points="000,000 100,000 070,030 030,030" style="fill:brown;" />-->
      <polygon v-if="type.sides[1] == 'c'" points="100,000 100,100 070,070 070,030" style="fill:brown;" />
      <polygon v-if="type.sides[2] == 'c'" points="000,100 100,100 070,070 030,070" style="fill:brown;" />
      <polygon v-if="type.sides[3] == 'c'" points="000,100 000,000 030,030 030,070" style="fill:brown;" />

      <polygon v-if="fillMiddle" points="30,30 30,70 70,70 70,30" style="fill:brown;" />

      <polygon v-if="type.cloister" points="36,36 50,30 64,36 64,64 36,64" style="fill:brown;" />

      <rect x="0" y="0" rx="2" ry="2" width="100" height="100" style="fill:none;stroke:black;stroke-width:2;opacity:1" />
    </svg>
    <div @click="$emit('clicked')" v-if="type.selectable" class="selectable" />
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: Object
    }
  },
  computed: {
    fillMiddle () {
      const sides = this.type.sides
      return !this.type.split && (
        (sides[0] == 'c' && sides[2] == 'c') ||
        (sides[1] == 'c' && sides[3] == 'c')
      )
    }
  }
}
</script>

<style scoped lang="scss">
.tile {
  display: inline-block;
  position: relative;
}
.selectable {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.selectable:hover {
    box-shadow:inset 0px 0px 0px 5px blue;
}
</style>
