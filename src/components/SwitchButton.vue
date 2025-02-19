<script setup lang="ts">
// import { theme } from '@/stores/theme'
// const Theme = theme()
</script>
<script lang="ts">
import './../css/global.css'
export default {
  emits: ['enable', 'disable'],
  data() {
    return {
      isHovered: false,
      hoverRate: 1.2
    }
  },
  props: {
    status: {
      type: Boolean,
      required: false,
      default: true
    },
    height: {
      type: Number,
      required: false,
      default: 25
    },
    width: {
      type: Number,
      required: false,
      default: 50
    },
    buttonRate: {
      type: Number,
      required: false,
      default: 0.6
    }
  },
  methods: {
    doSwitch() {
      if (!this.status) this.$emit('enable')
      else this.$emit('disable')
    }
  }
}
</script>

<template>
  <div
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
    @mousedown="doSwitch"
    :class="['outter transGlobal', status ? 'outterEna' : 'outterDis']"
    :style="
      status
        ? {
            height: height + 'px',
            width: width + 'px',
            borderRadius: height / 2 + 'px',
            justifyContent: 'flex-end'
          }
        : {
            height: height + 'px',
            width: width + 'px',
            borderRadius: height / 2 + 'px',
            justifyContent: 'flex-start'
          }
    "
  >
    <div
      :class="['push', status ? 'pushEna' : 'pushDis']"
      :style="
        status
          ? {
              height: height * Math.min(buttonRate * (isHovered ? hoverRate : 1), 1) + 'px',
              width: height * Math.min(buttonRate * (isHovered ? hoverRate : 1), 1) + 'px',
              borderRadius:
                height * Math.min(buttonRate * (isHovered ? hoverRate : 1), 1) * 0.5 + 'px',
              marginLeft: '',
              marginRight:
                height * (0.5 - Math.min(buttonRate * (isHovered ? hoverRate : 1), 1) / 2) + 'px'
            }
          : {
              height: height * Math.min(buttonRate * (isHovered ? hoverRate : 1), 1) + 'px',
              width: height * Math.min(buttonRate * (isHovered ? hoverRate : 1), 1) + 'px',
              borderRadius:
                height * Math.min(buttonRate * (isHovered ? hoverRate : 1), 1) * 0.5 + 'px',
              marginLeft:
                height * (0.5 - Math.min(buttonRate * (isHovered ? hoverRate : 1), 1) / 2) + 'px',
              marginRight: ''
            }
      "
    ></div>
  </div>
</template>

<style scoped>
.outter {
  transition: 100ms;
  display: flex;
  align-items: center;
  overflow: hidden;
  justify-content: flex-end;
  box-shadow: inset 0px 0px 10px rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

.push {
  transition: 100ms;
  background-color: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 1);
}

.outterEna {
  background-color: rgb(110, 110, 255);
}

.outterDis {
  background-color: rgb(255, 255, 0);
}
</style>
