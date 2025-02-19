import { ref } from 'vue'
import { defineStore } from 'pinia'

export const theme = defineStore('theme', () => {
  const dark = ref(false)
  function switchTheme() {
    dark.value = !dark.value
  }
  function setTheme(d: boolean) {
    dark.value = d
  }
  return { dark, switchTheme, setTheme }
})
