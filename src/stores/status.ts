import { ref } from 'vue'
import { defineStore } from 'pinia'

export const status = defineStore('status', () => {
  const HomeworkUrl = 'https://loc.kazefx.top:3001'
  const Domain = 'kazefx.top'
  const Port = '3000'
  const ReqUrl = 'https://' + Domain + ':' + Port + '/api'
  const urlArticle = '/article'
  const urlUser = '/user'
  const urlIdentity = '/identity'
  const urlSave = '/save'
  const urlImage = '/image'
  const urlRemove = '/remove'
  const auth = ref(false)
  const identity = ref('')
  const atcLoad = ref(false)
  function setAtcLoad(val: boolean) {
    atcLoad.value = val
  }
  const mainLoad = ref(true)
  function setMainLoad(val: boolean) {
    mainLoad.value = val
  }
  function setAu(val: boolean) {
    auth.value = val
  }
  function setId(val: string) {
    identity.value = val
  }
  const capMax = ref(true)
  const arcZoneMax = ref(false)
  const arcDetailMax = ref(false)
  const topPinned = ref(true)
  const edit = ref(false)
  function switchCapMax() {
    capMax.value = !capMax.value
  }
  function setCapMax(val: boolean) {
    capMax.value = val
  }
  function switchArcZoneMax() {
    arcZoneMax.value = !arcZoneMax.value
  }
  function switchTopPinned() {
    topPinned.value = !topPinned.value
  }
  function setArcZoneMax(val: boolean) {
    arcZoneMax.value = val
  }
  function switchArcDetailMax() {
    arcDetailMax.value = !arcDetailMax.value
  }
  function setArcDetailMax(val: boolean) {
    arcDetailMax.value = val
  }
  function setTopPinned(val: boolean) {
    topPinned.value = val
  }
  function switchEdit() {
    edit.value = !edit.value
  }
  function setEdit(val: boolean) {
    edit.value = val
  }
  const noScroll = ref(true)
  function setNoScroll(val: boolean) {
    noScroll.value = val
  }
  const minDev = ref(false)
  function setMinDev(val: boolean) {
    minDev.value = val
  }
  const maxDev = ref(false)
  function setMaxDev(val: boolean) {
    maxDev.value = val
  }
  return {
    HomeworkUrl,
    atcLoad,
    setAtcLoad,
    mainLoad,
    setMainLoad,
    ReqUrl,
    urlArticle,
    urlUser,
    urlIdentity,
    urlSave,
    urlImage,
    urlRemove,
    auth,
    identity,
    setAu,
    setId,
    capMax,
    switchCapMax,
    setCapMax,
    arcZoneMax,
    switchArcZoneMax,
    setArcZoneMax,
    arcDetailMax,
    switchArcDetailMax,
    setArcDetailMax,
    topPinned,
    switchTopPinned,
    setTopPinned,
    edit,
    switchEdit,
    setEdit,
    noScroll,
    setNoScroll,
    minDev,
    setMinDev,
    maxDev,
    setMaxDev
  }
})
