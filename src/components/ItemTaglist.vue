<script setup lang="ts">
import { theme } from '@/stores/theme'
const Theme = theme()
</script>
<script lang="ts">
import './../css/global.css'
const exceptName = '文档'
interface TextareaType {
  value?: String
  focus?: () => {}
}
export default {
  emits: ['addTag', 'delTag'],
  props: {
    tagName: {
      type: String,
      required: true
    },
    img: {
      type: Boolean,
      required: true
    },
    last: {
      type: Boolean,
      required: true
    },
    edit: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: 12
    },
    noIcon: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isHovered: false,
      editSt: 0
    }
  },
  methods: {
    addTag() {
      this.editSt++
      if (this.editSt === 1) {
        const ele = this.$refs.textRef as TextareaType
        if (ele.focus) ele.focus()
      } else if (this.editSt === 2) {
        this.editSt = 0
        const ele = this.$refs.textRef as TextareaType
        this.$emit('addTag', ele.value)
        ele.value = ''
      }
    },
    textareaEvent(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        e.preventDefault()
        this.addTag()
      }
    }
  }
}
</script>

<template>
  <div
    :class="[
      'div_',
      Theme.dark || img ? 'div_dk' : '',
      isHovered ? 'div_hover' : '',
      edit && editSt === 1 ? 'addEdit' : ''
    ]"
  >
    <div :class="['TagIcon', noIcon ? 'cssHidden' : '']" :title="'tags'">
      <span class="material-symbols-outlined"> shoppingmode </span>
    </div>
    <div
      :title="edit && tagName !== exceptName ? '删除tag \'' + tagName + '\'' : tagName"
      @mouseenter="
        () => {
          if (edit && tagName !== exceptName) isHovered = true
        }
      "
      @mouseleave="
        () => {
          if (edit && tagName !== exceptName) isHovered = false
        }
      "
      @click="
        () => {
          if (edit && tagName !== exceptName) $emit('delTag', tagName)
        }
      "
      :class="['TagTxt', edit && tagName !== exceptName ? 'TagTxt_edit' : '']"
    >
      {{ tagName }}
      <div
        :class="[
          'delTagIcon transGlobal',
          edit && tagName !== exceptName ? '' : 'delTagIcon_hidden'
        ]"
      >
        <span class="material-symbols-outlined"> close </span>
      </div>
    </div>
    <textarea
      @keydown="textareaEvent"
      :class="['transGlobal']"
      ref="textRef"
      placeholder="请输入新tag"
    ></textarea>
    <div
      :class="['AddIcon transGlobal', edit ? '' : 'AddIcon_hidden']"
      @click="addTag"
      title="添加tag"
    >
      <span class="material-symbols-outlined"> add </span>
    </div>
  </div>
</template>

<style scoped>
textarea {
  height: v-bind(height + 'px');
  border-radius: 5px;
  width: auto;
  /* min-width: 12px; */
  text-wrap: nowrap;
  resize: none;
  font-size: v-bind(height + 'px');
  line-height: v-bind(height + 'px');
  overflow: hidden;
  width: 0px;
  border-width: 0px;
  padding: 0px;
  font-family: unset;
}

.addEdit > textarea {
  margin-left: 5px;
  width: unset;
  border-width: 1px;
  padding: 2px;
}

.delTagIcon {
  user-select: none;
  margin-top: 1px;
  line-height: v-bind(height - 2 + 'px');
  width: v-bind(height - 2 + 'px');
  overflow: hidden;
}

.delTagIcon_hidden {
  width: 0px;
}

.delTagIcon > .material-symbols-outlined {
  font-size: v-bind(height - 2 + 'px');
}

.div_ {
  font-size: v-bind(height + 'px');
  line-height: v-bind(height + 'px');
  padding: 2px;
  height: fit-content;
  display: flex;
  margin-right: 5px;
  background-color: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 5px;
}

.div_dk {
  border: 1px solid rgba(255, 255, 255, 0.5);
  background-color: rgba(255, 255, 255, 0.1);
}

.TagTxt {
  display: flex;
}

.TagTxt_edit {
  cursor: pointer;
}

.div_hover {
  background-color: rgba(128, 128, 128, 0.5);
}

.div_hover:first-of-type > .TagTxt {
  background-color: rgba(128, 128, 128, 0.5) !important;
}

.div_hover:last-of-type > .TagTxt {
  background-color: rgba(128, 128, 128, 0.5) !important;
}

.TagIcon {
  width: 0px;
  height: 0px;
  /* transform: translateY(-2px); */
  overflow: hidden;
  user-select: none;
}

.TagIcon > .material-symbols-outlined {
  font-size: v-bind(height + 8 + 'px');
  margin-right: 5px;
}

.div_:first-of-type {
  padding: 0px;
  background-color: unset;
  border: unset;
}

.div_:first-of-type > .TagIcon {
  width: unset;
  height: unset;
}

.div_:first-of-type > .TagTxt {
  height: fit-content;
  padding: 2px;
  background-color: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 5px;
}

.div_dk:first-of-type > .TagTxt {
  border: 1px solid rgba(255, 255, 255, 0.5);
  background-color: rgba(255, 255, 255, 0.1);
}

.AddIcon {
  width: 0px;
  height: 0px;
  /* transform: translateY(-2px); */
  overflow: hidden;
  user-select: none;
  border-radius: 5px;
  border: 0px solid rgba(128, 128, 128, 0.5);
}

.AddIcon_hidden {
  width: 0px !important;
  border: unset !important;
}

.AddIcon > .material-symbols-outlined {
  font-size: v-bind(height + 3 + 'px');
  line-height: v-bind(height + 3 + 'px');
}

.div_:last-of-type {
  padding: 0px;
  background-color: unset;
  border: unset;
}

.div_:last-of-type > .AddIcon {
  width: unset;
  height: fit-content;
  margin-left: 5px;
  border: 1px solid rgba(128, 128, 128, 0.8);
  background-color: rgba(128, 128, 128, 0.4);
  cursor: pointer;
}

.div_:last-of-type > .TagTxt {
  height: fit-content;
  padding: 2px;
  background-color: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 5px;
}

.div_dk:last-of-type > .TagTxt {
  border: 1px solid rgba(255, 255, 255, 0.5);
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
