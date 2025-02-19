// import './assets/main.css'

import { createApp, h } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// import "babel-polyfill"

// import App from './App.vue'
import router from './router/app'

import '@kangc/v-md-editor/lib/style/base-editor.css'

import VueMarkdownEditor from '@kangc/v-md-editor'

// ## prismjs
// import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
// import Prism from 'prismjs';
// import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
// ########

// VueMarkdownEditor.use(vuepressTheme, {
//   Prism
// });

import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'

// ## 按需
// highlightjs 核心代码
// import hljs from 'highlight.js/lib/core';
// 按需引入语言包
// import json from 'highlight.js/lib/languages/json';
// hljs.registerLanguage('json', json);
// ######
// 引入所有语言包
import hljs from 'highlight.js'

VueMarkdownEditor.use(githubTheme, {
  Hljs: hljs
})

// import createHighlightLinesPlugin from '@kangc/v-md-editor/lib/plugins/highlight-lines/index';

import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index'

import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index'
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css'

import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index'
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css'

import createTipPlugin from '@kangc/v-md-editor/lib/plugins/tip/index'
import '@kangc/v-md-editor/lib/plugins/tip/tip.css'

import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index'
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css'

import createAlignPlugin from '@kangc/v-md-editor/lib/plugins/align'

import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/cdn'

import createMermaidPlugin from '@kangc/v-md-editor/lib/plugins/mermaid/cdn'
import '@kangc/v-md-editor/lib/plugins/mermaid/mermaid.css'

// VueMarkdownEditor.use(createHighlightLinesPlugin());
VueMarkdownEditor.use(createLineNumbertPlugin())
VueMarkdownEditor.use(createCopyCodePlugin())
VueMarkdownEditor.use(createTodoListPlugin())
VueMarkdownEditor.use(createTipPlugin())
VueMarkdownEditor.use(createEmojiPlugin())
VueMarkdownEditor.use(createAlignPlugin())
VueMarkdownEditor.use(createKatexPlugin())
VueMarkdownEditor.use(createMermaidPlugin())

import './css/global.css'
import './css/markdown.css'

const app = createApp({
  render: () => h(App)
})

app.use(VueMarkdownEditor)
app.use(createPinia())
app.use(router)

app.mount('#app')
