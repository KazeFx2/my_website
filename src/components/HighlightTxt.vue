<script setup lang="ts">
defineProps({
  height: {
    type: Number,
    default: 20
  },
  text: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div :class="['__bk']">
    {{ text }}
    <div :class="['highlight EpColor']"></div>
  </div>
</template>

<style scoped>
.__bk {
  position: relative;
  display: flex;
  width: fit-content;
  height: fit-content;
  font-size: v-bind(height + 'px');
  line-height: v-bind(height + 'px');
}

.highlight {
  position: absolute;
  width: 100%;
  height: v-bind(height / 4 + 'px');
  bottom: 0px;
}
</style>
