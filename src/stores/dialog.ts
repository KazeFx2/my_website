import { ref } from 'vue'
import { defineStore } from 'pinia'

export const dialog = defineStore('dialog', () => {
  const onPosi = ref<() => any>()
  const onInputPosi = ref<(v: string) => any>()
  const onNega = ref(() => {})
  const Msg = ref('')
  const defaultInput = ref('')
  const selections = ref<string[]>([])
  const Posi = ref('')
  const Nega = ref('')
  const show = ref(false)
  const actionBefore = ref(() => {})
  const type = ref('')
  function setPosi(val: () => any) {
    onPosi.value = val
  }
  function setInputPosi(val: (v: string) => any) {
    onInputPosi.value = val
  }
  function setNega(val: () => any) {
    onNega.value = val
  }
  function setMsg(val: string) {
    Msg.value = val
  }
  function setDefaultInput(val: string) {
    defaultInput.value = val
  }
  function setSelections(val: string[]) {
    selections.value = val
  }
  function setPosiBt(val: string) {
    Posi.value = val
  }
  function setNegaBt(val: string) {
    Nega.value = val
  }
  function setShow(val: boolean) {
    show.value = val
  }
  function setActionBefore(val: () => any) {
    actionBefore.value = val
  }
  function setType(val: string) {
    type.value = val
  }
  function showDialog(
    msg: string,
    posi: string,
    posi_func: () => any,
    nega: string,
    nega_func: () => any
  ) {
    actionBefore.value()
    setType('default')
    setMsg(msg)
    setPosiBt(posi)
    setPosi(posi_func)
    setNegaBt(nega)
    setNega(nega_func)
    setShow(true)
  }
  function showInputDialog(
    msg: string,
    posi: string,
    posi_func: (val: string) => any,
    nega: string,
    nega_func: () => any,
    _default: string
  ) {
    actionBefore.value()
    setType('input')
    setMsg(msg)
    setDefaultInput(_default)
    setPosiBt(posi)
    setInputPosi(posi_func)
    setNegaBt(nega)
    setNega(nega_func)
    setShow(true)
  }
  function showSelectDialog(
    msg: string,
    posi: string,
    posi_func: (val: string) => any,
    nega: string,
    nega_func: () => any,
    selections: string[],
    _default: string
  ) {
    actionBefore.value()
    setType('select')
    setMsg(msg)
    setDefaultInput(_default)
    setSelections(selections)
    setPosiBt(posi)
    setInputPosi(posi_func)
    setNegaBt(nega)
    setNega(nega_func)
    setShow(true)
  }
  return {
    onPosi,
    onInputPosi,
    onNega,
    Msg,
    defaultInput,
    selections,
    Posi,
    Nega,
    type,
    setPosi,
    setInputPosi,
    setNega,
    setMsg,
    setPosiBt,
    setNegaBt,
    show,
    setShow,
    showDialog,
    showInputDialog,
    showSelectDialog,
    setActionBefore
  }
})
