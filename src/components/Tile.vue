<template>
  <div :class="{tile: true, halfSize: halfSize}">
    <svg v-if="type.blank" @click="$emit('clicked')" class="blank"/>
    <svg v-else @click="svgClick" style="background: green">

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

      <polygon v-if="meeple" :points="meeplePoints" :style="meepleStyle"/>
      <polygon v-if="meeple" :points="meeplePointsMirrorX" :style="meepleStyle"/>
      <path v-if="meeple" d="M-.03,.15 a.05,.05 0 1,0 .06,0" :style="meepleStyle" />

      <circle v-if="type.bonus" cx="82" cy="18" r="10" style="fill:blue" />

      <polygon v-for="(pos,idx) in meepleSelect" :points="meepleSelectPoints(pos).map((x) => String(x)).join(' ')" :style="{fill:'none', stroke: meepleSelectColor, 'stroke-width':2, transform: 'scale(1,-1)', 'transform-origin': 'center'}" :key="'ms'+idx" />

      <rect x="0" y="0" rx="2" ry="2" width="100" height="100" style="fill:none;stroke:black;stroke-width:2;opacity:1" />
    </svg>
    <div @click="$emit('clicked')" v-if="selectable" class="selectable" :style="userStyle"/>
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
    },
    selectColor: {
      type: String,
      default: 'blue'
    },
    halfSize: {
      type: Boolean,
      default: false
    },
    meeple: {
      type: Object,
      default: null
    },
    meepleSelect: {
      type: Array,
      default: () => null
    },
    meepleSelectColor: {
      type: String,
      default: 'blue'
    }
  },
  methods: {
    svgClick (event) {
      const clickPos = [ event.offsetX, 100 - event.offsetY ]

      if (this.meeple) {
        const p = this.meeple.position
        const p1 = this.meepleSelectPoints(p)[0]
        const p2 = this.meepleSelectPoints(p)[2]
        if (clickPos[0] >= p1[0] && clickPos[0] <= p2[0] &&
            clickPos[1] >= p1[1] && clickPos[1] <= p2[1]) {
          this.$emit('meepleClicked', {...this.meeple})
        }
      }

      let pos = null
      if (this.meepleSelect) {
        this.meepleSelect.forEach((p) => {
          const p1 = this.meepleSelectPoints(p)[0]
          const p2 = this.meepleSelectPoints(p)[2]

          if (clickPos[0] >= p1[0] && clickPos[0] <= p2[0] &&
              clickPos[1] >= p1[1] && clickPos[1] <= p2[1]) {
            pos = p
          }
        })
      }

      this.$emit('clicked', pos)
    },
    cityPoints (pos) {
      const a = this.type.split ? 35 : 30
      const b = this.type.split ? 65 : 70
      if (pos === 0) return '000,000 100,000 ' + b + ',030 ' + a + ',030'
      if (pos === 1) return '100,000 100,100 070,' + b + ' 070,' + a
      if (pos === 2) return '000,100 100,100 ' + b + ',070 ' + a + ',070'
      if (pos === 3) return '000,100 000,000 030,' + a + ' 030,' + b
    },
    meepleSelectPoints (pos) {
      const radius = 13
      const size = 2 * radius
      const offset = 32
      const v = [
        50 + ((offset * pos[0]) - radius),
        50 + ((offset * pos[1]) - radius)
      ]
      const ps = [
        [v[0], v[1]],
        [v[0], v[1] + size],
        [v[0] + size, v[1] + size],
        [v[0] + size, v[1]]
      ]
      return ps
    }
  },
  computed: {
    meepleScale () {
      return [70, 60]
    },
    meepleTranslate () {
      const x = 50 + (this.meeple.position[0] * 35 / this.meepleScale[0])
      const y = 50 + (this.meeple.position[1] * 32 / this.meepleScale[1])
      return 'translate(' + x + 'px, ' + y + 'px)'
    },
    meeplePoints () {
      return '0,-.05 .05,-.15 .15,-.15 .07,.01 .07,.06 .15,.10 .15,.13 .05,.15 0,.15'
    },
    meeplePointsMirrorX () {
      return '-0,-.05 -.05,-.15 -.15,-.15 -.07,.01 -.07,.06 -.15,.10 -.15,.13 -.05,.15 -0,.15'
    },
    meepleStyle () {
      const s = this.meepleScale
      return {
        fill: this.meeple.color,
        transform: 'scale(' + s[0] + ', -' + s[1] + ') ' + this.meepleTranslate,
        'transform-origin': 'center'
      }
    },
    fillMiddle () {
      const sides = this.type.sides
      return !this.type.split && (
        (sides[0] === 'c' && sides[2] === 'c') ||
        (sides[1] === 'c' && sides[3] === 'c')
      )
    },
    userStyle () {
      return {
        '--shadow-color': this.selectColor
      }
    }
  }
}
</script>

<style scoped lang="scss">
.tile {
  display: inline-block;
  position: relative;
  width: 100px;
  height: 100px;
  svg {
    position: absolute;
    width: 100px;
    height: 100px;
    top: 0;
    left: 0;
  }
}
.tile.halfSize {
  width: 50px;
  height: 50px;
  svg {
    transform: scale(0.5) translate(-50px, -50px);
  }
}
.selectable {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.selectable:hover {
    box-shadow:inset 0px 0px 0px 5px var(--shadow-color);
}
</style>
