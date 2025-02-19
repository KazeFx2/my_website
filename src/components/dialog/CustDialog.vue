<script setup lang="ts">
import { theme } from '../../stores/theme'
import { dialog } from '../../stores/dialog'
import { status } from '@/stores/status'
import CustButton from '../CustButton.vue'
import TextInput from '../TextInput.vue'
import { watch, ref, type Ref } from 'vue'
const Theme = theme()
const Dialog = dialog()
const Status = status()
const expand = ref(false)
const selZone = ref(null)
const nowSelect = ref('')
interface Ele {
  style: {
    height: String
  }
}
watch(
  () => Dialog.show,
  (newVal) => {
    if (newVal) {
      Status.setNoScroll(true)
      expand.value = false
      if (Dialog.type === 'select') {
        const i = selZone as unknown as Ref<Ele>
        i.value.style.height = 25 * (Dialog.selections.length + 1) + 'px'
        nowSelect.value = Dialog.defaultInput
      }
    }
  }
)
</script>

<template>
  <div
    :class="[
      'transGlobal back',
      Theme.dark ? 'solidDarkTrs' : 'solidWhiteTrs',
      Dialog.show ? '' : 'back_Hidden'
    ]"
  >
    <div :class="['innerBox', Theme.dark ? 'solidDark' : 'solidWhite']">
      <div :class="['titilePart']" v-html="Dialog.Msg"></div>
      <div :class="['heightMargin', Dialog.type != 'default' ? '' : 'cssHidden']"></div>
      <TextInput
        :class="[Dialog.type === 'input' ? '' : 'cssHidden']"
        v-model="Dialog.defaultInput"
      />
      <div :class="['selectPart', Dialog.type === 'select' ? '' : 'cssHidden']">
        <div :class="['selectBox']">
          <div
            ref="selZone"
            @click="expand = !expand"
            :class="['transGlobal selections', expand ? '' : 'selections_hidden']"
          >
            <span :class="['transGlobal material-symbols-outlined', expand ? 'rotated' : '']">
              expand_more
            </span>
            <div
              :class="['transGlobal']"
              v-for="item in Dialog.selections"
              :key="item"
              @click="nowSelect = item"
            >
              {{ '&nbsp;' + item }}
            </div>
          </div>
        </div>
        <div :class="['selectBoxTxt']">
          {{ '&nbsp;' + nowSelect }}
        </div>
      </div>
      <div :class="['heightMargin']"></div>
      <div :class="['buttonPart']">
        <CustButton
          :title="Dialog.Posi"
          @click="
            () => {
              Dialog.setShow(false)
              Status.setNoScroll(false)
              if (Dialog.type === 'input' && Dialog.onInputPosi) {
                if (Dialog.onInputPosi(Dialog.defaultInput) === false) {
                  Dialog.setShow(true)
                  Status.setNoScroll(true)
                }
              } else if (Dialog.type === 'select' && Dialog.onInputPosi) {
                if (Dialog.onInputPosi(nowSelect) === false) {
                  Dialog.setShow(true)
                  Status.setNoScroll(true)
                }
              } else if (Dialog.onPosi) {
                if (Dialog.onPosi() === false) {
                  Dialog.setShow(true)
                  Status.setNoScroll(true)
                }
              }
            }
          "
        />
        <div :class="['centerMargin']"></div>
        <CustButton
          :title="Dialog.Nega"
          @click="
            () => {
              Dialog.setShow(false)
              Status.setNoScroll(false)
              Dialog.onNega()
            }
          "
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.selectPart {
  position: relative;
  width: 100%;
  height: 25px;
  /* background-color: black; */
  display: flex;
  justify-content: center;
}
.selectBox {
  position: relative;
  width: 50%;
  height: 100%;
  border-radius: 5px;
  /* background-color: aqua; */
}

.selectBoxTxt {
  position: absolute;
  left: 25%;
  width: 50%;
  height: 100%;
  border-radius: 5px;
  line-height: 25px;
}

.selections {
  position: absolute;
  width: 100%;
  /* height: fit-content; */
  border-radius: 5px;
  border: 1px solid gray;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  z-index: 100;
  overflow: hidden;
  user-select: none;
  /* background-color: aqua; */
}

.selections > .material-symbols-outlined {
  line-height: 25px;
  font-size: 25px;
  position: absolute;
  right: 0px;
}

.rotated {
  transform: rotate(180deg);
}

.selections_hidden {
  height: 25px !important;
}

.selections > div:first-of-type {
  margin-top: 25px;
}

.selections > div {
  border-top: 1px solid gray;
  height: 24px;
  width: 100%;
  /* background-color: black; */
  backdrop-filter: blur(5px);
  overflow: hidden;
}

.selections > div:hover {
  background-color: gray;
}

.selections > div:last-of-type {
  border-bottom: 5px;
}

.back {
  width: 100%;
  height: 100%;
  pointer-events: fill;
  backdrop-filter: blur(10px);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.back_Hidden {
  opacity: 0;
  pointer-events: none;
}

.innerBox {
  width: 400px;
  padding: 10px;
  padding-block: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 8px;
  border: 1px solid gray;
  box-shadow: 0px 0px 15px rgba(1, 1, 1, 0.5);
  /* background-color: black; */
}

.titilePart {
  width: 80%;
  text-align: center;
  text-wrap: wrap;
  word-wrap: break-word;
}

.buttonPart {
  width: 80%;
  display: flex;
  justify-content: center;
}

.centerMargin {
  width: 50%;
}

.heightMargin {
  width: 100%;
  height: 25px;
}
</style>
