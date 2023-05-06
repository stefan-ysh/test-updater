<template>
  <SwitchThemeBar />
  <el-button
    class="system-oper-btn"
    size="default"
    @click="mini"
    icon="Minus"
  ></el-button>
  <el-button
    class="system-oper-btn"
    size="default"
    @click="max"
    :icon="isFullScreen ? 'Notification' : 'FullScreen'"
  ></el-button>
  <el-button class="system-oper-btn" size="default" @click="close" icon="Close">
  </el-button>
</template>
<script setup lang="ts">
import { ref } from "vue";
import SwitchThemeBar from "./switchbar.vue";
import electron from "electron";
import { permissionStore } from "@/stores";
// import LeftMenu from "./left-menu.vue";
// import RightMenu from "./right-menu.vue";
const permission = permissionStore();
const isFullScreen = ref(false)
// 最小化
const mini = () => {
  electron.ipcRenderer.send("min");
};
electron.ipcRenderer.on('mainWin-max', (_, status) => {
  isFullScreen.value = status
  
})
// 最大化/还原
const max = () => {
  toggleFullScreen();
  electron.ipcRenderer.send("max");
};

// 全屏切换
const toggleFullScreen = () => {
  permission.toggleFullScreen();
};

// 关闭
const close = () => {
  electron.ipcRenderer.send("close");
};
</script>

<style scoped lang="less">
.system-oper-btn {
  border: none;
  height: 100%;
  margin: 0 !important;
  border-radius: 0 !important;
  background: none !important;
  padding: 0 15px !important;
  -webkit-app-region: no-drag;
}
</style>
