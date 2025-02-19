<script setup lang="ts">
import { theme } from '@/stores/theme'
import { status } from '@/stores/status'
const Theme = theme()
const Status = status()
const itemHeight = 50
const lineHeight = 1
// const px = "px"
</script>
<script lang="ts">
import './../css/global.css'
export default {
  emits: ['itemClick', 'hover', 'leave'],
  props: {
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    last: {
      type: Boolean,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    hovered: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      isHovered: false
    }
  }
}
</script>

<template>
  <div
    :title="title"
    @mouseover="
      () => {
        if (!disabled && !isHovered) {
          isHovered = true
          $emit('hover')
        }
      }
    "
    @mouseleave="
      () => {
        if (!disabled && isHovered) {
          isHovered = false
          $emit('leave')
        }
      }
    "
    @click="
      () => {
        if (isHovered) {
          $emit('itemClick')
        }
      }
    "
    :class="['bk', 'transGlobal', Theme.dark ? 'darkTxt' : 'whiteTxt']"
  >
    <div class="bt">
      <div
        :class="[
          'itTxt transGlobal',
          isHovered
            ? Theme.dark
              ? 'hoveredDk hoveredTxtDk'
              : 'hoveredWt hoveredTxtWt'
            : hovered
              ? Theme.dark
                ? 'NhoveredTxtDk'
                : 'NhoveredTxtWt'
              : '',
          Status.capMax ? '' : 'shadowDk'
        ]"
      >
        <span class="material-symbols-outlined">
          {{ icon }}
        </span>
        <div :class="['titleTxt transGlobal', Status.capMax ? '' : 'titleTxtHidden']">
          {{ title }}
        </div>
      </div>
      <div
        :class="[
          'itTxt',
          isHovered ? 'cssShow' : 'cssHidden',
          Theme.dark ? 'hoveredTxtDk' : 'hoveredTxtWt'
        ]"
      >
        <span class="material-symbols-outlined">
          {{ icon }}
        </span>
        <div :class="['titleTxt transGlobal', Status.capMax ? '' : 'titleTxtHidden']">
          {{ title }}
        </div>
      </div>
    </div>
    <div :class="[last ? 'hidden' : 'margin', Theme.dark ? 'marginDk' : '']"></div>
  </div>
</template>

<style scoped>
.bk {
  display: flex;
  align-items: center;
  flex-direction: column;
  height: v-bind(itemHeight + 'px');
  width: 100%;
}
.darkTxt {
  color: white;
}
.whiteTxt {
  color: black;
}
.bt {
  display: flex;
  position: relative;
  align-items: center;
  flex-direction: column;
  height: v-bind(((itemHeight - lineHeight)) + 'px');
  width: 100%;
  overflow: hidden;
}
.itTxt {
  width: 100%;
  height: 100%;
  user-select: none;
  cursor: pointer;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}

.titleTxt {
  overflow: hidden;
  width: 50px;
  text-align: center;
  /* background-color: aqua; */
}

.titleTxtHidden {
  width: 0px;
}

.shadowDk {
  width: calc(100% + 20px);
}
.hoveredDk {
  box-shadow: inset 0px 0px 50px rgba(255, 255, 255, 0.8);
  filter: blur(2px);
}
.hoveredTxtDk {
  color: rgb(255, 255, 255);
}
.NhoveredTxtDk {
  filter: blur(1px);
  color: rgb(82, 82, 82);
}
.hoveredWt {
  box-shadow: inset 0px 0px 50px rgba(0, 0, 0, 0.5);
  filter: blur(5px);
}
.hoveredTxtWt {
  color: black;
}
.NhoveredTxtWt {
  filter: blur(1px);
  color: rgb(172, 172, 172);
}
.hidden {
  height: v-bind(lineHeight + 'px');
  width: 80%;
  border-radius: v-bind(lineHeight / 2 + 'px');
  background-color: rgb(168, 168, 168);
}
.margin {
  height: v-bind(lineHeight + 'px');
  width: 42%;
  min-width: 30px;
  border-radius: v-bind(lineHeight + 'px');
  background-color: rgb(168, 168, 168);
}

.marginDk {
  background-color: rgb(104, 104, 104);
}
</style>
