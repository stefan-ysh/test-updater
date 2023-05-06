<template>
  <div class="computatin_content">
    <el-form
      ref="paramsFormRef"
      class="params"
      size="small"
      :model="paramsForm"
    >
      <el-form-item
        v-for="(item, index) in formItems"
        :key="index"
        has-feedback
        :prop="item.value"
      >
        <el-input v-model="paramsForm[item.value]">
          <template #prepend>{{ item.label }}</template>
        </el-input>
      </el-form-item>
    </el-form>
    <!-- result -->
    <div class="computation_result_display">
      <div class="computation_result_empty" v-if="result.toString() === 'NaN'">
        <el-alert
          show-icon
          title="请输入参数进行计算"
          :closable="false"
          type="warning"
        />
      </div>
      <div class="computation_result" v-else>
        <el-alert :title="result" type="success" :closable="false" show-icon />
      </div>
    </div>
    <!-- operation -->
    <div class="operation">
      <div class="operation_decimalPlaces">
        <el-input-number
          size="small"
          controls-position="right"
          v-model="paramsForm.decimalPlaces"
          :max="100"
        >
          <template #prepend>小数位</template>
        </el-input-number>
      </div>
      <el-button
        size="small"
        type="primary"
        class="oper-btn view-formula-btn"
        :title="viewFormulaBtnText"
        @click="viewFormula"
      >
        <img
          v-show="isShowFormula"
          class="formula"
          src="@/assets/formula.png"
        />
        <el-icon><component :is="iconType" /></el-icon>
        {{ viewFormulaBtnText }}
      </el-button>
      <el-button
        size="small"
        class="oper-btn"
        type="primary"
        title="复制结果"
        :disabled="result.toString() === 'NaN'"
        @click="copyResult"
      >
        <el-icon><DocumentCopy /></el-icon>
        复制结果
      </el-button>
      <el-button
        size="small"
        class="oper-btn"
        style="margin-left: 10px"
        title="重置参数"
        @click="resetForm"
      >
        <el-icon><Refresh /></el-icon>
        重置参数
      </el-button>
      <a id="exportBtn">
        <el-button
          @click="exportExcel"
          :disabled="!ftl.stateData.length"
          title="导出历史数据"
          size="small"
        >
          <el-icon><Download /></el-icon>
          导出
        </el-button>
      </a>
      <!-- 清空历史数据确认气泡 -->
      <el-popconfirm
        width="400"
        title="清空数据后无法恢复，建议先导出，确定清空?"
        :disabled="!ftl.stateData.length"
        confirm-button-text="去导出"
        cancel-button-text="仍然清空"
        @confirm="cancelClearHistoricalData"
        @cancel="clearHistoricalData"
      >
        <!-- 清空历史数据按钮 -->
        <template #reference>
          <el-button
            size="small"
            title="清空历史数据"
            type="danger"
            style="margin-bottom: 10px"
            :disabled="!ftl.stateData.length"
          >
            <el-icon><Delete /></el-icon>
            清空
          </el-button>
        </template>
      </el-popconfirm>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { computed, ref, onMounted, reactive } from "vue";
// ref 引用类型 reference
// reactive 基本类型
import useClipboard from "vue-clipboard3";
import dayjs from "dayjs";
import { ftlStore } from "@/stores";
import _ from "lodash";
import { nanoid } from "nanoid";
const ftl = ftlStore();
const { toClipboard } = useClipboard();


const paramsForm = reactive({
  id: "",
  τ1: 0,
  τ2: 0,
  τ3: 0,
  B1: 0,
  B2: 0,
  B3: 0,
  decimalPlaces: 2,
  computationTime: "",
  result: "",
});

const formItems: Array<{
  label: string;
  value: string;
  type: string;
  placeholder: string;
}> = [
  {
    label: "τ1",
    value: "τ1",
    type: "number",
    placeholder: "请输入 τ1 值",
  },
  {
    label: "τ2",
    value: "τ2",
    type: "number",
    placeholder: "请输入 τ2 值",
  },
  {
    label: "τ3",
    value: "τ3",
    type: "number",
    placeholder: "请输入 τ3 值",
  },
  {
    label: "B1",
    value: "B1",
    type: "number",
    placeholder: "请输入 B1 值",
  },
  {
    label: "B2",
    value: "B2",
    type: "number",
    placeholder: "请输入 B2 值",
  },
  {
    label: "B3",
    value: "B3",
    type: "number",
    placeholder: "请输入 B3 值",
  },
];

let tempVal = ref<any>([]);

const isShowFormula = ref(false);

// Calculation results
const result = computed(() => {
  // 分子 molecular
  const numerator =
    paramsForm.B1 * Math.pow(paramsForm.τ1, 2) +
    paramsForm.B2 * Math.pow(paramsForm.τ2, 2) +
    paramsForm.B3 * Math.pow(paramsForm.τ3, 2);
  // 分母 denominator
  const denominator =
    paramsForm.B1 * paramsForm.τ1 +
    paramsForm.B2 * paramsForm.τ2 +
    paramsForm.B3 * paramsForm.τ3;
  return (numerator / denominator).toFixed(paramsForm.decimalPlaces);
});

// copy result
const copyResult = async () => {
  if (ftl.storageUsage === 99) {
    return ElMessage({
      message: "存储空间不足",
      type: "success",
      repeatNum: 0,
    });
  }
  paramsForm.id = nanoid();
  // 深拷贝一个数组给历史记录
  const arr = _.cloneDeep(paramsForm);
  // 当前计算时间
  const currentTime = dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss");
  arr.computationTime = currentTime;
  arr.result = result.value;
  if (!ftl.stateData.length) {
    tempVal.value = [];
  }
  tempVal.value.push(arr);
  ftl.setData(tempVal.value);
  // 将数组转成json，存到localStorage
  var str = JSON.stringify(tempVal.value);
  localStorage.setItem("localArr", str);
  // 复制成功提示
  try {
    await toClipboard(result.value);
    ElMessage({
      message: "复制成功!",
      type: "success",
      repeatNum: 0,
    });
  } catch (e) {
    ElMessage({
      message: "复制失败，请稍后再试!",
      type: "error",
    });
    console.error(e);
  }
  resetForm();
};

// view formula
const viewFormulaBtnText = ref("显示公式");
const iconType = ref("view");
const viewFormula = () => {
  isShowFormula.value = !isShowFormula.value;
  if (iconType.value === "view") {
    iconType.value = "hide";
    viewFormulaBtnText.value = "隐藏公式";
  } else {
    iconType.value = "view";
    viewFormulaBtnText.value = "显示公式";
  }
};

// reset form
const paramsFormRef = ref<any>(null);
const resetForm = () => {
  if (!paramsFormRef) {
    return;
  }
  paramsFormRef.value.resetFields();
};

// 清空历史数据
const clearHistoricalData = () => {
  ftl.setData([]);
  localStorage.removeItem("localArr");
};

const cancelClearHistoricalData = () => {
  // this.$message.info('取消清空历史数据！', 1)
};

// export excel
const exportExcel = () => {
  //列标题，逗号隔开，每一个逗号就是隔开一个单元格
  let str = `τ1,τ1,τ1,B1,B2,B3,小数位,计算时间,结果\n`;
  //增加 \t 为了不让表格显示科学计数法或者其他格式
  for (let i = 0; i < ftl.stateData.length; i++) {
    for (let item in ftl.stateData[i]) {
      // exported data doesn't contain the field 'id'
      if (item !== "id") {
        str += `${ftl.stateData[i][item] + "\t"},`;
      }
    }
    str += "\n";
  }
  // encodeURIComponent解决中文乱码
  let uri = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str);
  // 通过创建a标签实现
  let link: any = document.getElementById("exportBtn");
  link.href = uri;
  const _date = dayjs(Date.now()).format("YYYY-mm-dd HH:MM:ss");
  link.download = `历史数据${_date}.csv`;
  // this.$message.success('导出成功！', 2)
};
// init
onMounted(() => {
  const arrData = JSON.parse(localStorage.getItem("localArr") || "[]");
  tempVal.value = arrData;
  ftl.setData(tempVal.value);
});
</script>
<style lang="less" scoped>
.computatin_content {
  .params {
    display: flex;
    justify-content: space-between;
    .el-form-item {
      margin: 0 5px;
    }
  }
}

.computation_result_display {
  display: flex;
  justify-content: space-around;

  .computation_result_empty {
    width: 300px;
  }
}

.operation {
  display: flex !important;
  justify-content: space-between;
  margin-top: 20px;

  :deep(.ant-input-number) {
    width: 50px;
  }

  .oper-btn {
    margin-left: 10px;
  }

  .view-formula-btn {
    position: relative;
    // &:hover{
    //   // width: 3555px;
    //   &::after{
    //   content: '';
    //   background: url('../../assets/formula.png');
    //   position: absolute;
    //   background-size: 20rpx;
    //   top: 30%;
    //   left: 50%;
    //   transform: translate(-50%, -50%);
    //   width: 20rpx;
    //   height: 20rpx;
    //   }
    // }
  }
}

.formula {
  position: absolute;
  bottom: 35px;
  left: 250px;
  width: 200px;
  transition: all 2s;
}
</style>
