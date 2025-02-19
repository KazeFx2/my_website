<script setup lang="ts">
import { ref, watch } from 'vue'

interface TextArea {
  style?: {
    width: String
    height: String
  }
  scrollWidth?: Number
  scrollHeight?: Number
  focus?: () => {}
}

const emit = defineEmits(['save'])

defineExpose({
  setText
})

const vars = defineProps({
  edit: {
    type: Boolean,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    required: false,
    default: ''
  }
})

const isHovered = ref(false)
const editSt = ref(0)
const m_text = ref('')
m_text.value = vars.text

function autoWidth() {
  // var textArea = document.getElementById('textArea') as unknown as TextArea
  // if (textArea.style && textArea.scrollWidth) {
  //   textArea.style.width = '0px'
  //   // console.log(textArea.scrollWidth as number, textArea.scrollHeight as number)
  //   textArea.style.width =
  //     ((textArea.scrollWidth as number) > (textArea.scrollHeight as number)
  //       ? (textArea.scrollWidth as number)
  //       : (textArea.scrollHeight as number) / (editSt.value === 1 ? 2 : 1)) +
  //     2 +
  //     'px'
  // }
  ///
  var textArea = document.getElementById('textArea') as unknown as TextArea
  if (textArea.style && textArea.scrollHeight) {
    textArea.style.height = '0px'
    // console.log(textArea.scrollWidth as number, textArea.scrollHeight as number)
    textArea.style.height = (textArea.scrollHeight as number) + 2 + 'px'
  }
}

function keyEvent(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    editClick()
  }
}

function editClick() {
  editSt.value++
  if (editSt.value === 1) {
    var textArea = document.getElementById('textArea') as unknown as TextArea
    if (textArea.focus) textArea.focus()
  } else if (editSt.value === 2) {
    editSt.value = 0
    emit('save', m_text.value)
  }
}

function setText(val: String) {
  m_text.value = val as string
  setTimeout(autoWidth, 1)
}

watch(
  () => vars.text,
  (newVal) => {
    m_text.value = newVal
    setTimeout(autoWidth, 1)
  }
)
</script>
<script lang="ts"></script>

<template>
  <div :class="['DEditText transGlobal']">
    <textarea
      id="textArea"
      @input="autoWidth"
      @keydown="keyEvent"
      v-model="m_text"
      :title="m_text"
      :placeholder="placeholder"
      :disabled="!edit || editSt != 1"
      :class="[!edit || editSt != 1 ? '' : 'textarea_enable']"
    ></textarea>
    <div
      :title="'编辑'"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      @click="editClick"
      :class="[
        'editIcon transGlobal',
        edit ? '' : 'editIconHidden',
        isHovered ? 'editIconHover' : ''
      ]"
    >
      <span class="material-symbols-outlined"> edit </span>
    </div>
  </div>
</template>

<style scoped>
textarea {
  resize: none;
  font-size: unset;
  font-family: unset;
  overflow: hidden;
  width: 100%;
  /* text-wrap: nowrap; */
  border-radius: 10px;
  border-color: transparent;
  /* white-space: nowrap; */
  text-overflow: ellipsis;
  /* transition: 100ms; */
}

.textarea_enable {
  border-color: rgba(128, 128, 128, 0.5);
}

.DEditText {
  display: flex;
  width: 100%;
  height: fit-content;
  justify-content: center;
  align-items: center;
}

.editIcon {
  width: fit-content;
  height: fit-content;
  margin-left: 5px;
  opacity: 0.5;
  user-select: none;
  overflow: hidden;
  cursor: pointer;
}

.editIconHidden {
  width: 0px;
}

.editIconHover {
  opacity: 1;
}
</style>
