<script setup lang="ts">
import NumberInputVue from './NumberInput.vue'
import { ref, watch } from 'vue'
interface ItemType {
  sig: Boolean
  ua: Number
  ub: Number
  da: Number
  db: Number
}

const emit = defineEmits(['del', 'swSig', 'setVal'])

const prop = defineProps({
  data: {
    type: Object as () => ItemType,
    required: true
  }
})

const sua = ref(prop.data.ua as unknown as string)
const sub = ref(prop.data.ub as unknown as string)
const sda = ref(prop.data.da as unknown as string)
const sdb = ref(prop.data.db as unknown as string)

watch(
  () => prop.data,
  () => {
    sua.value = prop.data.ua as unknown as string
    sub.value = prop.data.ub as unknown as string
    sda.value = prop.data.da as unknown as string
    sdb.value = prop.data.db as unknown as string
  }
)

watch(sua, (newVal, oldVal) => {
  if (newVal != oldVal) {
    emit('setVal', 0, newVal)
  }
})

watch(sub, (newVal, oldVal) => {
  if (newVal != oldVal) {
    emit('setVal', 1, newVal)
  }
})

watch(sda, (newVal, oldVal) => {
  if (newVal != oldVal) {
    emit('setVal', 2, newVal)
  }
})

watch(sdb, (newVal, oldVal) => {
  if (newVal != oldVal) {
    emit('setVal', 3, newVal)
  }
})
</script>

<template>
  <div :class="['itemBkOt']">
    <div :class="['txtPart sigCh']" @click="$emit('swSig')">
      {{ data.sig ? '+' : '-' }}
    </div>
    <div :class="['itemBk']">
      <div :class="['itemIn']">
        <NumberInputVue v-model="sua" />
        <div :class="['txtPart']">* x +</div>
        <NumberInputVue v-model="sub" />
      </div>
      <div :class="['spacer']"></div>
      <div :class="['itemIn']">
        <NumberInputVue v-model="sda" />
        <div :class="['txtPart']">* x +</div>
        <NumberInputVue v-model="sdb" />
      </div>
    </div>
    <div :class="['delBox']" @click="$emit('del')">
      <span class="material-symbols-outlined"> close </span>
    </div>
  </div>
</template>

<style scoped>
.txtPart {
  /* background-color: black; */
  margin-inline: 5px;
}
.itemBkOt {
  margin-top: 25px;
  width: max-content;
  height: max-content;
  display: flex;
  position: relative;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
.delBox {
  width: 15px;
  aspect-ratio: 1/1;
  background-color: #8888;
  border-radius: 5px;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0px;
  right: 0px;
  transform: translate(calc(100% + 5px), calc(-100% - 5px));
  user-select: none;
  cursor: pointer;
}

.delBox > .material-symbols-outlined {
  font-size: 15px;
  color: #f55;
}
.itemBk {
  width: max-content;
  height: max-content;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.itemIn {
  width: max-content;
  height: max-content;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  flex-direction: row;
}
.spacer {
  width: 100%;
  background-color: gray;
  height: 1px;
  margin-block: 5px;
}

.sigCh {
  cursor: pointer;
  width: 15px;
  text-align: center;
  user-select: none;
}
</style>
