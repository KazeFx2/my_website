<script setup lang="ts">
defineEmits(['click'])
defineProps({
  title: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  size: {
    type: Number,
    default: 25
  }
})
</script>

<template>
  <div
    @click="
      () => {
        if (!disabled) $emit('click')
      }
    "
    :title="title"
    :class="['bk transGlobal', disabled ? 'bk_dis' : '']"
  >
    <span class="material-symbols-outlined">
      {{ icon }}
    </span>
  </div>
</template>

<style scoped>
.bk {
  border-radius: 5px;
  user-select: none;
  overflow: hidden;
  width: v-bind(size + 'px');
  height: v-bind(size + 'px');
}

.bk:hover {
  background-color: rgba(128, 128, 128, 0.5);
}

.material-symbols-outlined {
  line-height: v-bind(size + 'px');
  font-size: v-bind(size + 'px');
}

.bk_dis {
  background-color: transparent !important;
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
