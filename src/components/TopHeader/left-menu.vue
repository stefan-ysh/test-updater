<template>
  <el-menu
    :default-active="activeMenu"
    class="el-menu-left"
    mode="horizontal"
    @select="selectMenu"
    style="-webkit-app-region: no-drag"
  >
    <el-menu-item index="/calendar">
      <el-icon><Calendar /></el-icon>
      <template #title v-if="isShowMenuText">Calendar</template>
    </el-menu-item>
    <el-menu-item index="/elements">
      <el-icon><document /></el-icon>
      <template #title v-if="isShowMenuText">Elements</template>
    </el-menu-item>
    <el-menu-item index="/fluorescence-transient-life">
      <el-icon><TrendCharts /></el-icon>
      <template #title v-if="isShowMenuText">FTL</template>
    </el-menu-item>
    <el-menu-item index="/color-temperature">
      <el-icon><Sunny /></el-icon>
      <template #title v-if="isShowMenuText">ColorTemp</template>
    </el-menu-item>
    <el-menu-item index="/iv-curve">
      <el-icon><Sunny /></el-icon>
      <template #title v-if="isShowMenuText"> IV Curve</template>
    </el-menu-item>
    <el-menu-item index="/chat">
      <el-icon><ChatDotRound /></el-icon>
      <template #title v-if="isShowMenuText">Chat</template>
    </el-menu-item>
    <el-menu-item index="/settings">
      <el-icon><setting /></el-icon>
      <template #title v-if="isShowMenuText">Settings</template>
    </el-menu-item>
  </el-menu>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
const curMenu = localStorage.getItem("curMenu");

// 缓存中的当前打开菜单
const menu = (curMenu && JSON.parse(curMenu)) || "/calendar";

// 当前激活的菜单
const activeMenu = ref(menu);
// 路由实例
const Router = useRouter();

// 默认跳转
Router.push({ path: activeMenu.value });
// 点击菜单
const selectMenu = (key: string, keyPath: string[]) => {
  Router.push({ path: key });
  activeMenu.value = key;
  localStorage.setItem("curMenu", JSON.stringify(activeMenu.value));
};

// 屏幕宽度
const windowWidth = ref(0);
// 屏幕高度
// const windowHeight = ref(0);

onMounted(() => {
  getWindowResize();
  window.addEventListener("resize", getWindowResize);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", getWindowResize);
});
// 获取屏幕尺寸
const getWindowResize = function () {
  windowWidth.value = window.innerWidth;
  // windowHeight.value = window.innerHeight;
};

const isShowMenuText = computed(() => {
  return windowWidth.value > 800;
});
</script>

<style scoped lang="less">
.el-menu-left {
  height: 30px;
  &.el-menu--horizontal {
    border-bottom: none !important;
  }
}
</style>
