<script setup lang="ts">
import { theme } from '@/stores/theme'
import { status } from '@/stores/status'
import ItemTaglist from './ItemTaglist.vue'
const Theme = theme()
const Status = status()
</script>
<script lang="ts">
import './../css/global.css'
export default {
  emits: ['itemClick', 'itemRemove'],
  props: {
    itemName: {
      type: String,
      required: true
    },
    itemId: {
      type: String,
      required: true
    },
    itemRelease: {
      type: String,
      required: true
    },
    itemTags: {
      type: Array<String>,
      required: true
    },
    cover: {
      type: String,
      required: false,
      default: 'null'
    },
    max: {
      type: Boolean,
      required: true
    },
    last: {
      type: Boolean,
      required: true
    },
    desc: {
      type: String,
      required: true
    }
  },
  mounted() {},
  data() {
    return {
      isHovered: false,
      dis: false
    }
  }
}
</script>

<template>
  <div
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="
      () => {
        if (!dis) $emit('itemClick', itemId)
      }
    "
    :title="itemName"
    :class="[
      'transGlobal bk_com',
      Theme.dark ? 'solidDark darkShadow' : 'solidWhite whiteShadow',
      isHovered ? 'bk_com_hover' : ''
    ]"
    :style="{ backgroundImage: 'url(' + cover + ')' }"
  >
    <div :class="['margin']"></div>
    <div :class="['com title']">{{ itemName }}</div>
    <div :class="['com desc', Theme.dark ? 'darkTxt' : 'whiteTxt']">{{ '“' + desc + '”' }}</div>
    <div :class="['mask', Theme.dark ? 'solidDarkTrs' : 'solidWhiteTrs']">
      <div :class="['com tags']">
        <ItemTaglist
          v-for="(item, index) in itemTags"
          :key="item as string"
          :tag-name="item as string"
          :img="false"
          :last="index + 1 === itemTags.length"
        />
      </div>
      <div :class="['com time']">{{ itemRelease }}</div>
    </div>
    <div
      title="删除文档"
      @mouseenter="dis = true"
      @mouseleave="dis = false"
      @click="
        () => {
          $emit('itemRemove', itemId)
        }
      "
      :class="['transGlobal delBox', Status.auth ? '' : 'cssHidden']"
    >
      <span class="material-symbols-outlined"> delete </span>
    </div>
  </div>
</template>

<style scoped>
.delBox {
  position: absolute;
  right: 5px;
  top: 5px;
  user-select: none;
  z-index: 51;
}

.delBox:hover {
  color: red;
}
.margin {
  height: 10px;
}
.mask {
  top: 0px;
  left: 0px;
  z-index: 50;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: end;
  width: 100%;
  height: 100%;
}
.bk_com {
  position: relative;
  margin-bottom: 25px;
  width: 80%;
  height: 150px;
  border-radius: 12px;
  border: 1px solid gray;
  background-size: cover;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  /* justify-content: start; */
  overflow: hidden;
  animation: 0.2s ease-in 0s 1 enter;
}

@keyframes enter {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.bk_com_hover {
  /* padding-inline: 10px; */
  padding-bottom: 10px;
  width: 90%;
}

.com {
  margin-left: 10px;
  margin-top: 5px;
  width: calc(100% - 20px);
  /* display: flex; */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  /* background-color: aqua; */
  z-index: 51;
}

.title {
  font-size: 25px;
  line-height: 27px;
}

.tags {
  display: flex;
}

.desc {
  white-space: wrap;
  line-height: 15px;
  font-size: 12px;
}

.time {
  margin-bottom: 10px;
  line-height: 15px;
  font-size: 12px;
}
</style>
