<script setup lang="ts">
import ZoneItem from './ZoneItem.vue'
import CustButton from './CustButton.vue'
import HighlightTxt from './HighlightTxt.vue'
import TopFilter from './TopFilter.vue'
import { theme } from '@/stores/theme'
import { status } from '@/stores/status'
import { ref } from 'vue'
const Theme = theme()
const Status = status()
const ExtBt = ref(null)
</script>
<script lang="ts">
import './../css/global.css'
export default {
  emits: ['itemClick', 'itemRemove', 'tagRm', 'tagAdd'],
  props: {
    items: {
      type: Array<{
        _id: String
        title: String
        release: String
        cover: String
        tags: Array<String>
        desc: String
      }>,
      required: true
    },
    Tags: {
      type: Array<String>,
      required: true
    },
    TagsEn: {
      type: Array<String>,
      required: true
    }
  },
  data() {
    return {
      isHovered: false,
      btHovered: false
    }
  }
}
</script>

<template>
  <div :class="['bk', Status.arcZoneMax ? '' : !isHovered ? 'bk_min bk_sm' : 'bk_min']">
    <div
      @mouseenter="isHovered = true"
      @mouseleave="
        (e: MouseEvent) => {
          if (e.relatedTarget) {
            if (e.relatedTarget === (ExtBt as unknown as EventTarget)) return
          } else return
          isHovered = false
        }
      "
      :class="[
        'innerBk transGlobal',
        Theme.dark ? 'darkTxtEp' : 'whiteTxtEp',
        Status.arcZoneMax ? '' : 'box_min',
        Status.arcZoneMax
          ? Theme.dark
            ? 'solidDarkTrs'
            : 'solidWhiteTrs'
          : Theme.dark
            ? 'solidDark'
            : 'solidWhite',
        !Status.arcZoneMax && !isHovered ? 'innerBk_sm' : ''
      ]"
    >
      <div :class="['_title']">
        <HighlightTxt :height="35" :text="'文档'" />
      </div>
      <TopFilter
        :-tags="Tags"
        :-tags-en="TagsEn"
        @remove="
          (tag) => {
            $emit('tagRm', tag)
          }
        "
        @add="
          (tag) => {
            $emit('tagAdd', tag)
          }
        "
      />
      <ZoneItem
        v-for="(item, index) in items"
        :key="item._id as string"
        :item-name="item.title as string"
        :item-id="item._id as string"
        :item-release="item.release as string"
        :item-tags="item.tags"
        :cover="item.cover as string"
        :max="Status.arcZoneMax || isHovered"
        :last="index + 1 === items.length"
        :desc="item.desc as string"
        @item-click="
          (id) => {
            isHovered = false
            $emit('itemClick', id)
          }
        "
        @item-remove="
          (id) => {
            $emit('itemRemove', id)
          }
        "
      />
      <div :class="['bottomAdd', Status.auth ? '' : 'cssHidden']">
        <CustButton
          title="<span class='material-symbols-outlined'>
              add
            </span>"
          :cust-title="'添加新文章'"
          @click="$emit('itemClick', '')"
        />
      </div>
    </div>
  </div>
  <div
    title="展开列表"
    @mouseenter="btHovered = true"
    @mouseleave="btHovered = false"
    @click="isHovered = !isHovered"
    :class="[
      'transGlobal expand_bt',
      Theme.dark ? 'solidDark' : 'solidWhite',
      Status.arcZoneMax ? 'expand_hidden' : ''
    ]"
  >
    <span
      ref="ExtBt"
      :class="[
        'transGlobal material-symbols-outlined',
        Theme.dark ? 'darkTxtEp' : 'whiteTxtEp',
        btHovered ? 'expand_doAnime' : '',
        isHovered ? 'addBt_rt' : ''
      ]"
    >
      chevron_left
    </span>
  </div>
</template>

<style scoped>
._title {
  width: 100%;
  height: 25px;
  margin-bottom: 15px;
}
.bottomAdd {
  width: 100%;
  height: 25px;
  display: flex;
  justify-content: center;
}

.addButton {
  width: fit-content;
}

.addButton > .material-symbols-outlined {
  line-height: 25px;
  font-size: 25px;
}

.addBt_rt {
  rotate: 180deg;
}

.material-symbols-outlined {
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
    transform: translateX(10px);
  }
  50% {
    transform: translateX(-5px);
  }
  100% {
    transform: translateX(0px);
  }
}

.expand_bt {
  overflow: hidden;
  pointer-events: auto;
  cursor: pointer;
  position: absolute;
  top: calc(50% - 25px);
  right: 0px;
  width: 50px;
  height: 50px;
  border-radius: 20px 0px 0px 20px;
  box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.5);
  user-select: none;
}

.expand_hidden {
  width: 0px;
}

.bk {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0px;
  width: 100%;
  /* height: fit-content; */
  height: calc(100% - 160px);
  min-height: 250px;
  display: flex;
  justify-content: center;
}

.bk_min {
  width: 400px;
  justify-content: end;
}

.bk_sm {
  right: 0px;
  width: 175px;
  /* overflow: hidden; */
}

.innerBk {
  pointer-events: auto;
  display: flex;
  width: 80%;
  max-width: 750px;
  flex-wrap: wrap;
  justify-content: center;
  align-content: start;
  /* height: fit-content; */
  border-radius: 25px;
  padding: 25px;
  box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.2);
  overflow: auto;
  backdrop-filter: blur(5px);
}

.innerBk_sm {
  overflow: hidden;
  transform: translateX(100%);
}
</style>
