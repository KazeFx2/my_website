<script setup lang="ts">
import LightsFloating from './LightsFloating.vue'
import { theme } from '@/stores/theme'
import { onMounted, ref, watch } from 'vue'

const Theme = theme()

interface Point {
  x: Number
  y: Number
  id: Number
}

watch(
  () => Theme.dark,
  (newVal) => {
    enable.value = newVal
    if (newVal && length.value < max.value) Add()
  }
)

const enable = ref(false)

const max = ref(25)

const delay = ref(100)

const ids = ref<Number[]>([])
const lights = ref<Point[]>([])

const xmin = ref(0)
const xmax = ref(100)
const ymin = ref(0)
const ymax = ref(100)

const length = ref(0)

function add() {
  let newId = Math.ceil(Math.random() * max.value)
  while (ids.value.includes(newId)) {
    newId = Math.ceil(Math.random() * max.value)
  }
  ids.value.push(newId)
  lights.value.push({
    id: newId,
    x: Math.floor(xmin.value + (xmax.value - xmin.value) * Math.random()),
    y: Math.floor(ymin.value + (ymax.value - ymin.value) * Math.random())
  })
  if (length.value < max.value) {
    length.value++
    setTimeout(add, delay.value)
  }
}

function override(index_id: Number, index_light: Number) {
  let newId = Math.ceil(Math.random() * (max.value + 1))
  while (ids.value.includes(newId)) {
    newId = Math.ceil(Math.random() * (max.value + 1))
  }
  ids.value[index_id as number] = newId
  lights.value[index_light as number] = {
    id: newId,
    x: xmin.value + (xmax.value - xmin.value) * Math.random(),
    y: ymin.value + (ymax.value - ymin.value) * Math.random()
  }
}

function remove(id: Number) {
  const index = ids.value.indexOf(id)
  if (index === -1) return
  let i = 0
  for (; i < lights.value.length; i++) {
    if (lights.value[i].id === id) {
      if (enable.value)
        setTimeout(
          () => {
            override(index, i)
          },
          Math.ceil(Math.random() * delay.value)
        )
      else {
        ids.value.splice(index, 1)
        lights.value.splice(i, 1)
        length.value--
      }
      return
    }
  }
}

function Add() {
  length.value++
  add()
}

onMounted(() => {
  Add()
})
</script>
<template>
  <div :class="['bk']">
    <LightsFloating
      v-for="item in lights"
      :key="item.id as number"
      :x="item.x as number"
      :y="item.y as number"
      :size="20"
      :id="item.id as number"
      @remove="remove"
    />
  </div>
</template>

<style scoped>
.bk {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* background-color: black; */
}

.bk::-webkit-scrollbar {
  width: 0px;
}
</style>
