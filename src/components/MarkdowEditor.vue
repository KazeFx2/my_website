<script setup lang="ts">
import { theme } from '@/stores/theme'
import { status } from '@/stores/status'
import AboutZoneVue from './AboutZone.vue'
const Theme = theme()
const Status = status()
const text = defineModel()
defineProps({
  disabledMenus: {
    type: Array,
    required: false,
    // eslint-disable-next-line vue/require-valid-default-prop
    default: []
  },
  mode: {
    type: String,
    required: false,
    default: ''
  },
  height: {
    type: String,
    required: false,
    default: ''
  },
  leftToolbar: {
    type: String,
    required: false,
    default:
      'undo redo clear | h bold italic strikethrough quote | emoji tip image link code | ul ol table hr | save'
  },
  full: {
    type: Boolean,
    required: false,
    default: false
  },
  about: {
    type: Boolean,
    required: false,
    default: false
  }
})
defineEmits(['save', 'upload-image'])
</script>
<script lang="ts"></script>

<template>
  <div
    :class="[
      'innerEditor',
      Theme.dark ? 'solidDark bkDark' : 'solidWhite bkWhite',
      Status.minDev ? 'innerEditor_mobile' : ''
    ]"
  >
    <v-md-editor
      v-model="text"
      :mode="mode"
      :height="height"
      :left-toolbar="leftToolbar"
      :include-level="[2, 3, 4]"
      :default-show-toc="false"
      :disabled-menus="disabledMenus"
      @save="$emit('save')"
      @upload-image="
        (event: any, insertImage: any, files: any) => {
          $emit('upload-image', event, insertImage, files)
        }
      "
    ></v-md-editor>
  </div>
  <AboutZoneVue :class="[about ? '' : 'cssHidden']" />
</template>

<style scoped>
.innerEditor {
  margin-top: 5px;
  width: calc(100% - 50px);
  height: calc(100% - 45px);
  border-radius: 15px;
  border: 1px solid grey;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* background-color: aqua; */
  /* overflow: hidden; */
}
/* 
.innerEditor {
  background-color: transparent;
} */

.innerEditor_mobile {
  width: calc(100% - 20px);
}

.v-md-editor {
  background-color: transparent;
  box-shadow: unset;
  height: 100%;
  /* overflow-x: hidden; */
}

textarea {
  background-color: transparent;
}
</style>
