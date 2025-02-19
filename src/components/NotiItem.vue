<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

interface EleType {
  scrollHeight?: number
  style?: {
    height: string
  }
}

const prop = defineProps({
  type: {
    type: String,
    required: false,
    default: 'success'
  },
  message: {
    type: String,
    required: false,
    default: 'TEST'
  }
})
const box = ref(null)
const noti = ref(null)

const backColor = ref('')
const fontColor = ref('')
const icon = ref('')
chColor()

function chColor() {
  if (prop.type === 'info') {
    icon.value = 'info'
    backColor.value = 'rgba(64, 64, 175, 1)'
    fontColor.value = 'rgba(200, 200, 255, 1)'
  } else if (prop.type === 'success') {
    icon.value = 'check_circle'
    backColor.value = 'rgba(0, 175, 0, 1)'
    fontColor.value = 'rgba(216, 255, 216, 1)'
  } else if (prop.type === 'warn') {
    icon.value = 'error'
    backColor.value = 'rgba(175, 175, 0, 1)'
    fontColor.value = 'rgba(255, 255, 200, 1)'
  } else if (prop.type === 'error') {
    icon.value = 'cancel'
    backColor.value = 'rgba(175, 0, 0, 1)'
    fontColor.value = 'rgba(255, 200, 200, 1)'
  } else {
    icon.value = 'help'
    backColor.value = 'rgba(128, 128, 128, 1)'
    fontColor.value = 'rgba(255, 255, 255, 1)'
  }
}

watch(
  () => prop.type,
  (newVal, oldVal) => {
    if (newVal === oldVal) return
    chColor()
  }
)

watch(
  () => prop.message,
  () => {
    setTimeout(calcHeight, 1)
  }
)

function calcHeight() {
  if (noti.value && box.value) {
    const a = ref<EleType>(noti.value)
    const b = ref<EleType>(box.value)
    if (a.value.scrollHeight && b.value.style) {
      b.value.style.height = a.value.scrollHeight + 'px'
    }
  }
}

onMounted(calcHeight)
</script>
<script lang="ts"></script>

<template>
  <div ref="box" :class="['NotiBox']">
    <div ref="noti" :class="['Notification']">
      <div :class="['leftIcon']">
        <span class="material-symbols-outlined">
          {{ icon }}
        </span>
      </div>
      <div :class="['rightContent']" v-html="message"></div>
    </div>
  </div>
</template>

<style scoped>
.leftIcon {
  height: fit-content;
  width: 30px;
  transform: translateY(1px);
}

.rightContent {
  /* margin-left: 5px; */
  width: calc(100% - 30px);
  line-height: 17px;
  font-size: 12px;
  text-wrap: wrap;
  text-align: center;
}

.NotiBox {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  /* overflow: hidden; */
}

.Notification {
  position: relative;
  display: flex;
  align-items: center;
  width: 80%;
  max-width: 400px;
  height: fit-content;
  /* height: fit-content; */
  border-radius: 5px;
  padding: 10px;
  background-color: v-bind(backColor);
  color: v-bind(fontColor);
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}
</style>
