<script setup lang="ts">
import { onMounted, onScopeDispose, ref, type Ref } from 'vue'
import { theme } from '../../stores/theme'
import { status } from '../../stores/status'
import { dialog } from '@/stores/dialog'
import { notification } from '../../stores/notifications'
import CenterCapsule from '../CenterCapsule.vue'
import ArcZone from '../ArcZone.vue'
import ArticlePreview from '../ArticlePreview.vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import router from '@/router/app'

const HomeName = "KazeFx's Blog"

const Pinned = '置顶'

document.title = HomeName

interface ArticleType {
  _id: String
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
}

interface ArticleListType {
  _id: String
  title: String
  release: String
  cover: String
  tags: Array<String>
  desc: String
  view: Number
  comments: Number
  background: String
  hidden: Boolean
}

interface DOMObject {
  parentNode?: any
  scrollTop?: number
  clientHeight?: number
  scrollHeight?: number
}

const route = useRoute()
const AboutId = '65b0b02f3ce16274f8a4d726'
const CurrentPage = ref(0)
const isAbout = ref(false)
const EnableRoll = ref(true)
const NoUpDown = ref(0)
const MaxPage = 3
const RollDelayTime = 500
const StartY = ref(0)
const EndY = ref(0)
const Theme = theme()
const Status = status()
const Dialog = dialog()
const Notification = notification()
const CenterItems = [
  {
    title: '主页',
    icon: 'home'
  },
  {
    title: '文档',
    icon: 'inventory_2'
  },
  {
    title: '关于',
    icon: 'person'
  }
]
const ArticleList: Ref<ArticleListType[]> = ref<ArticleListType[]>([])

const Atc: Ref<ArticleListType[]> = ref<ArticleListType[]>([])

const Tags: Ref<String[]> = ref<String[]>([])

const TagsEn: Ref<String[]> = ref<String[]>([])

const ArticleDetail: Ref<ArticleType> = ref({
  _id: '',
  title: '',
  body: '',
  release: '',
  modify: 'null',
  cover: '',
  tags: [],
  desc: '',
  view: 0,
  comments: 0,
  background: 'null',
  hidden: false
})

const ArticleDetailHis: Ref<ArticleType> = ref({
  _id: '',
  title: '',
  body: '',
  release: '',
  modify: 'null',
  cover: '',
  tags: [],
  desc: '',
  view: 0,
  comments: 0,
  background: 'null',
  hidden: false
})

onMounted(() => {
  closeOne()
  closeTwo()
  closeThree()
  EnableRoll.value = true
  const path = route.path
  if (path === '/about') toPage(2, true)
  else if (path === '/doc') {
    toPage(1, true)
    if (route.query) {
      if (route.query.id) {
        openArticle(route.query.id as string)
      }
    }
  } else toPage(0, true)
  queryCookie()
  window.addEventListener('wheel', wheelEvent)
  window.addEventListener('touchstart', touchStartEvent)
  window.addEventListener('touchmove', touchMoveEvent)
  window.addEventListener('touchend', touchEndEvent)
})

onScopeDispose(() => {
  window.removeEventListener('wheel', wheelEvent)
  window.removeEventListener('touchstart', touchStartEvent)
  window.removeEventListener('touchmove', touchMoveEvent)
  window.removeEventListener('touchend', touchEndEvent)
})

function wheelEvent(e: WheelEvent) {
  if (Status.noScroll) return
  var target = e.target as DOMObject
  var cond = true
  while (cond && target !== null) {
    if (target.parentNode!.parentNode === null) break
    if (target.clientHeight && target.scrollHeight) {
      var H = target.scrollHeight - target.clientHeight
      if (H > 0) {
        if (e.deltaY > 0) {
          if (H !== target.scrollTop) {
            NoUpDown.value = 0
            if (EnableRoll.value) RollDelay(RollDelayTime * 2)
            return
          }
        } else {
          if (target.scrollTop !== 0) {
            NoUpDown.value = 0
            if (EnableRoll.value) RollDelay(RollDelayTime * 2)
            return
          }
        }
      }
    }
    if (target.parentNode === undefined) cond = false
    else {
      target = target.parentNode
      if (target == document) {
        cond = false
      }
    }
  }
  NoUpDown.value = 0
  if (!EnableRoll.value) return
  if (e.deltaY > 0) {
    RollDown()
  } else {
    RollUp()
  }
}

function touchStartEvent(e: TouchEvent) {
  if (Status.noScroll) return
  var target = e.target as DOMObject
  var cond = true
  while (cond && target !== null) {
    if (target.parentNode!.parentNode === null) break
    if (target.clientHeight && target.scrollHeight) {
      var H = target.scrollHeight - target.clientHeight
      if (H > 0) {
        if (H === target.scrollTop) {
          NoUpDown.value = 1
        } else if (target.scrollTop === 0) {
          NoUpDown.value = -1
        } else {
          NoUpDown.value = 0
          if (EnableRoll.value) RollDelay(RollDelayTime * 2)
          return
        }
      }
    }
    if (target.parentNode === undefined) cond = false
    else {
      target = target.parentNode
      if (target == document) {
        cond = false
      }
    }
  }
  if (!EnableRoll.value) return
  EndY.value = StartY.value = e.touches[0].screenY
  e.preventDefault()
}

function touchMoveEvent(e: TouchEvent) {
  if (Status.noScroll) return
  if (!EnableRoll.value) return
  EndY.value = e.touches[0].screenY
  e.preventDefault()
}

function touchEndEvent(e: TouchEvent) {
  if (Status.noScroll) return
  var delta = EndY.value - StartY.value
  if (delta === 0) {
    NoUpDown.value = 0
    return
  }
  if (NoUpDown.value !== 0) {
    if (delta < 0) {
      if (NoUpDown.value !== 1) {
        NoUpDown.value = 0
        if (EnableRoll.value) RollDelay(RollDelayTime * 2)
        return
      }
    } else if (NoUpDown.value !== -1) {
      NoUpDown.value = 0
      if (EnableRoll.value) RollDelay(RollDelayTime * 2)
      return
    }
  }
  NoUpDown.value = 0
  if (!EnableRoll.value) return
  e.preventDefault()
  if (delta === 0) return
  if (delta < 0) {
    RollDown()
  } else {
    RollUp()
  }
}

function RollDelay(time: Number) {
  EnableRoll.value = false
  setTimeout(() => {
    EnableRoll.value = true
  }, time as number)
}

function RollUp() {
  if (CurrentPage.value <= 0) {
    CurrentPage.value = 0
    return
  }
  toPage(CurrentPage.value - 1)
  RollDelay(RollDelayTime)
}

function RollDown() {
  if (CurrentPage.value + 1 >= MaxPage) {
    CurrentPage.value = MaxPage - 1
    return
  }
  toPage(CurrentPage.value + 1)
  RollDelay(RollDelayTime)
}

function toPage(pageNum: Number, force: Boolean = false) {
  if ((pageNum as number) === CurrentPage.value && !(force as boolean)) {
    Notification.showInfo('已经在目标页了！')
    return
  } else if (CurrentPage.value === 2) {
    if (JSON.stringify(ArticleDetail.value) != JSON.stringify(ArticleDetailHis.value)) {
      Dialog.showDialog(
        '更改尚未保存！',
        '仍然关闭',
        () => {
          ArticleDetailHis.value = JSON.parse(JSON.stringify(ArticleDetail.value))
          toPage_inner(pageNum)
        },
        '取消',
        () => {}
      )
      return
    }
  }
  toPage_inner(pageNum)
}

function toPage_inner(pageNum: Number) {
  EnableRoll.value = true
  closePage()
  CurrentPage.value = pageNum as number
  switch (CurrentPage.value) {
    case 0:
      router.push('/')
      toOne()
      break
    case 1:
      router.push('/doc')
      toTwo()
      break
    case 2:
      router.push('/about')
      toThree()
      break
  }
}

function toOne() {
  Status.setCapMax(true)
}

function toTwo() {
  Status.setArcZoneMax(true)
  Status.setArcDetailMax(false)
  getArticles()
}

function toThree() {
  isAbout.value = true
  openArticle(AboutId)
  // Status.setArcDetailMax(true)
}

function closePage() {
  switch (CurrentPage.value) {
    case 0:
      closeOne()
      break
    case 1:
      router.push('/')
      closeTwo()
      break
    case 2:
      router.push('/')
      closeThree()
      break
  }
}

function closeOne() {
  Status.setCapMax(false)
}

function closeTwo() {
  // Status.setArcZoneMax(false)
  Status.setArcDetailMax(false)
}

function closeThree() {
  Status.setArcDetailMax(false)
  isAbout.value = false
  closeArticle()
}

function capClick(index: Number, title: String) {
  switch (index) {
    case 0:
    case 1:
    case 2:
      toPage(index)
      break
  }
}

function openArticle(id: String) {
  if (id != AboutId) EnableRoll.value = false
  if (id != AboutId) router.push('/doc?id=' + id)
  getArticleDetail(id)
  Status.setArcZoneMax(false)
  Status.setArcDetailMax(true)
}

async function removeArticle(id: String) {
  const res = await (
    await axios.get(Status.ReqUrl + Status.urlRemove + '?type=article&id=' + id, {
      withCredentials: true
    })
  ).data
  if (res.status != 0) {
    Notification.showError('移除文档失败！')
  } else {
    Notification.showSuccess('成功移除！')
    getArticles()
  }
}

function closeArticle(isAbout: boolean = false) {
  if (JSON.stringify(ArticleDetail.value) != JSON.stringify(ArticleDetailHis.value)) {
    Dialog.showDialog(
      '更改尚未保存！',
      '仍然关闭',
      () => {
        Status.setArcZoneMax(true)
        Status.setArcDetailMax(false)
        EnableRoll.value = true
        document.title = HomeName
        if (ArticleDetail.value._id != AboutId) router.push('/doc')
      },
      '取消',
      () => {}
    )
    return
  } else {
    if (ArticleDetail.value._id != AboutId) router.push('/doc')
  }
  Status.setArcZoneMax(true)
  Status.setArcDetailMax(false)
  EnableRoll.value = true
  document.title = HomeName
}

async function getArticles() {
  const tmp = await (
    await axios.get(Status.ReqUrl + Status.urlArticle + '?all', {
      withCredentials: true
    })
  ).data
  let tags: String[] = []
  for (let i = 0; i < tmp.length; i++) {
    if ((tmp[i] as ArticleType)._id === AboutId) {
      tmp.splice(i, 1)
    }
    // if (!Status.auth) {
    //   const index = (tmp[i] as ArticleType).tags.indexOf(Pinned)
    //   if (index != -1)
    //     (tmp[i] as ArticleType).tags.splice(index, 1)
    // }
    tags = [...new Set(tags.concat((tmp[i] as ArticleType).tags))]
  }
  Tags.value = [...tags]
  if (TagsEn.value.length === 0) TagsEn.value = [...tags]
  ArticleList.value = [...tmp]
  Atc.value = []
  calcAtc()
}

function calcAtc() {
  for (let i = Atc.value.length - 1; i >= 0; i--) {
    let mk = true
    for (let j = 0; j < TagsEn.value.length; j++)
      if (Atc.value[i].tags.includes(TagsEn.value[j])) {
        mk = false
        break
      }
    if (mk) Atc.value.splice(i, 1)
  }
  for (let i = 0; i < ArticleList.value.length; i++) {
    if (Atc.value.includes(ArticleList.value[i])) continue
    for (let j = 0; j < TagsEn.value.length; j++)
      if (ArticleList.value[i].tags.includes(TagsEn.value[j])) {
        Atc.value.push(ArticleList.value[i])
        break
      }
  }
  for (let i = 0; i < Atc.value.length; i++)
    if (Atc.value[i].tags.includes(Pinned)) {
      const ele = Atc.value[i]
      Atc.value.splice(i, 1)
      Atc.value.unshift(ele)
    }
}

async function getArticleDetail(id: String, forceEdit: Boolean = false) {
  if (id === '') {
    ArticleDetail.value = {
      _id: '',
      title: '未命名',
      body: '',
      release: 'null',
      modify: 'null',
      cover: 'null',
      tags: ['文档'],
      desc: ' ',
      view: 0,
      comments: 0,
      background: 'null',
      hidden: false
    }
    Status.setEdit(true)
  } else {
    Status.setAtcLoad(true)
    ArticleDetail.value = (
      await axios.get(
        Status.ReqUrl +
          Status.urlArticle +
          '?id=' +
          id +
          (forceEdit || ArticleDetail.value._id === id ? '&noAdd' : ''),
        {
          withCredentials: true
        }
      )
    ).data[0]
    Status.setAtcLoad(false)
    // if (!Status.auth) {
    //   const index = ArticleDetail.value.tags.indexOf(Pinned)
    //   if (index != -1)
    //     ArticleDetail.value.tags.splice(index, 1)
    // }
    Status.setEdit(forceEdit as boolean)
  }
  document.title = ArticleDetail.value.title as string
  ArticleDetailHis.value = JSON.parse(JSON.stringify(ArticleDetail.value))
}

async function queryCookie() {
  const res = (
    await axios.get(Status.ReqUrl + Status.urlIdentity, {
      withCredentials: true
    })
  ).data
  if (res.status === 0) {
    Status.setAu(true)
  } else {
    Status.setAu(false)
  }
}

function addTag(tag: String) {
  if (!ArticleDetail.value.tags.includes(tag) && tag !== '') {
    ArticleDetail.value.tags.push(tag)
  }
}

function delTag(tag: String) {
  if (tag === '文档') return
  ArticleDetail.value.tags = ArticleDetail.value.tags.filter((item) => item !== tag)
}

function saveTitle(title: String) {
  if (title === '') {
    Notification.showError('文档标题不可以为空！')
    return
  }
  ArticleDetail.value.title = title
}

function updateImage(type: String, val: String) {
  if (type === '顶部') ArticleDetail.value.cover = val as string
  else ArticleDetail.value.background = val as string
}

function removeImage(type: String) {
  if (type === '顶部') ArticleDetail.value.cover = 'null'
  else ArticleDetail.value.background = 'null'
}

async function saveArticle() {
  const res = await (
    await axios.post(Status.ReqUrl + Status.urlSave + '?type=article', ArticleDetail.value, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  ).data
  if (res.status === 0) {
    Notification.showSuccess('保存成功！')
    getArticles()
    getArticleDetail(ArticleDetail.value._id === '' ? res.data : ArticleDetail.value._id, true)
  } else {
    Notification.showError('保存失败！')
  }
}
</script>
<script lang="ts">
export default {
  methods: {
    test() {
      setTimeout(() => {
        console.log(this.$route.query)
      }, 1)
    }
  },
  mounted() {
    this.test()
  }
}
</script>

<template>
  <div :class="['main transGlobal', Theme.dark ? 'darkTxtEp' : 'whiteTxtEp']">
    <ArticlePreview
      v-model="ArticleDetail.body"
      :detail="ArticleDetail"
      :about="isAbout"
      @close="closeArticle"
      @add-tag="addTag"
      @del-tag="delTag"
      @save-title="saveTitle"
      @update-image="updateImage"
      @remove-image="removeImage"
      @save="saveArticle"
      @switch-hidden="ArticleDetail.hidden = !ArticleDetail.hidden"
      @set-desc="
        (str: string) => {
          ArticleDetail.desc = str
        }
      "
    />
  </div>
  <div
    :class="[
      'main transGlobal',
      Theme.dark ? 'darkTxtEp' : 'whiteTxtEp',
      CurrentPage === 1 ? '' : 'mainHidden'
    ]"
  >
    <ArcZone
      :items="Atc"
      :-tags="Tags"
      :-tags-en="TagsEn"
      @tag-rm="
        (tag) => {
          const index = TagsEn.indexOf(tag)
          TagsEn.splice(index, 1)
          calcAtc()
        }
      "
      @tag-add="
        (tag) => {
          TagsEn.push(tag)
          calcAtc()
        }
      "
      @item-click="openArticle"
      @item-remove="
        (id) => {
          Dialog.showDialog(
            '确认删除？',
            '确认',
            () => {
              removeArticle(id)
            },
            '取消',
            () => {}
          )
        }
      "
    />
  </div>
  <div :class="['main transGlobal', !Theme.dark ? 'darkTxtEp' : 'whiteTxtEp']">
    <div
      :class="['Icon transGlobal', 'upIcon', CurrentPage !== 0 && EnableRoll ? '' : 'IconHidden']"
      @click="RollUp"
    >
      <span class="material-symbols-outlined"> expand_less </span>
    </div>
    <div
      :class="[
        'Icon transGlobal',
        'downIcon',
        CurrentPage + 1 !== MaxPage && EnableRoll ? '' : 'IconHidden'
      ]"
      @click="RollDown"
    >
      <span class="material-symbols-outlined"> expand_more </span>
    </div>
  </div>
  <div :class="['main centerCap transGlobal', Theme.dark ? 'darkTxtEp' : 'whiteTxtEp']">
    <CenterCapsule :items="CenterItems" @item-click="capClick" />
  </div>
</template>

<style scoped>
.Icon {
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 15px;
  box-shadow: 0px 0px 15px rgba(128, 128, 128, 0.5);
  background-color: rgba(128, 128, 128, 0.2);
  right: calc(50% - 25px);
  overflow: hidden;
  pointer-events: auto;
  cursor: pointer;
  user-select: none;
}

.IconHidden {
  height: 0px;
}

.upIcon {
  top: 15px;
  animation: 1.5s linear 0s infinite IconAnime;
}

.downIcon {
  bottom: 15px;
  animation: 1.5s linear 1s infinite IconAnime;
}

.material-symbols-outlined {
  font-size: 50px;
}

@keyframes IconAnime {
  0% {
    transform: translateY(0px);
  }
  25% {
    transform: translateY(10px);
  }
  50% {
    transform: translateY(0px);
  }
  75% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

.centerCap {
  display: flex;
  align-items: center;
}

.main {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.mainHidden {
  transform: translateY(100%);
}

.aboutHidden {
  transform: translateX(-100%);
}
</style>
