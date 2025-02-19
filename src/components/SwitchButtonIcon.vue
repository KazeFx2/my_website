<script setup lang="ts">
import SwitchButtonG from './SwitchButtonG.vue'
defineEmits(['setVal'])
defineProps({
  icon: {
    type: String,
    required: true
  },
  value: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})
</script>
<script lang="ts"></script>

<template>
  <div :class="['swBox']">
    <div :class="['swIcon']">
      <span class="material-symbols-outlined">
        {{ icon }}
      </span>
    </div>
    <SwitchButtonG
      :title="title"
      :status="value"
      @enable="$emit('setVal', true)"
      @disable="$emit('setVal', false)"
    />
  </div>
</template>

<style scoped>
.swBox {
  width: fit-content;
  height: fit-content;
  display: flex;
}

/* .material-symbols-outlined {
} */

.swIcon {
  user-select: none;
  margin-right: 5px;
}
</style>
