<template>
  <div :class="{'player-info':true, selected: selected}" @click.self="$emit('backgroundClick')">
    <svg v-for="(x, idx) in Array(maxMeeple).fill(true)" :class="{meeple: true, hide: idx >= meepleCount}" :key="idx" :width="size[0]" :height="size[1]" @click="$emit('meepleClick')">
      <polygon :points="meeplePoints" :style="meepleStyle"/>
      <polygon :points="meeplePointsMirrorX" :style="meepleStyle"/>
      <path d="M-.03,.15 a.05,.05 0 1,0 .06,0" :style="meepleStyle" />
    </svg>
    <span @click="$emit('scoreClick')" class="score">
       {{ playerType }} {{ score }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: 'blue'
    },
    meepleCount: {
      type: Number,
      default: 1
    },
    maxMeeple: {
      type: Number,
      default: 7
    },
    score: {
      type: Number,
      default: 0
    },
    selected: {
      type: Boolean,
      default: true
    },
    isComputer: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    playerType () {
      if (this.isComputer) return '(C)'
      else return '(H)'
    },
    meeplePoints () {
      return '0,-.05 .05,-.15 .15,-.15 .07,.01 .07,.06 .15,.10 .15,.13 .05,.15 0,.15'
    },
    meeplePointsMirrorX () {
      return '-0,-.05 -.05,-.15 -.15,-.15 -.07,.01 -.07,.06 -.15,.10 -.15,.13 -.05,.15 -0,.15'
    },
    size () {
      return [15, 17]
    },
    meepleStyle () {
      return {
        fill: this.color,
        transform: 'scale(48,-42) translate(0.15px, -0.25px)'
      }
    }
  }
}
</script>

<style scoped lang="scss">
.player-info {
  min-width: 50px;
  max-width:100px;
  direction: rtl;
  padding: 2px;
}
.score {
  font-weight: bold;
  min-width: 55px;
  white-space:nowrap;
}
.selected {
  background: silver;
}
.hide {
  visibility: hidden;
}
</style>
