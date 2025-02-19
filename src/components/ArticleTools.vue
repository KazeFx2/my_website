<script setup lang="ts">
import { theme } from '@/stores/theme'
import { ref } from 'vue'
import SwitchButtonIcon from './SwitchButtonIcon.vue'
const Theme = theme()
const isHovered = ref(false)
defineEmits(['setEdit'])
defineProps({
  edit: {
    type: Boolean,
    required: true
  }
})
</script>
<script lang="ts"></script>

<template>
  <div
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    :class="[
      'atc_tools transGlobal',
      Theme.dark ? 'solidDark' : 'solidWhite',
      isHovered ? 'toolsExpand' : ''
    ]"
  >
    <div :class="['toolsIcon']">
      <span class="material-symbols-outlined"> build </span>
    </div>
    <SwitchButtonIcon
      :icon="'edit'"
      :value="edit"
      :title="'启用编辑'"
      @set-val="
        (val: boolean) => {
          $emit('setEdit', val)
        }
      "
    />
  </div>
</template>

<style scoped>
.atc_tools {
  position: fixed;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 50px;
  height: 50px;
  top: calc(33% - 25px);
  right: 5px;
  border-radius: 10px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
  opacity: 0.4;
  pointer-events: auto;
  overflow: hidden;
}
.material-symbols-outlined {
  font-size: 40px;
  line-height: 50px;
}
.toolsIcon {
  text-align: center;
  user-select: none;
}
.toolsExpand {
  width: 100px;
  height: 100px;
  opacity: 1;
}
</style>
