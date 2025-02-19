<script setup lang="ts">
import { theme } from '@/stores/theme'
import { status } from '@/stores/status'
import { notification } from '@/stores/notifications'
import SwitchButton from './SwitchButton.vue'
const Theme = theme()
const Status = status()
const Notification = notification()
</script>
<script lang="ts">
import './../css/global.css'
export default {
  emits: ['enable', 'disable'],
  data() {
    return {
      isHovered: false
    }
  }
}
</script>

<template>
  <div
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
    :class="['nav_t transGlobal', isHovered || Status.topPinned ? 'navHover' : 'navNHover']"
  >
    <div :class="['TopBox']">
      <div :class="['nav transGlobal', Theme.dark ? 'solidDark' : 'solidWhite']">
        <div :class="['navLeft']">
          <div
            @click="
              () => {
                const path = $route.path
                if (path === '/login')
                  Notification.showInfo(
                    '(⁠☉⁠｡⁠☉⁠)！你发现了站长的<del style=\'font-weight: bold; color: white\'>秘密</del>小道！'
                  )
                else Notification.showError('(╬ ` Д ` ) = ！这里不可以访问！')
              }
            "
            title="？？？"
            :class="['mainEntrance']"
          >
            <span class="material-symbols-outlined transGlobal"> house </span>
            KazeFxの部屋
          </div>
        </div>

        <div :class="['navRight']">
          <div
            title="固定顶栏"
            @click="Status.switchTopPinned()"
            :class="['pin transGlobal', Status.topPinned ? 'pinned' : '']"
          >
            <span class="material-symbols-outlined"> push_pin </span>
          </div>
          <div class="sw">
            <div :class="['swIcon']">
              <span
                class="material-symbols-outlined"
                v-html="Theme.dark ? 'dark_mode' : 'light_mode'"
              >
              </span>
            </div>
            <SwitchButton
              title="亮色/暗色"
              :status="Theme.dark"
              @enable="
                () => {
                  Theme.switchTheme()
                }
              "
              @disable="
                () => {
                  Theme.switchTheme()
                }
              "
            />
          </div>
        </div>
      </div>
      <div
        :class="[
          'bottomPad transGlobal',
          isHovered || Status.topPinned ? 'bottomPad_hover' : '',
          Status.topPinned ? 'bottomHidden' : ''
        ]"
      >
        <span class="material-symbols-outlined"> menu </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav {
  display: flex;
  position: relative;
  align-items: center;
  width: 100%;
  height: 50px;
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.3);
}

.nav_t {
  position: fixed;
  display: flex;
  align-items: center;
  flex-direction: column;
  top: 0px;
  left: 0px;
  width: 100%;
  height: fit-content;
  transform: translateY(-50px);
  pointer-events: auto;
}

.navHover {
  transform: translateY(0px);
}

.TopBox {
  width: 100%;
  height: fit-content;
  position: relative;
}

.navRight {
  position: absolute;
  width: fit-content;
  height: fit-content;
  display: flex;
  right: 10px;
}

.navLeft {
  position: absolute;
  width: fit-content;
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 10px;
}

.mainEntrance {
  user-select: none;
  cursor: pointer;
  line-height: 50px;
  width: fit-content;
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 20px;
}

.mainEntrance > span {
  width: 0px;
  overflow: hidden;
}

.mainEntrance:hover > span {
  width: 24px;
}

.bottomPad {
  height: 17px;
  width: 100%;
  background-color: rgba(128, 128, 128, 1);
  text-align: center;
  opacity: 0.8;
  overflow: hidden;
}

.bottomPad_hover {
  opacity: 0;
}

.bottomHidden {
  height: 0px;
}

.bottomPad > .material-symbols-outlined {
  font-size: 15px;
}

.pin {
  width: fit-content;
  height: fit-content;
  margin-right: 10px;
  rotate: 45deg;
  cursor: pointer;
  user-select: none;
}

.pinned {
  rotate: 0deg;
}

.sw {
  width: fit-content;
  height: fit-content;
  display: flex;
}

.swIcon {
  margin-right: 5px;
  user-select: none;
}
</style>
