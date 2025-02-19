<script setup lang="ts">
defineProps({
  Tag: {
    type: String,
    required: true
  },
  En: {
    type: Boolean,
    required: true
  }
})
defineEmits(['remove', 'add'])
</script>

<template>
  <div
    @click="
      () => {
        if (En) $emit('remove', Tag)
        else $emit('add', Tag)
      }
    "
    :class="['transGlobal fti_bk', En ? 'EpColor' : '']"
  >
    {{ Tag }}
  </div>
</template>

<style scoped>
.fti_bk {
  position: relative;
  margin: 5px;
  /* background-color: aqua; */
  line-height: 15px;
  font-size: 15px;
  padding: 3px;
  border-radius: 5px;
  border: 1px solid gray;
  cursor: pointer;
}

.fti_bk::after {
  position: absolute;
  content: '';
  width: 0px;
  height: 5px;
  background-color: gray;
  left: 50%;
  transform: translate(-50%, 150%);
  bottom: 0px;
  opacity: 0;
  transition: 250ms;
}

.fti_bk:hover::after {
  opacity: 1;
  width: 80%;
}
</style>
