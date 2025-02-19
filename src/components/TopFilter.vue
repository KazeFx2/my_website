<script setup lang="ts">
import TopFilterItem from './TopFilterItem.vue'

defineEmits(['remove', 'add'])
defineProps({
  Tags: {
    type: Array<String>,
    required: true
  },
  TagsEn: {
    type: Array<String>,
    required: true
  }
})
</script>

<template>
  <div :class="['ft_bk']">
    <TopFilterItem
      v-for="item in Tags"
      :key="item as string"
      :-tag="item as string"
      :-en="TagsEn.includes(item)"
      @remove="
        (tag) => {
          $emit('remove', tag)
        }
      "
      @add="
        (tag) => {
          $emit('add', tag)
        }
      "
    />
  </div>
</template>

<style scoped>
.ft_bk {
  width: 95%;
  /* height: 50px; */
  margin-bottom: 5px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  /* background-color: aqua; */
}
</style>
