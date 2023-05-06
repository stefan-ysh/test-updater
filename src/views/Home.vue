<template>
  <div class="main">
    <TopHeader style="-webkit-app-region: drag" />
    <el-container style="height: calc(100% - 30px)">
      <el-main style="padding: 10px 0 0 0;background: var(--el-fill-color-blank)">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component"/>
          </keep-alive>
        </router-view>
      </el-main>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import TopHeader from '@/components/TopHeader/index.vue'
</script>

<style lang="scss" scoped>
.main {
  overflow-x: auto;
  white-space: nowrap;
  overflow-y: hidden;
  height: 100%;
  &-group {
    padding: 0 15px;
    height: calc(100% - 6px);
  }
}
</style>
