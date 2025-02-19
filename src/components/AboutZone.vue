<script setup lang="ts">
import AboutItem from './AboutItem.vue'
import { theme } from '@/stores/theme'
import { status } from '@/stores/status'
import { onDeactivated, onMounted, ref } from 'vue'
const Theme = theme()
const Status = status()
function openWindow(url: String) {
  window.open(url as string)
}

const date = ref(new Date().toLocaleString())

function updateTime() {
  date.value = new Date().toLocaleString()
}

var interval: any

onMounted(() => {
  interval = setInterval(updateTime, 1000)
})

onDeactivated(() => {
  clearInterval(interval)
})
</script>
<script lang="ts"></script>

<template>
  <div :class="['bk']">
    <div
      :class="[
        'bottomInfo',
        Theme.dark ? 'solidDark' : 'solidWhite',
        Status.minDev ? 'bottomInfo_moblie' : ''
      ]"
    >
      <div :class="['aboutBox']">
        <div :class="['colZone']">
          <AboutItem
            :titile="'QQ'"
            :icon="'src/images/qq.png'"
            :bk-color="'rgba(255, 100, 100, 0.5)'"
            :bk-color-hover="'rgba(255, 100, 100, 1)'"
            @click="
              () => {
                openWindow(
                  'https://qm.qq.com/cgi-bin/qm/qr?k=LTbCXdITyKso3YinG7WKKD6F7nH7mKLp&noverify=0'
                )
              }
            "
          />
        </div>
        <div :class="['colSep']"></div>
        <div :class="['colZone']">
          <AboutItem
            :titile="'GitHub'"
            :icon="'src/images/github.png'"
            :bk-color="'rgba(128, 128, 128, 0.5)'"
            :bk-color-hover="'rgba(128, 128, 128, 1)'"
            @click="
              () => {
                openWindow('https://github.com/KazeFx2')
              }
            "
          />
        </div>
        <div :class="['colSep']"></div>
        <div :class="['colZone']">
          <AboutItem
            :titile="'Coolapk'"
            :icon="'src/images/coolapk.png'"
            :bk-color="'rgba(0, 100, 0, 0.5)'"
            :bk-color-hover="'rgba(0, 200, 0, 1)'"
            @click="
              () => {
                openWindow('https://www.coolapk.com/u/1169825?from=qr')
              }
            "
          />
        </div>
      </div>
      <div :class="['beian', Theme.dark ? 'darkTxt' : 'whiteTxt']">
        <div>
          <a href="https://beian.miit.gov.cn"> 渝ICP备2022000673号 </a>&nbsp;|
          <span class="material-symbols-outlined"> date_range </span>
          {{ date }}
        </div>
        网站已运行:
        {{
          Math.ceil((new Date().getTime() - new Date('2024-01-23').getTime()) / 1000 / 3600 / 24)
        }}
        天
      </div>
    </div>
  </div>
</template>

<style scoped>
.bk {
  display: flex;
  height: fit-content;
  width: 100%;
  border-radius: 25px;
  align-items: start;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 25px;
  /* padding-bottom: 25px; */
  overflow: hidden;
  /* background-color: black; */
}

.aboutBox {
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.colZone {
  width: 20%;
  min-width: 100px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: start;
  /* margin-left: 10px;
    margin-right: 10px; */
  /* background-color: aqua; */
}

.colSep {
  width: 2px;
  height: 100%;
  margin-left: 8px;
  margin-right: 8px;
  border-radius: 1px;
  background-color: rgba(128, 128, 128, 0.5);
}

.bottomInfo {
  display: flex;
  width: calc(100% - 70px);
  min-width: 335px;
  /* margin-top: 10px; */
  border-radius: 18px;
  border: 1px solid gray;
  padding: 10px;
  flex-wrap: wrap;
  height: fit-content;
}

.bottomInfo_moblie {
  width: calc(100% - 40px);
}

.beian {
  margin-top: 10px;
  width: 100%;
  text-align: center;
  font-size: small;
  line-height: 20px;
  pointer-events: auto;
}

.beian > div > a {
  color: unset;
}

.beian > div > .material-symbols-outlined {
  font-size: 18px;
  line-height: 18px;
  transform: translateY(4px);
}
</style>
