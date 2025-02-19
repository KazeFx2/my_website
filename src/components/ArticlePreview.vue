<script setup lang="ts">
import { theme } from '@/stores/theme'
import { status } from '@/stores/status'
import { notification } from '@/stores/notifications'
import ItemTaglist from './ItemTaglist.vue'
import TopM from './TopM.vue'
import MarkdowEditor from './MarkdowEditor.vue'
import ArticleTools from './ArticleTools.vue'
import IconButton from './IconButton.vue'
import HighlightTxt from './HighlightTxt.vue'
import LoadBall from './decorations/LoadBall.vue'
import CatalogueItems from './CatalogueItems.vue'
import axios from 'axios'
import { ref, watch, type Ref, onMounted } from 'vue'

interface ImageUploadResData {
  status: Number
  data: String
}

interface ContentType {
  tagName: String
  scrollTop: Number
  innerText: String
  getBoundingClientRect: () => {
    top: Number
  }
}

interface NodeType {
  head: any
  children: any[]
  lv: number
  name: string
  index: number
}

const full = ref(true)

const Theme = theme()
const Status = status()
const Notification = notification()
const body = defineModel()

const Top = ref(true)

const Close = ref(true)

const InfoHover = ref(false)

const InfoExpand = ref(false)

const ExtBt = ref(null)

const type = ref('')

const Heads = ref<any[]>([])

const AtcIndex = ref(-1)

const Tops = ref<Number[]>([])

const contentBox = ref(null)
const emit = defineEmits([
  'close',
  'addTag',
  'delTag',
  'saveTitle',
  'save',
  'updateImage',
  'removeImage',
  'switchHidden',
  'setDesc'
])
const prop = defineProps({
  detail: {
    type: Object as () => {
      title: String
      body: String
      release: String
      modify: String
      cover: String
      tags: Array<String>
      desc: String
      view: Number
      comments: Number
      background: String
      hidden: Boolean
    },
    required: true
  },
  about: {
    type: Boolean,
    default: false
  }
})

function nodeCreate(level: number, topLv: number) {
  if (level === 0) return {}
  const node: { head: any; children: any[]; lv: number } = { head: null, children: [], lv: topLv }
  return recursiveCreate(level - 1, node, topLv - 1)
}

function recursiveCreate(level: number, upper: any, lv: number) {
  if (level === 0) return upper
  const node: { head: any; children: any[]; lv: number; index: number } = {
    head: null,
    children: [upper],
    lv: lv,
    index: -2
  }
  return recursiveCreate(level - 1, node, lv - 1)
}

function getLevel(node: { head: any; children: any[] }): number {
  if (node.children.length === 0) return 1
  else return getLevel(node.children[node.children.length - 1]) + 1
}

function getLv(head: any[]): number {
  if (head.length === 0) return 0
  return getLevel(head[head.length - 1])
}

function addLevel(node: { head: any; children: any[] }, lv: number, topLv: number) {
  if (node.children.length === 0) node.children.push(nodeCreate(lv, topLv))
  else addLevel(node.children[node.children.length - 1], lv, topLv)
}

function addLv(head: any[], lv: number, topLv: number) {
  if (head.length === 0) head.push(nodeCreate(lv, topLv))
  else addLevel(head[head.length - 1], lv, topLv)
}

function pushEndR(node: { head: any; children: any[] }, val: any, lv: number) {
  if (node.children.length === 0 || lv === 0) node.children.push(val)
  else pushEndR(node.children[node.children.length - 1], val, lv - 1)
}

function pushEnd(head: any[], ele: any, lv: number, index: number) {
  const node: { head: any; children: any[]; lv: number; name: string; index: number } = {
    head: ele,
    children: [],
    lv: lv + 1,
    name: (ele as unknown as ContentType).innerText as string,
    index: index
  }
  if (head.length === 0 || lv === 0) head.push(node)
  else pushEndR(head[head.length - 1], node, lv - 1)
}

watch(
  () => prop.detail.body,
  () => {
    setTimeout(() => {
      const preview = document.getElementsByClassName('v-md-editor-preview')[0].childNodes[0]
      const HeadTree: any[] = []
      const tops: Number[] = []
      let index = 0
      for (let i = 0; i < preview.childNodes.length; i++) {
        const ele = preview.childNodes[i]
        const tag = (ele as unknown as ContentType).tagName
        if (tag === 'H1') {
          pushEnd(HeadTree, ele, 0, index)
          index++
          tops.push(getEleTop(ele))
        } else if (tag === 'H2') {
          const lv = 1 - getLv(HeadTree)
          if (lv > 0) addLv(HeadTree, lv, 1)
          pushEnd(HeadTree, ele, 1, index)
          index++
          tops.push(getEleTop(ele))
        } else if (tag === 'H3') {
          const lv = 2 - getLv(HeadTree)
          if (lv > 0) addLv(HeadTree, lv, 2)
          pushEnd(HeadTree, ele, 2, index)
          index++
          tops.push(getEleTop(ele))
        } else if (tag === 'H4') {
          const lv = 3 - getLv(HeadTree)
          if (lv > 0) addLv(HeadTree, lv, 3)
          pushEnd(HeadTree, ele, 3, index)
          index++
          tops.push(getEleTop(ele))
        } else if (tag === 'H5') {
          const lv = 4 - getLv(HeadTree)
          if (lv > 0) addLv(HeadTree, lv, 4)
          pushEnd(HeadTree, ele, 4, index)
          index++
          tops.push(getEleTop(ele))
        }
      }
      Heads.value = HeadTree
      Tops.value = tops
    }, 250)
    if (Status.edit) return
    Top.value = true
    Close.value = true
  }
)

watch(full, () => {
  setTimeout(() => {
    const preview = document.getElementsByClassName('v-md-editor-preview')[0].childNodes[0]
    let index = 0
    for (let i = 0; i < preview.childNodes.length; i++) {
      const ele = preview.childNodes[i]
      const tag = (ele as unknown as ContentType).tagName
      if (tag === 'H1' || tag === 'H2' || tag === 'H3' || tag === 'H4' || tag === 'H5') {
        Tops.value[index] = getEleTop(ele)
        index++
      }
    }
  }, 250)
})
watch(
  () => prop.about,
  () => {
    setTimeout(() => {
      const preview = document.getElementsByClassName('v-md-editor-preview')[0].childNodes[0]
      let index = 0
      for (let i = 0; i < preview.childNodes.length; i++) {
        const ele = preview.childNodes[i]
        const tag = (ele as unknown as ContentType).tagName
        if (tag === 'H1' || tag === 'H2' || tag === 'H3' || tag === 'H4' || tag === 'H5') {
          Tops.value[index] = getEleTop(ele)
          index++
        }
      }
    }, 250)
  }
)

function saveSuccess(data: any) {
  const res = data as ImageUploadResData
  emit('updateImage', type.value, Status.ReqUrl + Status.urlImage + '?hash=' + res.data)
}

async function saveImage(files: Array<any>) {
  handleImageUpload(files[0], saveSuccess)
}

async function handleImageUpload(img: any, callback: (data: any) => void) {
  const formData = new FormData()
  formData.append('file', img)
  const res = (
    await axios.post(Status.ReqUrl + Status.urlSave + '?type=image', formData, {
      headers: {
        'Content-Type': 'application/image' // 或根据文件类型设置合适的 Content-Type
      },
      withCredentials: true
    })
  ).data
  if (res.status != 0) {
    if (res.status === 2) {
      Notification.showError('存在冲突文件！')
    } else Notification.showError('上传失败！')
  } else {
    Notification.showSuccess('上传成功！')
    callback(res)
  }
}

async function handleUploadImage(
  event: any,
  insertImage: (arg0: { url: string; desc: string }) => void,
  files: Array<any>
) {
  // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
  handleImageUpload(files[0], (data: any) => {
    const res = data as ImageUploadResData
    insertImage({
      url: Status.ReqUrl + Status.urlImage + '?hash=' + res.data,
      desc: files[0].name
      // width: 'auto',
      // height: 'auto',
    })
  })
  // 此处只做示例
}

function scrollEvent() {
  var i
  if (!full.value && !prop.about) {
    i = ref(
      document.getElementsByClassName('v-md-editor__preview-wrapper')[0].childNodes[1].childNodes[0]
    ) as unknown as Ref<ContentType>
  } else {
    i = contentBox as unknown as Ref<ContentType>
  }
  let index = AtcIndex.value
  if (index === -2 || index === -1) index = 0
  for (let j = 0; j < Tops.value.length; j++) {
    if ((i.value.scrollTop as number) > (Tops.value[index] as number)) {
      if (
        index + 1 === Tops.value.length ||
        (i.value.scrollTop as number) < (Tops.value[index + 1] as number)
      ) {
        AtcIndex.value = index
        break
      } else {
        index++
      }
    } else if ((i.value.scrollTop as number) < (Tops.value[index] as number)) {
      if (index === 0 || (i.value.scrollTop as number) > (Tops.value[index - 1] as number)) {
        AtcIndex.value = index - 1
        break
      } else {
        index--
      }
    } else {
      AtcIndex.value = index
      break
    }
  }
  if ((i.value.scrollTop as number) > 0) {
    Top.value = false
  } else {
    Top.value = true
  }
  if ((i.value.scrollTop as number) > 50) {
    Close.value = false
  } else {
    Close.value = true
  }
}

function goTop() {
  var i
  if (!full.value && !prop.about) {
    i = ref(
      document.getElementsByClassName('v-md-editor__preview-wrapper')[0].childNodes[1].childNodes[0]
    ) as unknown as Ref<ContentType>
  } else {
    i = contentBox as unknown as Ref<ContentType>
  }
  i.value.scrollTop = 0
  Top.value = true
}

function getEleTop(ele: any): number {
  var i
  if (!full.value && !prop.about) {
    i = ref(
      document.getElementsByClassName('v-md-editor__preview-wrapper')[0].childNodes[1].childNodes[0]
    ) as unknown as Ref<ContentType>
  } else {
    i = contentBox as unknown as Ref<ContentType>
  }
  if (ele === null) return i.value.scrollTop as number
  const a = i.value.getBoundingClientRect().top
  const b = (ele as unknown as ContentType).getBoundingClientRect().top
  return Math.floor((i.value.scrollTop as number) + (b as number) - (a as number))
}

function goEle(ele: any) {
  var i
  if (!full.value && !prop.about) {
    i = ref(
      document.getElementsByClassName('v-md-editor__preview-wrapper')[0].childNodes[1].childNodes[0]
    ) as unknown as Ref<ContentType>
  } else {
    i = contentBox as unknown as Ref<ContentType>
  }
  i.value.scrollTop = getEleTop(ele)
}

onMounted(() => {
  const preview_wrapper = document.getElementsByClassName('v-md-editor__preview-wrapper')[0]
    .childNodes[1].childNodes[0]
  preview_wrapper.addEventListener('scroll', scrollEvent)
})
</script>
<script lang="ts"></script>

<template>
  <div
    :class="[
      'transGlobal _bk bkImg',
      full || about ? '_bk_full' : '',
      Status.arcDetailMax ? '' : '_bk_hidden',
      Status.edit ? '_bk_edit' : '',
      Status.minDev ? '_bk_mobile' : ''
    ]"
    :style="{
      'background-image':
        'url(' + (detail.background === 'null' ? '' : (detail.background as string)) + ')'
    }"
  ></div>
  <div
    ref="contentBox"
    @scroll="scrollEvent"
    :class="[
      'transGlobal _bk',
      full || about ? '_bk_full' : '',
      Status.arcDetailMax ? '' : '_bk_hidden',
      Theme.dark ? 'solidDarkTrs' : 'solidWhiteTrs',
      Status.edit ? '_bk_edit' : '',
      Status.minDev ? '_bk_mobile' : ''
    ]"
  >
    <div :class="['innerBox', full || about ? 'innerBox_full' : '']">
      <div :class="['top']">
        <div :class="['topBox']">
          <div
            :class="['topImg']"
            :style="{
              'background-image':
                'url(' + (detail.cover && detail.background === 'null' ? detail.cover : '') + ')'
            }"
          ></div>
          <div :class="['topMask', Theme.dark ? 'solidDarkTrs' : 'solidWhiteTrs']"></div>
          <TopM
            :title="detail.title.toString()"
            :tags="detail.tags"
            :release="detail.release.toString()"
            :modify="detail.modify.toString()"
            :cover="detail.cover.toString()"
            :edit="Status.edit"
            :full="full"
            :about="about"
            :hidden="detail.hidden as boolean"
            :desc="detail.desc as string"
            :view="detail.view as number"
            @set-desc="
              (str) => {
                $emit('setDesc', str)
              }
            "
            @switch-hidden="$emit('switchHidden')"
            @upload-image="
              (file, str) => {
                type = str
                saveImage(file)
              }
            "
            @close="$emit('close')"
            @del-image="
              (str) => {
                $emit('removeImage', str)
              }
            "
            @screen-button="
              () => {
                full = !full
              }
            "
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
            @save-title="
              (title: String) => {
                $emit('saveTitle', title)
              }
            "
          />
        </div>
      </div>
      <div :class="['innerEB', full || about ? 'innerEB_full' : '']">
        <MarkdowEditor
          v-model="body"
          :mode="Status.edit && Status.auth ? '' : 'preview'"
          :disabled-menus="[]"
          :full="full || about"
          :about="about"
          @save="
            () => {
              $emit('save')
            }
          "
          @upload-image="handleUploadImage"
        />
      </div>
    </div>
  </div>
  <div
    :class="[
      'transGlobal inner _bk',
      full || about ? '_bk_full' : '',
      Status.edit ? '_bk_edit' : '',
      Status.arcDetailMax ? '' : 'cssHidden'
    ]"
  >
    <div :class="['innerItemsBox']">
      <div
        :class="[
          'rightBottom transGlobal',
          Theme.dark ? 'solidDarkTrs' : 'solidWhiteTrs',
          Top || !Status.arcDetailMax ? 'right_Hidden' : ''
        ]"
      >
        <IconButton :title="'回到顶部'" :icon="'arrow_upward'" :size="35" @click="goTop" />
      </div>
      <div
        :class="[
          'rightTop transGlobal',
          Theme.dark ? 'solidDarkTrs' : 'solidWhiteTrs',
          Close || !full || about || !Status.arcDetailMax ? 'right_Hidden' : ''
        ]"
      >
        <IconButton
          :title="'关闭'"
          :icon="'close'"
          :size="35"
          @click="
            () => {
              $emit('close')
              Top = true
              Close = true
            }
          "
        />
      </div>
    </div>
    <ArticleTools
      :class="[Status.auth ? '' : 'cssHidden']"
      :edit="Status.edit"
      @set-edit="
        (val: boolean) => {
          Status.setEdit(val)
        }
      "
    />
  </div>
  <div
    :class="[
      'transGlobal inner _bk _bk_outter',
      full || about ? '_bk_full' : '',
      Status.edit ? '_bk_edit' : '',
      Status.arcDetailMax ? '' : 'cssHidden',
      Status.maxDev ? '' : 'fullZone'
    ]"
  >
    <div
      @mouseenter="InfoHover = true"
      @mouseleave="
        (e: MouseEvent) => {
          if (e.relatedTarget) {
            if (e.relatedTarget === (ExtBt as unknown as EventTarget)) return
          } else return
          InfoHover = false
        }
      "
      :class="['leftZone transGlobal', InfoHover && !Status.maxDev ? 'InfoHover' : '']"
    >
      <div
        :class="['infoBox', Theme.dark ? 'solidDarkTrs' : 'solidWhiteTrs']"
        :style="detail.cover === 'null' ? '' : 'background-image: url(' + detail.cover + ')'"
      >
        <div :class="['after', Theme.dark ? 'dark_after' : 'white_after']">
          <HighlightTxt :class="['infoTxt']" :height="30" :text="'INFO'" />
          <div :class="['Blk _title', Theme.dark ? 'solidDarkTrs' : 'solidWhiteTrs']">
            <div :class="['leftIcon']">
              <span class="material-symbols-outlined"> title </span>
            </div>
            <div :class="['rightContent']">
              {{ detail.title }}
            </div>
          </div>
          <div :class="['Blk _tag', Theme.dark ? 'solidDarkTrs' : 'solidWhiteTrs']">
            <div :class="['leftIcon']">
              <span class="material-symbols-outlined"> shoppingmode </span>
            </div>
            <div :class="['rightContent']">
              <ItemTaglist
                v-for="(item, index) in detail.tags"
                :key="index"
                :img="false"
                :edit="false"
                :tag-name="item as string"
                :height="18"
                :no-icon="true"
                :last="index + 1 === detail.tags.length"
              />
            </div>
          </div>
          <div :class="['Blk _time', Theme.dark ? 'solidDarkTrs' : 'solidWhiteTrs']">
            <div :class="['leftIcon']">
              <span class="material-symbols-outlined"> schedule </span>
            </div>
            <div
              :class="['rightContent']"
              v-html="
                '发布: ' +
                detail.release +
                (detail.modify === 'null' ? '' : '</br>编辑: ' + detail.modify)
              "
            ></div>
          </div>
          <div :class="['Blk _bottom', Theme.dark ? 'solidDarkTrs' : 'solidWhiteTrs']">
            <div :class="['_bottomItem']">
              <span class="material-symbols-outlined"> visibility </span>
              <div :class="['numInfo']">{{ detail.view }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :class="['rightZone']">
      <CatalogueItems
        :class="['cataItem']"
        :data="Heads"
        :active="AtcIndex"
        :getData="
          (ele: any) => {
            const i = ele as unknown as NodeType
            return {
              name: i.head === null ? 'null' : i.name,
              level: i.lv,
              children: i.children,
              click: function (a: any) {
                AtcIndex = (a as unknown as NodeType).index
                goEle((a as unknown as NodeType).head)
              },
              index: i.index
            }
          }
        "
      />
    </div>
    <div
      @mouseenter="InfoExpand = true"
      @mouseleave="InfoExpand = false"
      @click="InfoHover = !InfoHover"
      :class="[
        'infoExpand',
        Theme.dark ? 'solidDark' : 'solidWhite',
        Status.maxDev ? 'cssHidden' : ''
      ]"
    >
      <span
        ref="ExtBt"
        :class="[
          'transGlobal material-symbols-outlined',
          Theme.dark ? 'darkTxtEp' : 'whiteTxtEp',
          InfoExpand ? 'expand_doAnime' : '',
          InfoHover ? 'InfoExpand_rt' : ''
        ]"
      >
        chevron_right
      </span>
    </div>
  </div>
  <div
    :class="[
      'transGlobal inner _bk _bk_outter load',
      full || about ? '_bk_full' : '',
      Status.edit ? '_bk_edit' : '',
      Status.arcDetailMax ? '' : 'cssHidden',
      Status.atcLoad ? '' : 'cssHidden'
    ]"
  >
    <LoadBall />
  </div>
</template>

<style scoped>
.cataItem {
  margin: 25px;
}
.InfoExpand_rt {
  rotate: 180deg;
}
.InfoHover {
  transform: translateX(0) !important;
}

.infoExpand {
  overflow: hidden;
  pointer-events: auto;
  cursor: pointer;
  position: absolute;
  top: calc(25% - 25px);
  left: 0px;
  width: 50px;
  height: 50px;
  border-radius: 0px 20px 20px 0px;
  box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.5);
  user-select: none;
}
.infoExpand > .material-symbols-outlined {
  font-size: 50px;
}

.expand_doAnime {
  animation: 0.5s linear 0s 1 expand;
}

@keyframes expand {
  0% {
    transform: translateX(0px);
  }
  33% {
    transform: translateX(-10px);
  }
  50% {
    transform: translateX(5px);
  }
  100% {
    transform: translateX(0px);
  }
}

.fullZone {
  /* background-color: #000; */
  width: 100% !important;
  max-width: 100% !important;
  height: 100% !important;
}
.load > div {
  position: relative;
  width: 100px;
  aspect-ratio: 1/1;
  /* background-color: aqua; */
  overflow: hidden;
  /* display: flex; */
  /* align-items: end; */
  border-radius: 5px;
  padding: 5px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
}

.bkImg {
  background-size: cover;
}

._bottomItem {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 2px solid gray;
}

.numInfo {
  line-height: 30px;
  padding-inline: 5px;
}

._bottomItem:last-of-type {
  border-right: unset;
}

.infoTxt {
  margin-left: 10px;
  top: 10px;
}
.leftIcon {
  /* background-color: #000; */
  height: 100%;
  display: flex;
  align-items: center;
  border-right: 2px solid gray;
}

.rightContent {
  margin-left: 10px;
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 20px;
  line-height: 30px;
}

.leftIcon > .material-symbols-outlined {
  padding: 5px;
  font-size: 25px;
}

.Blk {
  /* position: absolute; */
  margin-left: 16px;
  margin-top: 16px;
  width: calc(100% - 32px);
  /* height: 100px; */
  display: flex;
  border-radius: 18px;
  border: 1px solid gray;
}

._title {
  height: 80px;
}

._tag {
  height: 50px;
}

._time {
  height: 75px;
}

._time > .rightContent {
  line-height: 20px;
  font-size: 15px;
}

._bottom {
  height: 30px;
  align-items: center;
  justify-content: center;
}

.infoBox {
  width: 350px;
  height: 350px;
  margin-top: 25px;
  margin-right: 25px;
  border-radius: 20px;
  background-size: cover;
  box-shadow: 0px 0px 15px #0008;
  overflow: hidden;
  position: relative;
  backdrop-filter: blur(5px);
}

.leftZone {
  position: absolute;
  top: 0px;
  left: 0px;
  /* width: 100px; */
  height: 100%;
  transform: translateX(-100%);
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  /* background-color: #000; */
}

.rightZone {
  position: absolute;
  top: 0px;
  right: 0px;
  /* width: 100px; */
  height: 100%;
  transform: translateX(100%);
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  /* background-color: #000; */
}

.after {
  width: 100%;
  height: 100%;
}

.dark_after {
  background-color: rgba(0, 0, 0, 0.2);
}

.white_after {
  background-color: rgba(255, 255, 255, 0.2);
}

.inner {
  top: 0px !important;
  height: 100% !important;
  border-radius: 0px !important;
  box-shadow: unset !important;
  pointer-events: none !important;
  /* background-color: #000; */
}

.innerItemsBox {
  position: relative;
  width: 100%;
  height: 100%;
}

.rightBottom {
  pointer-events: auto;
  display: flex;
  position: absolute;
  right: 20px;
  bottom: 50px;
  /* padding: 10px; */
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
  border-radius: 5px;
}

.rightTop {
  pointer-events: auto;
  display: flex;
  position: absolute;
  right: 20px;
  top: 50px;
  /* padding: 10px; */
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
  border-radius: 5px;
}

.right_Hidden {
  transform: translateX(200%);
}

.innerEditor {
  margin-top: 5px;
  /* width: calc(100% - 50px); */
  width: 100%;
  height: calc(100% - 30px);
  border-radius: 15px;
  border: 1px solid grey;
  overflow: hidden;
}
._bk {
  position: absolute;
  width: calc(100% - 20px);
  height: calc(100% - 30px);
  max-width: 800px;
  /* min-width: 500px; */
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 25px;
  pointer-events: auto;
  overflow: hidden auto;
  box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.5);
}

._bk_outter {
  overflow: unset !important;
}

._bk_mobile {
  width: 100%;
}

._bk_full {
  height: 100%;
  /* min-width: 500px; */
  top: 0px;
  border-radius: 0px;
  /* overflow: auto; */
}

._bk_edit {
  max-width: 100%;
  overflow: hidden auto;
}

._bk_hidden {
  transform: translateY(150%);
}
.innerBox {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.top {
  /* position: absolute; */
  width: 100%;
  height: fit-content;
  /* background-color: #000; */
}
.topBox {
  position: relative;
  width: 100%;
  height: 100%;
}
.topImg {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-size: cover;
  mask: linear-gradient(#000 20%, transparent 100%);
}
.topMask {
  position: absolute;
  width: 100%;
  height: 100%;
  mask: linear-gradient(#000 20%, transparent 100%);
}
.innerEB {
  /* position: absolute; */
  display: flex;
  /* top: 100px; */
  width: 100%;
  /* height: calc(100% - 110px); */
  justify-content: center;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
  /* background-color: #000; */
}

.innerEB_full {
  padding-top: 10px;
  height: fit-content;
}

.innerBox_full {
  height: fit-content;
}

.innerEB_full::after {
  content: '';
  display: block;
  width: 100%;
  height: 25px;
}

.load {
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  pointer-events: fill !important;
}
</style>
