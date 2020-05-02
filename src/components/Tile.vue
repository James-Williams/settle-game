<template>
  <div class="tile">
    <svg v-if="type.blank" @click="$emit('clicked')" class="blank" width="100" height="100"/>
    <svg v-else @click="$emit('clicked')" width="100" height="100" style="background: green">

      <rect v-if="type.sides[0] == 'r'" x="42" y="00" width="16" height="50" style="stroke:none;fill:white"/>
      <rect v-if="type.sides[1] == 'r'" x="50" y="42" width="50" height="16" style="stroke:none;fill:white"/>
      <rect v-if="type.sides[2] == 'r'" x="42" y="50" width="16" height="50" style="stroke:none;fill:white"/>
      <rect v-if="type.sides[3] == 'r'" x="00" y="42" width="50" height="16" style="stroke:none;fill:white"/>

      <polygon v-if="type.sides[0] === 'c'" :points="cityPoints(0)" style="fill:brown;" />
      <polygon v-if="type.sides[1] === 'c'" :points="cityPoints(1)" style="fill:brown;" />
      <polygon v-if="type.sides[2] === 'c'" :points="cityPoints(2)" style="fill:brown;" />
      <polygon v-if="type.sides[3] === 'c'" :points="cityPoints(3)" style="fill:brown;" />

      <polygon v-if="fillMiddle" points="30,30 30,70 70,70 70,30" style="fill:brown;" />

      <polygon v-if="type.cloister" points="36,36 50,30 64,36 64,64 36,64" style="fill:brown;" />

      <circle v-if="type.bonus" cx="82" cy="18" r="10" style="fill:blue" />

      <rect x="0" y="0" rx="2" ry="2" width="100" height="100" style="fill:none;stroke:black;stroke-width:2;opacity:1" />
    </svg>
    <div @click="$emit('clicked')" v-if="selectable" class="selectable" />
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: Object
    },
    selectable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    cityPoints (pos) {
      const a = this.type.split ? 35 : 30
      const b = this.type.split ? 65 : 70
      if (pos === 0) return '000,000 100,000 ' + b + ',030 ' + a + ',030'
      if (pos === 1) return '100,000 100,100 070,' + b + ' 070,' + a
      if (pos === 2) return '000,100 100,100 ' + b + ',070 ' + a + ',070'
      if (pos === 3) return '000,100 000,000 030,' + a + ' 030,' + b
    }
  },
  computed: {
    fillMiddle () {
      const sides = this.type.sides
      return !this.type.split && (
        (sides[0] === 'c' && sides[2] === 'c') ||
        (sides[1] === 'c' && sides[3] === 'c')
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
