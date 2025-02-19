<script setup lang="ts">
import { ref } from 'vue'

const text = defineModel()

defineProps({
  type: {
    type: String,
    required: false,
    default: ''
  },
  placeholder: {
    type: String,
    required: false,
    default: ''
  },
  textType: {
    type: String,
    required: false,
    default: ''
  },
  width: {
    type: String,
    required: false,
    default: '180px'
  },
  name: {
    type: String,
    required: false,
    default: ''
  },
  required: {
    type: Boolean,
    required: false,
    default: false
  }
})

const isHovered = ref(false)
const isFocused = ref(false)

const viewHovered = ref(false)
const viewDown = ref(false)
</script>

<template>
  <div @mouseenter="isHovered = true" @mouseleave="isHovered = false" :class="['InputBox']">
    <input
      :name="name"
      :type="(textType === '' && type === 'password' && !viewDown) ? type : (textType === '' ? 'text' : textType)"
      v-model="text"
      :placeholder="placeholder"
      :required="required"
      @focus="isFocused = true"
      @focusout="isFocused = false"
      :class="[
        'Input transGlobal',
        isHovered || isFocused ? 'Input_on' : '',
        type === 'password' && !viewDown ? 'InputPswd' : ''
      ]"
    />
    <div
      :class="['highlight transGlobal EpColor', isHovered || isFocused ? 'highlight_on' : '']"
    ></div>
    <div
      @mouseenter="viewHovered = true"
      @mouseleave="
        () => {
          viewDown = false
          viewHovered = false
        }
      "
      @mousedown="viewDown = true"
      @mouseup="viewDown = false"
      :class="[
        'pswdViewer transGlobal',
        text === '' ? 'cssHidden': '',
        viewHovered ? 'pswdViewer_hover' : '',
        type === 'password' ? '' : 'cssHidden'
      ]"
    >
      <span class="material-symbols-outlined" v-html="viewDown ? 'visibility' : 'visibility_off'">
      </span>
    </div>
  </div>
</template>

<style scoped>
.InputBox {
  overflow: hidden;
  position: relative;
  height: fit-content;
  width: v-bind(width);
  border-radius: 5px;
}

.highlight {
  position: absolute;
  width: 0%;
  height: 5px;
  bottom: 0px;
  border-radius: 0px 0px 5px 0px;
  /* transform: translateY(-100%); */
}

.highlight_on {
  padding-inline: 3px;
  width: v-bind(width);
}

.Input {
  resize: none;
  font-size: unset;
  line-height: 25px;
  font-family: unset;
  color: unset;
  width: v-bind(width);
  overflow: hidden;
  border-radius: 5px;
  text-wrap: nowrap;
  background-color: rgba(128, 128, 128, 0.2);
  border: 1px solid transparent;
  outline: none;
}

.Input_on {
  background-color: rgba(128, 128, 128, 0.5);
}

.Input:focus-visible {
  background-color: rgba(128, 128, 128, 0.5);
  border: 1px solid transparent;
}

/* .Input::-webkit-input-placeholder {
    color: aqua;
} */

.InputPswd {
  -webkit-text-security: disc !important;
}

input[type="password"]::-ms-reveal,
input[type="password"]::-ms-clear {
  display: none;
}

.pswdViewer {
  position: absolute;
  top: 12%;
  transform: translateX(-20px);
  left: v-bind(width);
  height: 80%;
  aspect-ratio: 1/1;
  border-radius: 5px;
  text-align: center;
  line-height: 30px;
  user-select: none;
  cursor: pointer;
  opacity: 0.5;
}

.pswdViewer_hover {
  opacity: 1;
  background-color: rgba(128, 128, 128, 0.5);
}

.pswdViewer > .material-symbols-outlined {
  font-size: 20px;
}
</style>
