<script setup lang="ts">
import TopNavi from './components/TopNavi.vue'
import NotiManager from './components/NotiManager.vue'
import CustDialog from './components/dialog/CustDialog.vue'
import LightsMana from './components/decorations/LightsMana.vue'
import LoadBall from './components/decorations/LoadBall.vue'
import { theme } from '@/stores/theme'
import { status } from './stores/status'
import { dialog } from './stores/dialog'
import { onMounted } from 'vue'
const Theme = theme()
const Status = status()
const Dialog = dialog()
onMounted(() => {
  Dialog.setActionBefore(() => {
    Status.setNoScroll(true)
  })
  if (window.innerWidth < 600) {
    Status.setMinDev(true)
    Status.setMaxDev(false)
  } else if (window.innerWidth > 1600) {
    Status.setMinDev(false)
    Status.setMaxDev(true)
  } else {
    Status.setMinDev(false)
    Status.setMaxDev(false)
  }
  window.addEventListener('resize', () => {
    if (window.innerWidth < 600) {
      Status.setMinDev(true)
      Status.setMaxDev(false)
    } else if (window.innerWidth > 1600) {
      Status.setMinDev(false)
      Status.setMaxDev(true)
    } else {
      Status.setMinDev(false)
      Status.setMaxDev(false)
    }
  })
})
onload = () => {
  Status.setMainLoad(false)
  Status.setNoScroll(false)
}
</script>
<script lang="ts"></script>

<template>
  <div :class="['background']"></div>
  <div :class="['main Background transGlobal', Theme.dark ? 'darkAfter' : 'whiteAfter']"></div>
  <!-- <RouterLink to="/">Home</RouterLink> | <RouterLink to="/login">Login</RouterLink> -->

  <div
    :class="[
      'main transGlobal',
      Theme.dark ? 'darkTxtEp' : 'whiteTxtEp',
      Status.topPinned ? 'mainTopM' : ''
    ]"
  >
    <div :class="['main transGlobal', Theme.dark ? 'darkTxtEp' : 'whiteTxtEp']">
      <LightsMana />
    </div>
    <div class="AppInnerBox">
      <RouterView :class="['event_on']" />
    </div>
  </div>

  <div :class="['main transGlobal', Theme.dark ? 'darkTxtEp' : 'whiteTxtEp']">
    <TopNavi />
  </div>
  <div :class="['main transGlobal', Theme.dark ? 'darkTxtEp' : 'whiteTxtEp']">
    <CustDialog />
  </div>
  <div :class="['main transGlobal', Theme.dark ? 'darkTxtEp' : 'whiteTxtEp']">
    <NotiManager />
  </div>
  <div :class="['mainLoad', Status.mainLoad ? '' : 'cssHidden']">
    <LoadBall />
  </div>
</template>

<style scoped>
.mainLoad {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px);
  pointer-events: fill;
  display: flex;
  justify-content: center;
  align-items: center;
}

.event_on {
  pointer-events: auto;
}
.background {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-image: url('./images/backgd.jpg');
  background-size: cover;
}

.main {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  /* min-width: 500px; */
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.mainTopM {
  top: 50px;
  height: calc(100% - 50px);
}

.AppInnerBox {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
