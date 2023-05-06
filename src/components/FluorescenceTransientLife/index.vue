<template>
  <div class="computation">
    <div class="computation_top">
      <OperationArea />
    </div>
    <div class="computation_bottom">
      <ResultTable />
    </div>
  </div>
</template>
<script lang="ts" setup>
import OperationArea from "./operation-area.vue";
import ResultTable from "./result-table.vue";
</script>
<style lang="less" scoped>
.computation {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 10px);
  // justify-content: space-around;
  &_top,
  &_bottom {
    width: 100%;
  }
  &_top {
  }

  &_bottom {
  }
}
</style>
