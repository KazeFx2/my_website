<script setup lang="ts">
import CapsuleButton from './CapsuleButton.vue'
import { theme } from '@/stores/theme'
import { status } from '@/stores/status'
import { watch } from 'vue'
const Theme = theme()
const Status = status()
const nH = ref(0)
watch(
  () => Status.capMax,
  (newVal, oldVal) => {
    if (newVal) {
      var i = document.getElementById('container')
      var c = document.getElementById('content')
      var sz = 300 + (c!.childElementCount - 3) * 50
      if (i) i.style.height = sz + 'px'
    } else {
      i = document.getElementById('container')
      if (i?.className.includes('capMinHover')) alert()
      if (i) i.style.height = 50 + 'px'
    }
  }
)
defineExpose({
  nH
})
</script>
<script lang="ts">
import './../css/global.css'
import { ref } from 'vue'
export default {
  emits: ['itemClick'],
  props: {
    items: {
      type: Array<{
        title: String
        icon: String
      }>,
      required: true
    }
  },
  data() {
    return {
      isHovered: ref(false)
    }
  },
  watch: {},
  methods: {
    expandHeight(max: boolean) {
      this.isHovered = true
      var add = 80
      if (max) add = 300
      var i = document.getElementById('container')
      var c = document.getElementById('content')
      if (i && c) i.style.height = add + (c?.childElementCount - 3) * 50 + 'px'
    },
    hiddenHeight(max: boolean) {
      this.isHovered = false
      var sz = 50
      var i = document.getElementById('container')
      var c = document.getElementById('content')
      if (max) sz = 300 + (c!.childElementCount - 3) * 50
      if (i) i.style.height = sz + 'px'
    }
  }
}
</script>

<template>
  <div
    @mouseover="expandHeight(Status.capMax)"
    @mouseleave="hiddenHeight(Status.capMax)"
    id="container"
    :class="[
      'capCommon transGlobal',
      Status.capMax ? 'capBkMax horizonCenter' : 'capBkMin horizonLeft',
      !Status.capMax && isHovered ? 'capMinHover' : '',
      Theme.dark ? 'darkItem darkShadow' : 'whiteItem whiteShadow'
    ]"
  >
    <div :class="['transGlobal', Status.capMax ? 'capBkMax' : 'capBkMin']" id="content">
      <div
        :class="[
          'capImg transGlobal',
          Status.capMax ? 'capImgMax capImgMaxOutter' : 'capImgMin capImgMinOutter',
          Theme.dark ? 'capImgDarkAfter' : ''
        ]"
      >
        <div
          :class="[
            'capImgMask transGlobal',
            Status.capMax ? 'capImgMax' : 'capImgMin',
            Theme.dark ? 'capImgMaskDark' : ''
          ]"
        ></div>
      </div>
      <div :class="['box_top transGlobal', Status.capMax ? 'top_Max' : 'top_Min']"></div>
      <CapsuleButton
        v-for="(item, index) in items"
        :key="index"
        :title="item.title as string"
        :icon="item.icon as string"
        :index="index"
        :last="index + 1 === items.length"
        :hovered="isHovered && nH === 1"
        @item-click="$emit('itemClick', index, item)"
        @hover="
          () => {
            nH++
          }
        "
        @leave="
          () => {
            nH--
          }
        "
      />
      <div
        :class="[
          'box_bottom transGlobal',
          Status.capMax ? 'bottom_Max' : 'bottom_Min',
          Theme.dark ? 'darkTxtEp' : 'whiteTxtEp'
        ]"
      >
        <br />
        Welcome!
        <br />
        By Kaze
      </div>
    </div>
  </div>
</template>

<style scoped>
.box_top {
  width: 100%;
}

.top_Max {
  height: 25px;
}

.top_Min {
  height: 5px;
}

.box_bottom {
  width: 100%;
  overflow: hidden;
  font-size: small;
  text-align: center;
}

.bottom_Max {
  height: 100px;
}

.bottom_Min {
  height: 0px;
}

.capCommon {
  display: flex;
  position: absolute;
  overflow: hidden;
  pointer-events: auto;
}

.capBkMax {
  width: 200px;
  height: fit-content;
  border-radius: 200px;
}

.capBkMin {
  width: 50px;
  border-radius: 25px;
}

#content {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.capImg {
  background-image: url('https://kazefx.top:3000/api/image?hash=374f586d7b9b78a50aa147534d950df23abe5652e6cbb13f4069f5939b2de24f');
  background-size: cover;
  box-shadow: inset 0px 0px 15px rgba(0, 0, 0, 0.5);
}
.capImgMask {
  box-shadow: inset 0px 0px 15px rgba(0, 0, 0, 0.5);
}

.capImgMaskDark {
  background-color: rgba(0, 0, 0, 0.2);
}

.capImgMax {
  width: 150px;
  height: 150px;
  border-radius: 75px;
}

.capImgMaxOutter {
  margin-top: 25px;
}

.capImgMin {
  width: 40px;
  height: 40px;
  border-radius: 20px;
}

.capImgMinOutter {
  margin-top: 5px;
}
</style>
