<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from 'vue'

interface EleType {
  style: {
    transform: String
    opacity: Number
  }
}
const emit = defineEmits(['remove'])

const ele = ref(null)

const props = defineProps({
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  },
  id: {
    type: Number,
    required: true
  },
  size: {
    type: Number,
    required: true
  }
})

let mx = 0
let my = 0
const step = 50
const delay = 1000
const keepTime = 5
const enterTime = 1
const feedTime = 1
const mark = ref(false)
const time0 = ref(new Date())
var interval: any
const direction = ref(Math.random() * 2 * Math.PI)
const cos = ref(Math.cos(direction.value))
const sin = ref(Math.sin(direction.value))

function doEnter(now: Number) {
  const i = ele as unknown as Ref<EleType>
  i.value.style.opacity = (now as number) / enterTime
}

function doFeed(now: Number) {
  const i = ele as unknown as Ref<EleType>
  i.value.style.opacity = 1 - (now as number) / feedTime
}

function normal() {
  const i = ele as unknown as Ref<EleType>
  i.value.style.opacity = 1
}

function doMove() {
  if (!mark.value) {
    time0.value = new Date()
    mark.value = true
  }
  const now = new Date()
  const duration = (now.getTime() - time0.value.getTime()) / 1000
  if (duration < enterTime) doEnter(duration)
  else if (duration > keepTime - feedTime && duration <= keepTime)
    doFeed(duration + feedTime - keepTime)
  else if (duration > keepTime) {
    clearInterval(interval)
    emit('remove', props.id)
    return
  } else normal()
  mx = mx + step * cos.value
  my = my + step * sin.value
  setTopLeft()
}

function setTopLeft() {
  const i = ele as unknown as Ref<EleType>
  i.value.style.transform = 'translate(' + Math.floor(mx) + 'px, ' + Math.floor(my) + 'px)'
}

watch(
  () => props.id,
  () => {
    direction.value = Math.random() * 2 * Math.PI
    cos.value = Math.cos(direction.value)
    sin.value = Math.sin(direction.value)
    mx = 0
    my = 0
    interval = setInterval(doMove, delay)
  }
)

onMounted(() => {
  interval = setInterval(doMove, delay)
})
</script>
<template>
  <div :class="['bbk']">
    <div ref="ele" :class="['bk']">
      <div :class="['shadow']"></div>
      <div :class="['pointer']"></div>
    </div>
  </div>
</template>

<style scoped>
.bbk {
  position: absolute;
  width: 100%;
  height: 100%;
}
.bk {
  position: relative;
  top: v-bind(y + '%');
  left: v-bind(x + '%');
  transition-duration: v-bind(delay + 'ms');
  transition-timing-function: linear;
  opacity: 0;
}

.pointer {
  width: v-bind(size + 'px');
  height: v-bind(size + 'px');
  position: absolute;
  background-color: rgba(255, 255, 0, 1);
  border-radius: v-bind(size / 2 + 'px');
  mask: radial-gradient(#000 0%, #0005 50%, #0000);
  animation: 1s ease-in-out 0s alternate infinite floating;
}

.shadow {
  width: v-bind(size + 'px');
  height: v-bind(size + 'px');
  position: absolute;
  border-radius: v-bind(size / 2 + 'px');
  animation: 1s ease-in-out 0s alternate infinite floating;
}

@keyframes floating {
  0% {
    opacity: 0;
    box-shadow: 0px 0px 0px yellow;
  }

  100% {
    opacity: 1;
    box-shadow: 0px 0px 15px yellow;
  }
}
</style>
