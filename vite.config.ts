/*
 * @Author: Stefan stefan_ysh@foxmail.com
 * @Date: 2022-05-11 14:27:42
 * @LastEditors: Stefan stefan_ysh@foxmail.com
 * @LastEditTime: 2022-05-11 14:39:56
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";
import electron from "vite-plugin-electron";
import electronRenderer from "vite-plugin-electron/renderer";
import polyfillExports from "vite-plugin-electron/polyfill-exports";
// 依赖可视化分析插件
import visualizer from "rollup-plugin-visualizer";
export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      //注意这里要设置为true，否则无效
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
    electron({
      main: {
        entry: "electron-main/index.ts",
      },
      preload: {
        // Must be use absolute path, this is the limit of rollup
        input: path.join(__dirname, "preload.ts"),
      },
    }),
    electronRenderer(),
    polyfillExports(),
  ],
  resolve: {
    // 使用别名
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    emptyOutDir: false, // 必须配置，否则electron相关文件将不会生成build后的文件
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, "index.html"),
        loading: path.resolve(__dirname, "loading.html"),
      },
      output: {
        chunkFileNames: "static/js/[name]-[hash].js",
        entryFileNames: "static/js/[name]-[hash].js",
        assetFileNames: "static/[ext]/name-[hash].[ext]",
      },
    },
  },
  css: {
    //css预处理
    preprocessorOptions: {
      scss: {
        /*
        引入var.scss全局预定义变量，
        如果引入多个文件，
        可以使用
        '@import "@/assets/scss/globalVariable1.scss";@import "@/assets/scss/globalVariable2.scss";'
        这种格式
          */
        additionalData:
          '@import "./src/assets/scss/globalVariable.scss";@import "./src/assets/scss/iconfont.scss";',
      },
    },
  },
});
