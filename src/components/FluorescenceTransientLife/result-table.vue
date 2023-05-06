<template>
  <!-- 历史数据 -->
  <div class="history_content" v-if="data.length">
    <!-- 历史数据表格 -->
    <el-table
      :data="data"
      border
      width="100%"
      height="calc(100vh - 230px)"
      stripe
    >
      <el-table-column
        type="index"
        :index="indexMethod"
        show-overflow-tooltip
        label="#"
      />
      <el-table-column
        v-for="col in columns"
        :key="col.key"
        :prop="col.key"
        :label="col.title"
        show-overflow-tooltip
        :width="col.width"
      />
      <el-table-column align="right" width="150">
        <template #header>
          <el-tooltip placement="left">
            <template #content>
              <p>
                <span>已占用内存：{{ spaceUsage + "kb" }} </span>
              </p>
              <p>
                <span>还剩余内存：{{ restSpace + "kb" }}</span>
              </p>
              <p>
                <span>还可存储约：{{ restStorage }} 条数据</span>
              </p>
            </template>
            <el-progress
              :percentage="process"
              :format="(_p) => (_p === 100 ? 'Full' : `${_p}%`)"
              :stroke-width="15"
              :text-inside="true"
              :color="['lightgreen', 'red']"
            />
          </el-tooltip>
        </template>
        <template #default="scope">
          <el-button
            size="small"
            @click="viewDetail(scope.$index, scope.row)"
            icon="View"
            link
            type="primary"
            >Detail</el-button
          >
          <el-popconfirm
            width="400"
            title="删除后无法恢复，确定删除?"
            confirm-button-text="取消"
            cancel-button-text="确定"
            @confirm="() => {}"
            @cancel="handleDelete(scope.$index, scope.row)"
          >
            <!-- clear history data button -->
            <template #reference>
              <el-button size="small" link type="danger" icon="Delete"
                >Delete</el-button
              >
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="
        display: flex;
        justify-content: center;
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
      "
      hide-on-single-page
      v-model:currentPage="pageNum"
      v-model:page-size="pageSize"
      :page-sizes="[10, 30, 50, 100]"
      :small="true"
      :disabled="false"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
    />
    <!-- detail dialog -->
    <el-dialog
      width="60%"
      v-model="isShowDetails"
      :show-close="false"
      modal
      align-center
    >
      <div class="details_container">
        <div class="details_content_left">τ =</div>
        <div class="details_content_right">
          <p>
            {{ currentData.B1 }} * {{ currentData.τ1 }}² +
            {{ currentData.B2 }} * {{ currentData.τ2 }}² +
            {{ currentData.B3 }} * {{ currentData.τ3 }}²
          </p>
          <el-divider></el-divider>
          <p>
            {{ currentData.B1 }} * {{ currentData.τ1 }} + {{ currentData.B2 }} *
            {{ currentData.τ2 }} + {{ currentData.B3 }} * {{ currentData.τ3 }}
          </p>
        </div>
      </div>
    </el-dialog>
  </div>
  <!-- the tips when no data is here -->
  <div v-else>
    <el-empty description="暂无历史数据" />
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, computed, watch } from "vue";
import { ftlStore } from "@/stores";
import _ from "lodash";
const ftl = ftlStore();

const pageNum = ref(1);

const pageSize = ref(10);

const total = computed(() => {
  return ftl.stateData.length;
});

// change the page size of pagination
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  pageNum.value = 1;
};

// change the page num of pagination
const handlePageChange = (page: number) => {
  pageNum.value = page;
};

// del record
const handleDelete = (index: number, item: any) => {
  ftl.delRecord(item.id);
};

// table column data
const columns = Object.freeze([
  {
    title: "τ1",
    key: "τ1",
  },
  {
    title: "τ2",
    key: "τ2",
  },
  {
    title: "τ3",
    key: "τ3",
  },
  {
    title: "B1",
    key: "B1",
  },
  {
    title: "B2",
    key: "B2",
  },
  {
    title: "B3",
    key: "B3",
  },
  {
    title: "Result",
    key: "result",
    sortable: true,
  },
  {
    title: "Time",
    key: "computationTime",
    sortable: false,
  },
]);

// convert index num
const indexMethod = (index: number) => {
  return (pageNum.value - 1) * pageSize.value + index + 1;
};

// the storage space used
const spaceUsage = ref<string | number>(0);

// the storage space remained
const restSpace = ref<string | number>(0);

// the flag that control the dialog visible or not
const isShowDetails = ref(false);

const data = computed({
  get() {
    const len = ftl.stateData.langth;
    const limit = pageSize.value * (pageNum.value - 1);
    return ftl.stateData.filter((d: any, i: number) => {
      if (i < limit || i > limit + pageSize.value) {
      } else {
        return d;
      }
    });
  },
  set(val) {
    // console.log(val);
  },
});

// current data that shows in the detail dialog
const currentData = ref<any>({});

// see detail
const viewDetail = (index: number, record: any) => {
  const temp = _.cloneDeep(record);
  for (const key in temp) {
    if (Object.prototype.hasOwnProperty.call(temp, key)) {
      // ? convert the element following to number
      if (
        [
          // "id",
          "τ1",
          "τ2",
          "τ3",
          "B1",
          "B2",
          "B3",
          // "decimalPlaces",
          // "computationTime",
          "result",
        ].includes(key)
      ) {
        temp[key] = temp[key] * 1;
      }
    }
  }
  currentData.value = temp;
  isShowDetails.value = true;
};

const storageSpace = () => {
  let size = 0;
  for (let item in window.localStorage) {
    if (window.localStorage.hasOwnProperty(item)) {
      size += (window.localStorage.getItem(item) as any).length;
    }
  }
  // console.log(`当前localStorage已使用容量为` + (size / 1024).toFixed(2) + `KB`);
  spaceUsage.value = (size / 1024).toFixed(2);
  // console.log('内存已使用' + spaceUsage.value + 'kb')
  restSpace.value = (
    (1024 * 1024 * 5 -
      unescape(encodeURIComponent(JSON.stringify(localStorage))).length) /
    1024
  ).toFixed(2);
  // console.log('内存还剩余' + restSpace.value + 'KB');
  // console.log('内存已使用' + spaceUsage.value + 'kb,' + '空间占用' + (spaceUsage.value / 5120).toFixed(2) + '%.')
  // this.process = spaceUsage.value/5200*1000
  ftl.setStorageUsage(process);
};
// 内存使用百分比
const process = computed(() => {
  return Number(((spaceUsage.value as any / 5120) * 100).toFixed(2));
});

const restStorage = computed(() => {
  const sum = (data.value as any).length;
  const average = spaceUsage.value as any / sum;
  return Math.floor(restSpace.value as any / average);
});

onMounted(() => {
  storageSpace();
  if (!ftl.stateData.length) {
    data.value = [];
  } else {
    data.value = ftl.stateData;
  }
});
const subscribe = ftl.$subscribe(
  (mutation, state) => {
    /**
     * mutation主要包含三个属性值：
     *   events：当前state改变的具体数据，包括改变前的值和改变后的值等等数据
     *   storeId：是当前store的id
     *   type：用于记录这次数据变化是通过什么途径，主要有三个分别是:
     *        "direct" ：通过 action 变化的
     *        "patch object" ：通过 $patch 传递对象的方式改变的
     *        "patch function" ：通过 $patch 传递函数的方式改变的
     */

    // 我们就可以在此处监听store中值的变化，当变化为某个值的时候，去做一些业务操作之类的
    data.value = state.stateData;
  },
  // 第二个参数options对象，是各种配置参数
  // detached:布尔值，默认 false，正常情况下，当订阅所在的组件被卸载时，订阅将被停止删除，
  //          detached 值为 true 时，即使所在组件被卸载，订阅依然在生效
  // 参数还有immediate，deep，flush等等参数 和vue3 watch的参数是一样的，多的就不介绍了，用到再看文档吧
  { detached: false }
);
// 停止订阅
// 调用上方声明的变量值，示例（subscribe），即可以停止订阅
// subscribe()
</script>
<style lang="less" scoped>
.history_content {
  .el-table {
    :deep(.el-table__inner-wrapper) {
      // 底部边框
      &::before {
        display: none !important;
      }
      // 左侧边框
      // 与 .el-table--border 的 ::before 同时设置才有效果
      .el-table__border-left-patch {
        display: none !important;
      }
      .el-table__header-wrapper {
        width: 100%;
        .el-table__header {
          width: 100% !important;
        }
      }
      .el-table__body-wrapper {
        .el-scrollbar {
          .el-scrollbar__wrap {
            .el-scrollbar__view {
              width: 100%;
              .el-table__body {
                width: 100% !important;
              }
            }
          }
        }
      }
    }
  }
  :deep(.el-table--border) {
    // 左右边框
    &::before,
    &::after {
      display: none !important;
    }
    .el-table__inner-wrapper {
      // 左侧第二个 tr 开始 第一个 td 没有边框问题修复
      td:first-child {
        border-left: 1px solid var(--el-table-border-color);
      }
    }
  }
  :deep(.el-overlay) {
    background: rgba(0, 0, 0, 0.6);
    &-dialog {
      .el-dialog {
        border-radius: 10px;
        &__header {
          display: none;
        }
        &__body {
          padding: 50px 0;
        }
      }
    }
  }
}

.details_container {
  // background-color: grey;
  // color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  .details_content_left {
    margin-right: 30px;
    font-size: 45px;
  }
  .details_content_right {
    :deep(.ant-divider-horizontal) {
      margin: 5px 0;
    }
    p {
      margin: 0;
      font-weight: 600;
      font-size: 20px;
    }
  }
}
</style>
