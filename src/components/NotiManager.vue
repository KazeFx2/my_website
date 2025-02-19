<script setup lang="ts">
import { watch, ref } from 'vue'
import NotiItem from './NotiItem.vue'
import { notification } from '@/stores/notifications'

const msgZone = ref(null)
const leaveZone = ref(null)

const leaveType = ref('')
const leaveMsg = ref('')
const leaveOn = ref(false)
const enterOn = ref(false)

const InProc = ref(false)
const OutProc = ref(false)

const leaveTime = 0.3
const enterTime = 0.3
const keepTime = 1

const MaxMsg = 10

const nowLength = ref(0)

const items = ref<
  {
    type: String
    message: String
  }[]
>([])

const waitList = ref<
  {
    type: String
    message: String
  }[]
>([])

const Notification = notification()
watch(() => Notification.msgLength, notiWatcher)

function notiWatcher(newVal: number) {
  if (newVal > 0 && MaxMsg - nowLength.value > 0) {
    const array = Notification.pop(MaxMsg - nowLength.value)
    for (let i = 0; i < array.value.length; i++)
      addNoti(array.value[i].type, array.value[i].message)
  }
}

function addNoti(type: String, msg: String) {
  nowLength.value++
  waitList.value.push({
    type: type,
    message: msg
  })
  if (!InProc.value) {
    InProc.value = true
    enterOn.value = false
    doEnter()
  }
}

function doTimerEn() {
  enterOn.value = false
  if (!OutProc.value) {
    OutProc.value = true
    leaveType.value = items.value[0].type as string
    leaveMsg.value = items.value[0].message as string
    leaveOn.value = false
    setTimeout(doLeave, keepTime * 1000)
  }
  waitList.value.shift()
  if (waitList.value.length > 0) {
    doEnter()
  } else {
    InProc.value = false
  }
}

function doEnter() {
  items.value.push({
    type: waitList.value[0].type,
    message: waitList.value[0].message
  })
  enterOn.value = true
  setTimeout(doTimerEn, enterTime * 1000)
}

function doTimer() {
  leaveOn.value = false
  items.value.shift()
  nowLength.value--
  notiWatcher(Notification.msgLength)
  if (items.value.length > 0) {
    leaveType.value = items.value[0].type as string
    leaveMsg.value = items.value[0].message as string
    setTimeout(doLeave, keepTime * 1000)
  } else {
    OutProc.value = false
  }
}

function doLeave() {
  leaveOn.value = true
  setTimeout(doTimer, leaveTime * 1000 - 5)
}
</script>
<script lang="ts"></script>

<template>
  <div ref="leaveZone" :class="['notiZone']">
    <div :class="['notiInner transGlobal']">
      <NotiItem
        :class="['Item', leaveOn ? 'delAnime' : 'ItemHidden']"
        :type="leaveType"
        :message="leaveMsg"
      />
    </div>
  </div>
  <div ref="msgZone" :class="['notiZone']">
    <div :class="['notiInner']">
      <NotiItem
        v-for="(item, index) in items"
        :class="[
          'Item',
          index + 1 === items.length && enterOn ? 'MsgItem' : '',
          index === 0 && leaveOn ? 'MsgItemLeave' : ''
        ]"
        :key="item.message as string"
        :type="item.type as string"
        :message="item.message as string"
      />
    </div>
  </div>
</template>

<style scoped>
.notiZone {
  position: absolute;
  display: flex;
  top: 0px;
  width: 50%;
  min-width: 400px;
  height: 100%;
  left: 50%;
  transform: translateX(-50%);
  justify-content: center;
  align-items: start;
  /* background-color: aqua; */
}

.notiInner {
  width: 100%;
  margin-top: 50px;
  height: fit-content;
  /* height: 100px; */
  padding: 25px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  /* background-color: black; */
  mask: linear-gradient(0deg, transparent 0px, #000 25px 50%, transparent 50%),
    linear-gradient(180deg, transparent 0px, #000 25px 51%, transparent 51%);
}

.Item {
  margin-top: 5px;
}

.ItemHidden {
  opacity: 0;
}

.MsgItem:last-of-type {
  animation: 0.3s linear 0s 1 entrance;
}

.MsgItemLeave:first-of-type {
  animation: 0.3s linear 0s 1 leaveR;
}

.delAnime {
  animation: 0.3s linear 0s 1 leave;
}

@keyframes entrance {
  from {
    transform: translateY(calc(100% + 50px));
  }
  to {
    transform: translateY(0px);
  }
}

@keyframes leave {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(calc(-100% - 50px));
  }
}

@keyframes leaveR {
  from {
    /* min-height: 30px; */
    opacity: 0;
  }
  to {
    /* min-height: 0px; */
    padding: 0px;
    height: 0px;
    margin-top: 0px;
    opacity: 0;
  }
}
</style>
