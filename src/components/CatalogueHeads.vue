<script setup lang="ts">
import { ref, type PropType, watch, onMounted, type Ref } from 'vue'

interface InfoType {
  name: String
  level: Number
  children: Array<Object>
  click: (a: any) => void
  index: Number
}

interface EleType {
  style: {
    height: String
  }
  clientHeight: Number
  scrollHeight: Number
}

const emit = defineEmits(['setLast'])

const prop = defineProps({
  last: {
    type: Boolean,
    default: false
  },
  active: {
    type: Number,
    required: true
  },
  lv: {
    type: Number,
    required: true
  },
  data: {
    type: Object,
    required: true
  },
  getData: {
    type: Function as PropType<(a: any) => InfoType>,
    required: true
  },
  info: {
    type: Object as () => {
      name: String
      level: Number
      children: Array<Object>
      click: (a: any) => void
      index: Number
    },
    required: true
  }
})
if (prop.info.name != 'null')
  watch(
    () => prop.active,
    (newVal) => {
      // console.log(prop.info.name, prop.info.index, last_index.value, prop.last)
      if (newVal >= (prop.info.index as number) && newVal <= (last_index.value as number)) {
        expand.value = true
      } else expand.value = false
      // setTimeout(() => {
      // if(expand.value) console.log('calc', prop.info.name)
      calcHeight()
      // }, 10 * (5 - prop.lv))
    }
  )
const isHovered = ref(false)
const CLD = ref(null)
const last_index = ref(prop.info.index)
const expand = ref(false)
function calcHeight() {
  // if (prop.info.name === 'null') return
  const i = CLD as unknown as Ref<EleType>
  if (!(prop.info.name === 'null' || prop.lv != 1)) {
    if (!expand.value) {
      i.value.style.height = '0px'
    } else {
      i.value.style.height = '0px'
      i.value.style.height = i.value.scrollHeight + 'px'
    }
  }
}

onMounted(() => {
  calcHeight()
  if (prop.last) emit('setLast', prop.info.index)
})
</script>

<template>
  <div
    @mouseenter="
      () => {
        // zoneHovered = true
        // calcHeight()
      }
    "
    @mouseleave="
      () => {
        // zoneHovered = false
        // calcHeight()
      }
    "
    :class="['CataItem']"
  >
    <div
      @mouseenter="
        () => {
          isHovered = true
        }
      "
      @mouseleave="
        () => {
          isHovered = false
        }
      "
      @click="
        () => {
          info.click(data)
        }
      "
      :class="[
        'name transGlobal',
        info.name === 'null' ? 'cssHidden' : 'cH' + lv,
        isHovered || active === info.index ? 'EpColor' : ''
      ]"
    >
      <div :class="['h1B', lv === 1 ? '' : 'cssHidden']"></div>
      <div :class="['h2B', lv === 2 ? '' : 'cssHidden']"></div>
      <div :class="['h3B', lv === 3 ? '' : 'cssHidden']"></div>
      <div :class="['h4B', lv === 4 ? '' : 'cssHidden']"></div>
      <div :class="['h5B', lv === 5 ? '' : 'cssHidden']"></div>
      <div :title="info.name as string" :class="['nameText']">
        {{ info.name }}
      </div>
    </div>
    <div ref="CLD" :class="['transGlobal childrenRect']">
      <CatalogueHeads
        v-for="(item, index) in info.children"
        :active="active"
        :lv="info.name === 'null' ? lv : lv + 1"
        :key="getData(item).name as string"
        :info="getData(item)"
        :data="item"
        :get-data="getData"
        :last="index + 1 === info.children.length"
        @set-last="
          (val) => {
            if (val <= last_index) return
            last_index = val
            $emit('setLast', val)
          }
        "
      />
    </div>
  </div>
</template>

<style scoped>
.childrenRect {
  overflow: hidden;
}

.CataItem {
  cursor: pointer;
}

.name {
  display: flex;
}

.nameText {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.cH1 {
  /* background-color: aqua; */
  padding: 2px;
}

.h1B {
  width: 10px;
}
.h1B {
  width: 10px;
}
.h2B {
  width: 30px;
}
.h3B {
  width: 50px;
}
.h4B {
  width: 70px;
}
.h5B {
  width: 90px;
}
</style>
