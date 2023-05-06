<template>
  <div class="layout flex flex-col">
    <div v-if="permission.isExpired" class="expired-wrap">
      <img src="@/assets/expired_remind_pic.png">
      <el-button @click="closeWindow">关闭</el-button>
    </div>
    <Home v-else/>
  </div>
</template>
<script setup lang="ts">
import electron from "electron";
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Home from "./views/Home.vue";
import { permissionStore } from "@/stores";
// 设置 store
import { settingStore } from "@/stores";
const permission = permissionStore();
permission.setExpiredFlag();
// 接收到主进程的 resize 事件
// electron.ipcRenderer.on("resizeEvent", (event, message) => {
//   // 业务处理
//   console.log("[ `主进程 resize 了` ] >", `主进程 resize 了`);
// });
// 关闭
const closeWindow = () => {
  electron.ipcRenderer.send("close");
};
// 初始化主题
const setting = settingStore();
setting.initTheme()

</script>

<style lang="less" scoped>
.layout {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  .expired-wrap {
    -webkit-app-region: drag;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    img {
      width: 90%;
    }
  }
}
</style>
