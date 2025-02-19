<script setup lang="ts">
import { onMounted, ref, type Ref, watch } from 'vue'

interface EleType {
  scrollWidth: Number
  style: {
    width: String
  }
  value: String
  addEventListener: Function
}

const inpt = ref(null) as unknown as Ref<EleType>

onMounted(() => {
  const ele = inpt as unknown as Ref<EleType>
  setWidth()
  ele.value.addEventListener('input', setWidth)
})

function setWidth() {
  const ele = inpt as unknown as Ref<EleType>
  ele.value.style.width = '0px'
  ele.value.style.width = (ele.value.scrollWidth as number) + 0 + 'px'
}

const txt = defineModel()

watch(txt, () => {
  setTimeout(setWidth, 10)
})
</script>

<template>
  <input ref="inpt" v-model="txt" />
</template>

<style scoped>
#in {
  white-space: nowrap;
}
</style>
