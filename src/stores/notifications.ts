import { ref } from 'vue'
import { defineStore } from 'pinia'

export const notification = defineStore('notification', () => {
  interface Notification {
    type: String
    message: String
  }
  const msgList = ref<Notification[]>([])
  const msgLength = ref(0)
  function showInfo(msg: String) {
    push('info', msg)
  }
  function showSuccess(msg: String) {
    push('success', msg)
  }
  function showWarn(msg: String) {
    push('warn', msg)
  }
  function showError(msg: String) {
    push('error', msg)
  }
  function showUnknown(msg: String) {
    push('unknown', msg)
  }
  function push(type: String, msg: String) {
    msgLength.value++
    msgList.value.push({
      type: type,
      message: msg
    })
  }
  function pop(val: Number) {
    const retList = ref<Notification[]>([])
    for (let i = 0; i < (val as number) && i < msgLength.value; i++) {
      const ele = msgList.value.shift()
      if (ele) retList.value.push(ele)
    }
    if (msgLength.value > (val as number)) msgLength.value -= val as number
    else msgLength.value = 0
    return retList
  }
  return { msgLength, push, pop, showInfo, showSuccess, showWarn, showError, showUnknown }
})
