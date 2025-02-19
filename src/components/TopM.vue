<script setup lang="ts">
import ItemTaglist from './ItemTaglist.vue'
import EditTxt from './EditTxt.vue'
import SwitchButtonG from './SwitchButtonG.vue'
import { dialog } from '@/stores/dialog'
import { theme } from '@/stores/theme'
import { ref } from 'vue'
import { type Ref } from 'vue'
const emit = defineEmits([
  'close',
  'addTag',
  'delTag',
  'saveTitle',
  'uploadImage',
  'delImage',
  'screenButton',
  'switchHidden',
  'setDesc'
])
const Theme = theme()
const Dialog = dialog()
const nowSel = ref('')
const nowAct = ref('')
interface InputFile {
  click: () => {}
  files: Array<any>
  style: {
    display: String
  }
  value: String
}
function click() {
  Dialog.showSelectDialog(
    '请选择图像位置',
    '确认',
    (str: string) => {
      if (str === '请选择') {
        alert(str)
        return false
      }
      nowSel.value = str
      if (nowAct.value === 'upload') {
        const ele = ref(document.getElementById('uploadInput'))
        const i = ele as unknown as Ref<InputFile>
        i.value.style.display = 'none'
        i.value.value = ''
        i.value.click()
      } else {
        emit('delImage', nowSel.value)
      }
    },
    '取消',
    () => {},
    ['顶部', '背景'],
    '请选择'
  )
}
defineProps({
  title: {
    type: String,
    required: true
  },
  tags: {
    type: Array<String>,
    required: true
  },
  release: {
    type: String,
    required: true
  },
  modify: {
    type: String,
    required: true
  },
  cover: {
    type: String,
    required: true
  },
  edit: {
    type: Boolean,
    required: true
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
  },
  hidden: {
    type: Boolean,
    default: false
  },
  desc: {
    type: String,
    required: false,
    default: ''
  },
  view: {
    type: Number,
    required: true
  }
})
</script>
<script lang="ts">
interface EditTxtType {
  setText: (val: String) => {}
}

export default {
  data() {
    return {
      isHovered: false
    }
  },
  watch: {},
  methods: {
    setTitle(val: String) {
      const ele = this.$refs.titleTxt as EditTxtType
      ele.setText(val)
    },
    checkSet(val: String) {
      setTimeout(() => {
        if (this.title !== val) this.setTitle(this.title)
      }, 1)
    }
  }
}
</script>

<template>
  <div class="bk">
    <div :class="['Title']">
      <EditTxt
        ref="titleTxt"
        placeholder="请输入标题"
        :text="title"
        :edit="edit"
        @save="
          (val: String) => {
            $emit('saveTitle', val)
            checkSet(val)
          }
        "
      />
    </div>
    <div :class="['imgUpload']">
      <input
        id="uploadInput"
        @change="
          () => {
            if (($refs.uploadImage as InputFile).files.length > 0)
              $emit('uploadImage', ($refs.uploadImage as InputFile).files, nowSel)
          }
        "
        ref="uploadImage"
        type="file"
      />
      <div
        title="公开/隐藏"
        :class="['commonButton swButton transGlobal', edit ? '' : 'commonButton_Hidden']"
      >
        <span class="material-symbols-outlined">
          {{ hidden ? 'visibility_off' : 'visibility' }}
        </span>
        <SwitchButtonG
          :status="hidden"
          @enable="$emit('switchHidden')"
          @disable="$emit('switchHidden')"
        />
      </div>
      <div
        :title="full ? '退出全屏' : '全屏'"
        @click="$emit('screenButton')"
        :class="['commonButton transGlobal', about ? 'cssHidden' : '']"
      >
        <span
          class="material-symbols-outlined"
          v-html="full ? 'fullscreen_exit' : 'fullscreen'"
        ></span>
      </div>
      <div
        title="编辑描述"
        @click="
          () => {
            Dialog.showInputDialog(
              '输入新描述：',
              '确认',
              (str: string) => {
                $emit('setDesc', str)
              },
              '取消',
              () => {},
              desc
            )
          }
        "
        :class="['commonButton transGlobal', edit ? '' : 'commonButton_Hidden']"
      >
        <span class="material-symbols-outlined"> title </span>
      </div>
      <div
        title="上传背景图"
        @click="
          () => {
            nowAct = 'upload'
            click()
          }
        "
        :class="['commonButton transGlobal', edit ? '' : 'commonButton_Hidden']"
      >
        <span class="material-symbols-outlined"> upload </span>
      </div>
      <div
        title="删除背景图"
        @click="
          () => {
            nowAct = 'del'
            click()
          }
        "
        :class="['commonButton transGlobal', edit ? '' : 'commonButton_Hidden']"
      >
        <span class="material-symbols-outlined"> delete </span>
      </div>
    </div>
    <div
      title="关闭"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      @click="$emit('close')"
      :class="[
        'transGlobal CloseButton',
        Theme.dark ? 'CloseButton_dark' : '',
        isHovered ? 'CloseButton_hover' : '',
        about ? 'cssHidden' : ''
      ]"
    ></div>
    <div :class="['Tags']">
      <ItemTaglist
        v-for="(item, index) in tags"
        :key="item.toString()"
        :tag-name="item.toString()"
        :img="false"
        :last="index + 1 === tags.length"
        :edit="edit"
        @del-tag="
          (tag: String) => {
            $emit('delTag', tag)
          }
        "
        @add-tag="
          (tag: String) => {
            $emit('addTag', tag)
          }
        "
      />
    </div>
    <div :class="['infoB infoB_noTop']">
      <div :class="['ReleaseDate']">
        发布于: {{ release === 'null' ? release : release.slice(0, -3) }}
      </div>
      <div :class="['ModifyDate', modify === 'null' ? 'cssHidden' : '']">
        最后修改: {{ modify.slice(0, -3) }}
      </div>
    </div>
    <div :class="['infoB']">
      <span class="material-symbols-outlined"> visibility </span>
      <div :class="['infoBTxt']">
        {{ view }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.infoB {
  width: 100%;
  display: flex;
  margin-top: 5px;
}

.infoB_noTop {
  margin-top: 0px;
}

.infoBTxt {
  margin-left: 5px;
  font-size: 15px;
}

.infoB > .material-symbols-outlined {
  font-size: 18px;
  margin-left: 10px;
}

.imgUpload {
  position: absolute;
  bottom: 0px;
  right: 0px;
  display: flex;
  /* background-color: aqua; */
}

.imgUpload > input {
  display: none;
}

.commonButton {
  margin-right: 5px;
  padding: 2px;
  width: 23px;
  user-select: none;
  cursor: pointer;
  overflow: hidden;
  border-radius: 5px;
}

.swButton {
  width: fit-content;
  display: flex;
}

.commonButton > .material-symbols-outlined {
  transform: translate(-0.5px, 2px);
}

.swButton > .material-symbols-outlined {
  margin-right: 5px;
}

.commonButton:hover {
  background-color: rgba(128, 128, 128, 0.5);
}

.swButton:hover {
  background-color: unset;
}

.commonButton_Dis {
  cursor: not-allowed;
  opacity: 0.5;
}

.commonButton_Dis:hover {
  background-color: transparent;
}

.commonButton_Hidden {
  padding: 0px;
  width: 0px;
}

.bk {
  position: relative;
  width: 100%;
  height: 100%;
}

.Title {
  font-size: xx-large;
  padding: 10px;
  width: calc(100% - 100px);
}

.CloseButton {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 50px;
  aspect-ratio: 1/1;
  background-image: url('../images/close.png');
  background-size: cover;
  cursor: pointer;
}

.CloseButton_dark {
  background-image: url('../images/close_w.png');
}

.CloseButton_hover {
  rotate: 90deg;
}
.Tags {
  /* position: absolute; */
  display: flex;
  margin-left: 10px;
  transform: translateY(-5px);
}

.ReleaseDate {
  /* position: absolute; */
  margin-left: 10px;
  /* bottom: 0px; */
  font-size: small;
}

.ModifyDate {
  /* position: absolute; */
  /* bottom: 0px; */
  margin-left: 10px;
  font-size: small;
}
</style>
