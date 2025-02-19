// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///web/kaze_web/node_modules/vite/dist/node/index.js";
import vue from "file:///web/kaze_web/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///web/kaze_web/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import { prismjsPlugin } from "file:///web/kaze_web/node_modules/vite-plugin-prismjs/dist/index.js";
var __vite_injected_original_import_meta_url = "file:///web/kaze_web/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    // prismjs({
    //   languages: ['json'],
    // }),
    prismjsPlugin({
      // ['json', 'css'] 按需引入，'all' 所有语言
      languages: "all",
      // 配置行号插件
      plugins: ["line-numbers"],
      // 主题名
      theme: "coy",
      css: true
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvd2ViL2themVfd2ViXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvd2ViL2themVfd2ViL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy93ZWIva2F6ZV93ZWIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCdcblxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4J1xuaW1wb3J0IHsgcHJpc21qc1BsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLXByaXNtanMnO1xuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoKSxcbiAgICB2dWVKc3goKSxcbiAgICAvLyBwcmlzbWpzKHtcbiAgICAvLyAgIGxhbmd1YWdlczogWydqc29uJ10sXG4gICAgLy8gfSksXG4gICAgcHJpc21qc1BsdWdpbih7XG4gICAgICAvLyBbJ2pzb24nLCAnY3NzJ10gXHU2MzA5XHU5NzAwXHU1RjE1XHU1MTY1XHVGRjBDJ2FsbCcgXHU2MjQwXHU2NzA5XHU4QkVEXHU4QTAwXG5cdFx0XHRsYW5ndWFnZXM6ICdhbGwnLFxuXHRcdFx0Ly8gXHU5MTREXHU3RjZFXHU4ODRDXHU1M0Y3XHU2M0QyXHU0RUY2XG5cdFx0XHRwbHVnaW5zOiBbJ2xpbmUtbnVtYmVycyddLFxuXHRcdFx0Ly8gXHU0RTNCXHU5ODk4XHU1NDBEXG5cdFx0XHR0aGVtZTogJ2NveScsXG5cdFx0XHRjc3M6IHRydWVcbiAgICB9KSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKVxuICAgIH1cbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxlQUFlLFdBQVc7QUFFNVAsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUNuQixTQUFTLHFCQUFxQjtBQUxvRyxJQUFNLDJDQUEyQztBQU9uTCxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFJUCxjQUFjO0FBQUE7QUFBQSxNQUVmLFdBQVc7QUFBQTtBQUFBLE1BRVgsU0FBUyxDQUFDLGNBQWM7QUFBQTtBQUFBLE1BRXhCLE9BQU87QUFBQSxNQUNQLEtBQUs7QUFBQSxJQUNKLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLElBQ3REO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
