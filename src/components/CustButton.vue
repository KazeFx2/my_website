<script setup lang="ts">
import { ref } from 'vue'
import { theme } from '@/stores/theme';

const Theme = theme()

defineEmits(['click'])

defineProps({
  title: {
    type: String,
    required: true
  },
  custTitle: {
    type: String,
    required: false,
    default: ''
  }
})

const isHovered = ref(false)
</script>

<template>
  <button
    :title="custTitle === '' ? title : custTitle"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="$emit('click')"
    :class="['back transGlobal', isHovered ? 'back_hover' : '']"
  >
    <div :class="['txt transGlobal', isHovered ? 'txt_hover' : '', Theme.dark ? 'darkTxt' : 'whiteTxt']" v-html="title"></div>
    <div :class="['highlight transGlobal EpColor', isHovered ? 'highlight_hover' : '']"></div>
    </button>
</template>

<style scoped>
.txt {
  opacity: 0.5;
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 2px;
  padding-bottom: 2px;
  text-align: center;
  user-select: none;
}

.txt_hover {
  opacity: 1;
}

.back {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  justify-content: start !important;
  width: fit-content !important;
  border-radius: 2px;
  font-size: 17px;
  border: none;
  background-color: transparent;
}

.back_hover {
  background-color: rgba(128, 128, 128, 0.5);
}

.highlight {
  position: absolute;
  bottom: 0px;
  width: 0%;
  height: 5px;
  transform: translateX(-6px);
}

.highlight_hover {
  width: 100%;
}
</style>
