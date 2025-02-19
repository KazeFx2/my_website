<script setup lang="ts">
import { ref } from 'vue'
defineEmits(['click'])
defineProps({
  titile: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'black'
  },
  bkColor: {
    type: String,
    default: 'rgba(128, 128, 128, 0.5)'
  },
  bkColorHover: {
    type: String,
    default: 'null'
  },
  icon: {
    type: String,
    default: 'null'
  }
})
const isHovered = ref(false)
</script>
<script></script>

<template>
  <div
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="$emit('click')"
    :title="titile"
    :class="['aboutItem transGlobal', isHovered ? 'aboutItemHover' : '']"
  >
    <div
      :class="['aboutIcon', icon === 'null' ? 'aboutIconHidden' : '']"
      :style="{ 'background-image': 'url(' + icon + ')' }"
    ></div>
    <div :class="['txt']">
      {{ titile }}
    </div>
  </div>
</template>

<style scoped>
.aboutItem {
  width: 100%;
  height: 30px;
  background-color: v-bind(bkColor);
  color: v-bind(color);
  border-radius: 15px;
  border: 1px solid rgba(128, 128, 128, 1);
  pointer-events: auto;
  cursor: pointer;
  text-align: center;
  line-height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.aboutItemHover {
  background-color: v-bind("bkColorHover != 'null' ? bkColorHover : bkColor");
}

.txt {
  /* background-color: aqua; */
  width: fit-content;
}

.aboutIcon {
  width: 25px;
  height: 25px;
  margin-right: 2.5px;
  background-size: cover;
}

.aboutIconHidden {
  width: 0px;
}
</style>
