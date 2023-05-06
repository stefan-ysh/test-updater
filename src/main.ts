// 创建 vue 实例
import { createApp } from "vue";
// 创建 pinia 状态管理的构造函数
import { createPinia } from "pinia";
// 应用入口组件
import App from "./App.vue";
// 路由
import router from "./router";
// UI 组件
import ElementPlus from "element-plus";
import "element-plus/theme-chalk/dark/css-vars.css";
import "element-plus/dist/index.css";
// import "@/assets/theme.css"
// UI 图标
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import './assets/scss/index.scss'
// 设置组件中文显示，如日历的一周从周一开始等，默认为一周从周日开始
// import zhCn from "element-plus/es/locale/lang/zh-cn";
// import "dayjs/locale/zh-cn";
// app.use(ElementPlus, {
//   locale: zhCn,
// });
// 预览组件以及样式
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
// VuePress主题以及样式（这里也可以选择github主题）
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
// Prism
import Prism from 'prismjs';
// 代码高亮
import 'prismjs/components/prism-json';
// 选择使用主题
VMdPreview.use(vuepressTheme, {
  Prism,
});

// // 显示代码行数
// import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index';

// VMdPreview.use(createLineNumbertPlugin());

// 快速复制代码
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';

VMdPreview.use(createCopyCodePlugin());

// 安全策略设置 https://blog.csdn.net/hwytree/article/details/121287531
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
// 创建 pinia 状态管理实例
const pinia = createPinia();
// 创建应用
const app = createApp(App);
// 注册 ui 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
// 引入v-md-editor预览组件
app.use(VMdPreview);
// 挂载路由
app.use(router);
// 挂载 pinia 状态管理
app.use(pinia);
// 挂载 ui 组件库
app.use(ElementPlus);
app.mount("#app");
