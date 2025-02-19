import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { prismjsPlugin } from 'vite-plugin-prismjs';
import legacy from '@vitejs/plugin-legacy';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    legacy(),
    vue(),
    vueJsx(),
    // prismjs({
    //   languages: ['json'],
    // }),
    prismjsPlugin({
      // ['json', 'css'] 按需引入，'all' 所有语言
			languages: 'all',
			// 配置行号插件
			plugins: ['line-numbers'],
			// 主题名
			theme: 'coy',
			css: true
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
