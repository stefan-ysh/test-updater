<template>
  <el-container class="chat-gpt" :class="{'menu-collapsed': isCollapsed}">
    <el-aside v-show="!isCollapsed" width="200px"> 
      <SessionList />
    </el-aside>
    <el-main style="padding: 0"> 
      <ChatList />
    </el-main>
    <div class="collapse-btn" :style="{ left: collapseBtnLeft }" :title="isCollapsed ? '展开' : '折叠'" @click="isCollapsed = !isCollapsed">
      <i class="el-icon-s-fold" v-show="!isCollapsed"></i>
      <i class="el-icon-s-unfold" v-show="isCollapsed"></i>
    </div>
  </el-container>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { request } from "@/utils/request";
import ChatList from "./ChatList.vue";
import SessionList from "./SessionList.vue";

const isCollapsed = ref(false);

const collapseBtnLeft = computed(() => {
  return isCollapsed.value ? "0" : "200px";
});

// request("/", { prompt: "Hello, how are you?" }).then((res:any) => {
//   const jsonObjects = res.trim().split("\n");
//   const parsedObjects:any[] = [];
//   for (let i = 0; i < jsonObjects.length; i++) {
//     const parsedObject = JSON.parse(jsonObjects[i]);
//     parsedObjects.push(parsedObject);
//   }
//   console.log(parsedObjects[parsedObjects.length - 1].id);
//   console.log(parsedObjects[parsedObjects.length - 1].text);
// });
</script>

<style scoped lang="less">
.chat-gpt {
  display: flex;
  height: calc(100% + 10px);
  margin-top: -10px;
}

.menu-collapsed {
  .el-aside {
    display: none;
  }
  .el-main {
    flex: 1;
  }
  .collapse-btn {
    left: 0;
  }
}

.collapse-btn {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #9ebdec;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  // transition: all 0.3s;
  z-index: 1;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
  opacity: 0.1;
  &:hover {
    background-color: #9ebdec;
    opacity: 1;
  }
}
</style>