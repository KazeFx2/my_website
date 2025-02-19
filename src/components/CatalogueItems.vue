<script setup lang="ts">
import type { PropType } from 'vue'
import { theme } from '@/stores/theme'
import CatalogueHeadsVue from './CatalogueHeads.vue'
import HighlightTxt from './HighlightTxt.vue'
interface InfoType {
  name: String
  level: Number
  children: Array<Object>
  click: (a: any) => void
  index: Number
}
defineProps({
  active: {
    type: Number,
    required: true
  },
  data: {
    type: Array<Object>,
    required: true
  },
  getData: {
    type: Function as PropType<(a: any) => InfoType>,
    required: true
  }
})

const Theme = theme()
</script>

<template>
  <div :class="['CataOutterZone', Theme.dark ? 'solidDarkTrs' : 'solidWhiteTrs']">
    <HighlightTxt :text="'CATALOGUE'" :height="30" />
    <div :class="['CataItemZone', Theme.dark ? 'solidDark' : 'solidWhite']">
      <CatalogueHeadsVue
        v-for="item in data"
        :active="active"
        :lv="1"
        :key="(item as InfoType).name as string"
        :info="getData(item)"
        :data="item"
        :get-data="getData"
      />
    </div>
  </div>
</template>

<style scoped>
.CataOutterZone {
  border-radius: 15px;
  padding: 10px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.5);
}
.CataItemZone {
  margin-top: 10px;
  margin-inline: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  width: 300px;
  border: 1px solid gray;
  padding: 10px;
}
</style>
