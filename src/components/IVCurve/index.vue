<template>
  <!-- <a-spin
    class="loading"
    :tip="`加载中，请稍后...(${computeData.length}/${dataSum.value})`"
    :spinning="isLoading"
  > -->
  <div class="out">
    <!-- <ysh-icon type="zilaishuichang"></ysh-icon> -->
    <div class="operation">
      <div class="oparams">
        <el-input
          size="small"
          @blur="changeObattery"
          placeholder="请输入电池数量"
          v-model="paramsData.obattery"
          @pressEnter="changeObattery"
        >
          <template #prepend>电池串联条目</template>
        </el-input>
        <el-input
          size="small"
          @blur="changeOlength"
          placeholder="请输入长度"
          v-model="paramsData.olength"
          @pressEnter="changeOlength"
        >
          <template #prepend>长</template>
        </el-input>
        <el-input
        size="small"
          @blur="changeOwidth"
          placeholder="请输入宽度"
          v-model="paramsData.owidth"
          @pressEnter="changeOwidth"
        >
          <template #prepend>宽</template>
        </el-input>
        <el-input ref="oaera" class="oarea" size="small" disabled v-model="oarea">
          <template #prepend>面积</template>
        </el-input>       
        <el-input type="number"  size="small" v-model="decimalPlaceForExportData">
          <template #prepend>导出小数位</template>
        </el-input> 
      </div>
      <div class="oparams-min-width">
        <el-input
          size="small"
          @blur="changeObattery"
          placeholder="请输入电池数量"
          v-model="paramsData.obattery"
          @pressEnter="changeObattery"
        >
        </el-input>
        <el-input
          size="small"
          @blur="changeOlength"
          placeholder="请输入长度"
          v-model="paramsData.olength"
          @pressEnter="changeOlength"
        >
        </el-input>
        <el-input
        size="small"
          @blur="changeOwidth"
          placeholder="请输入宽度"
          v-model="paramsData.owidth"
          @pressEnter="changeOwidth"
        >
        </el-input>
        <el-input ref="oaera" class="oarea" size="small" disabled v-model="oarea">
        </el-input>       
        <el-input type="number"  size="small" v-model="decimalPlaceForExportData">
        </el-input> 
      </div>
      <div style="display: flex;margin-top: 10px;    justify-content: space-evenly;">
        <!-- 重置按钮 -->
        <el-button title="点击重置参数" size="small" @click="reset">
          <el-icon><Refresh /></el-icon>
          重置参数
        </el-button>
        <!-- 上传按钮 -->
        <el-button type="primary" size="small" @click.stop="uploadFileBtn">
          <el-icon><UploadFilled /></el-icon>上传文件
          <!-- <label style="cursor:pointer" for="files"><a-icon type="upload" />上传文件</label> -->
        </el-button>
        <input
          class="upload"
          multiple="true"
          type="file"
          id="files"
          ref="refFile"
          @change="importCsv"
          style="display: none"
        />
        <!-- <a id="clearCurrentData"> -->
        <el-button
          size="small"
          @click="cleanAll"
          :disabled="!iv.computeData.length"
          title="清空"
          type="danger"
        >
          <el-icon><Delete /></el-icon>
          清空
        </el-button>
        <!-- </a> -->
          <!-- <a id="exportBtn"> -->
          <el-button @click="exportExcel" :disabled="!iv.computeData.length" size="small" title="导出数据">
            <el-icon><Download /></el-icon>
            导出数据
          </el-button>
          <!-- </a> -->
      </div>
      <!-- <br />
        <br /> -->
      <!-- 文件选择后提示 -->
      <!-- <div class="desc" v-if="iv.computeData.length"> -->
      <div class="desc" v-if="0">
        <!-- <div class='desc' v-if='fileName[0]'> -->
        <!-- 从以下文件中提取 {{ dataSum.value }} 份数据，共
          {{ dataSum.value * 131 }}
          条，文件列表及详细数据如下，本检测结果只作为参考，如需验证请前往专业平台 -->
        <span
          >从导入文件件中提取 {{ dataSum }} 份数据，<span
            v-if="iv.computeData.length > 1"
            >展开文件列表可点击文件名快速查看，</span
          >本检测结果只作为参考，如需验证请前往专业平台</span
        >
        <div class="file_list">
          <el-tag
            color="purple"
            :title="item"
            size="small"
            v-for="(item, index) in fileName"
            @click="selectFile(item, index)"
            :key="index"
            >{{ item }}</el-tag
          >
        </div>
        <div class="file_operation" v-show="iv.computeData.length > 1">
          <el-button @click="resetFilterField" size="small">
            <el-icon><Tickets /></el-icon>显示全部</el-button
          >
          <el-button @click="showFileList" size="small">
            <el-icon>
              <component :is="isExpand ? 'ArrowUp' : 'ArrowDown'" />
            </el-icon>
          </el-button>
          <el-button title="设置筛选项" size="small" @click="showFilterModal">
            <el-icon><Filter /></el-icon>筛选结果
          </el-button>
        </div>
        <el-card
          shadow="hover"
          style="width: 75%; margin: 0 auto"
          v-show="isShowFilterModal && iv.computeData.length > 1"
        >
          <!-- <span>筛选条件：最小值不设置默认为0，最大值不设置默认为正无穷</span> -->
          <el-form :model="fliterConditions">
            <el-form-item label="MinFF" prop="MinFF">
              <!-- todo 清除未完成，当前为手动清除 因为 prop 原因 -->
              <!-- <el-input v-model="fliterConditions.MinFF" placeholder="FF 最小值" prop="MinFF" /> -->
              <el-input v-model="fliterConditions.MinFF" />
            </el-form-item>
            <el-form-item label="MaxFF" prop="MaxFF">
              <el-input v-model="fliterConditions.MaxFF" />
            </el-form-item>
            <el-form-item label="MinJsc" prop="MinJsc">
              <el-input v-model="fliterConditions.MinJsc" />
            </el-form-item>
            <el-form-item label="MaxJsc" prop="MaxJsc">
              <el-input v-model="fliterConditions.MaxJsc" />
            </el-form-item>
            <el-form-item label="MinVoc" prop="MinVoc">
              <el-input v-model="fliterConditions.MinVoc" />
            </el-form-item>
            <el-form-item label="MaxVoc" prop="MaxVoc">
              <el-input v-model="fliterConditions.MaxVoc" />
            </el-form-item>
            <el-form-item label="Minŋ" prop="Minŋ">
              <el-input v-model="fliterConditions.Minŋ" />
            </el-form-item>
            <el-form-item label="Maxŋ" prop="Maxŋ">
              <el-input v-model="fliterConditions.Maxŋ" />
            </el-form-item>
            <el-form-item class="filter-btn">
              <el-button type="primary" @click="filterInTheResult"
                >查询</el-button
              >
              <el-button
                type="default"
                @click="resetFilterField('fliterConditions')"
                >重置
              </el-button>
              <el-tooltip placement="left">
                <template slot="title">
                  筛选条件：最小值不设置默认为0，最大值不设置默认为正无穷
                </template>
                <el-icon><InfoFilled /></el-icon>
                <!-- <a-icon type="exclamation-circle" style="font-size: 20px" /> -->
              </el-tooltip>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      <div class="total">
        <div class="outOfTable"></div>
      </div>
    </div>
    <div class="display_content">
      <!-- 文件数据表格 -->
      <!-- <table class='dataTable' border='1' align='center' v-for='(item, index) in fileData' :key='index'>
          <caption class='tableTitle'>
            文件名：{{ fileName[index] }}
          </caption>
          <tr align='center' v-for='(item1, index1) in item' :key='index1'
            :style="index1 === 0 ? 'font-weight:bold' : 'font-weight:normal'">
            <td v-show="index2 !== 3" v-for='(item2, index2) in item1' :key='index2'>{{ item2 }}</td>
          </tr>
        </table> -->
    </div>
    <div class="echarts">
      <Chart :dataSum="dataSum" />
    </div>
  </div>
  <!-- </a-spin> -->
</template>
<script lang="ts" setup>
import { ref, reactive } from "vue";
import dayjs from "dayjs";
import { parse } from "papaparse";
import type { FormInstance } from "element-plus";
import _ from "lodash";
import Chart from "./chart.vue";
import { computed } from "@vue/reactivity";
import { ivStore } from "@/stores";
import { ElMessage } from "element-plus";
const iv = ivStore();
// 筛选条件接口
interface FliterConditions {
  MinFF: string;
  MaxFF: string;
  MinVoc: string;
  MaxVoc: string;
  MinJsc: string;
  MaxJsc: string;
  Minŋ: string;
  Maxŋ: string;
}

let fliterConditions = reactive<FliterConditions>({
  MinFF: "",
  MaxFF: "",
  MinVoc: "",
  MaxVoc: "",
  MinJsc: "",
  MaxJsc: "",
  Minŋ: "",
  Maxŋ: "",
});
const fliterConditionsRef = ref<any>();
const fileName = ref<any>([]);
const fileData = ref<any>([]);
const refFile = ref(null);
const dataSum = ref(0);
// const echartData = ref<any>([]);
// 导入文件的数量
const computeData = ref<any>([]);
const colB = ref<any>([]);
const colC = ref<any>([]);
const colE = ref<any>([]);
const colF = ref<any>([]);
const colG = ref<any>([]);
const colH = ref<any>([]);
const colI = ref<any>([]);
const colJ = ref<any>([]);
const colK = ref<any>([]);
const colL = ref<any>([]);
const colM = ref<any>([]);
const colN = ref<any>([]);
const colO = ref<any>([]);
const maxB = ref<any>(0);
const maxE = ref<any>(0);
const maxF = ref<any>(0);
const maxG = ref<any>(0);
const maxH = ref<any>(0);
const maxI = ref<any>(0);
const maxJ = ref<any>(0);
const maxK = ref<any>(0);
const maxL = ref<any>(0);
const maxM = ref<any>(0);
const maxN = ref<any>(0);
const maxO = ref<any>(0);
const Jsc = ref<any>("");
const Voc = ref<any>("");
const FF = ref<any>("");
const ŋ = ref<any>("");
// 是否展开文件列表
const isExpand = ref(false);
//   // 控制筛选框显隐的变量
const isShowFilterModal = ref(false);
const paramsData = ref<any>({
  // 串联电池数目
  obattery: 1,
  // 长
  olength: 2,
  // 宽
  owidth: 4,
});
//   // 导出数据保留小数位
const decimalPlaceForExportData = ref<number>(2);
// 导入文件
const importCsv = () => {
  // 上传文件时候删除之前记录
  fileName.value = [];
  fileData.value = [];
  // 空数组用来装数据
  let arr: any[] = [];

  // 获取文件数组长度得出文件数量
  dataSum.value = (refFile as any).value.files.length;

  let selectedFile: {
    name: any;
  };
  for (var i = 0; i < dataSum.value; i++) {
    // console.log((refFile as any).value.files[i]);
    selectedFile = (refFile as any).value.files[i];
    // 将文件名字赋值
    fileName.value.push(selectedFile.name);
    if (selectedFile === undefined) {
      return;
    }
    // var reader = new FileReader()
    // reader.readAsDataURL(selectedFile)
    // reader.onload = (evt) => {
    // 检查编码
    // let encoding = this.checkEncoding(evt.target.result)
    // 将csv转换成二维数组
    parse(selectedFile as any, {
      encoding: "ANSI",
      complete: (res: { data: any }) => {
        // UTF8 \r\n与\n混用时有可能会出问题
        let data = res.data;
        data.shift();
        if (data[data.length - 1] === "") {
          // 去除最后的空行
          data.pop();
        }
        // 为表头赋值
        // 截取除表头之外的数据
        arr.push(data.slice(0, data.length - 1));
        const echartData: any[] = [];
        const newArr = data.map((item: any[]) => {
          // let newItem = item[1] * -1000/(this.oarea/100)
          const item1 = (Number(item[2]) * -1000) / (oarea.value / 100);
          const item2 = item1 * item[1];
          echartData.push([Number(item[1]), item1]);
          colB.value.push(item[1] ? item[1] : 0);
          colC.value.push(item[2] ? item[2] : 0);
          colE.value.push(item1);
          colF.value.push(item1 * item[1] ? item1 * item[1] : 0);
          return [item1, item2];
        });
        echartData.pop();
        iv.setChartData(echartData);
        newArr.pop();
        for (let i = 0; i < colE.value.length; i++) {
          let colBPlusOne = !colB.value[i + 1] ? 0 : colB.value[i + 1];
          let colEPlusOne = !colE.value[i + 1] ? 0 : colE.value[i + 1];
          let colBPlusThree = !colB.value[i + 3] ? 0 : colB.value[i + 3];
          let colEPlusThree = !colE.value[i + 3] ? 0 : colE.value[i + 3];
          let ColE = !colE.value[i] ? 0 : colE.value[i];
          let ColB = !colB.value[i] ? 0 : colB.value[i];
          colG.value.push(ColE * colEPlusOne < 0 ? ColB : 0);
          colH.value.push(ColE * colEPlusOne < 0 ? ColE : 0);
          colI.value.push(ColE * colEPlusOne < 0 ? colBPlusOne : 0);
          colJ.value.push(ColE * colEPlusOne < 0 ? colEPlusOne : 0);
          colK.value.push(!(ColB * colBPlusOne) ? ColB : 0);
          colL.value.push(!(ColB * colBPlusOne) ? ColE : 0);
          colM.value.push(!(ColB * colBPlusOne) ? colBPlusOne : 0);
          colN.value.push(!(ColB * colBPlusOne) ? colEPlusOne : 0);
          colO.value.push(
            (-1000 * (colBPlusThree - colBPlusOne)) /
              (colEPlusThree - colEPlusOne)
          );
        }
        // =MAX(F:F)
        ŋ.value = maxF.value = Math.max(...colF.value);
        // =MAX(L:L)-(MAX(K:K)*MAX(N:N)-MAX(K:K)*MAX(L:L))/(MAX(M:M)-MAX(K:K))
        Jsc.value =
          Math.max(...colL.value) -
          (Math.max(...colK.value) * Math.max(...colN.value) -
            Math.max(...colK.value) * Math.max(...colL.value)) /
            (Math.max(...colM.value) - Math.max(...colK.value));
        // =(MAX(G:G)-MAX(H:H)*(MAX(I:I)-MAX(G:G))/(MAX(J:J)-MAX(H:H)))*1000
        // Voc.value = (Math.max(...colG.value) - Math.max(...colH.value) * (Math.max(...colI.value) - Math.max(...colG.value)) / (Math.max(...colJ.value) - Math.max(...colH.value))) * 1000
        Voc.value =
          (Math.max(...colG.value) -
            (Math.max(...colH.value) *
              (Math.max(...colI.value) - Math.max(...colG.value))) /
              (Math.max(...colJ.value) - Math.max(...colH.value))) *
          1000;
        // =(MAX(G:G)-MAX(H:H)*(MAX(I:I)-MAX(G:G))/(MAX(J:J)-MAX(H:H)))*1000
        FF.value = (ŋ.value * 1000) / Jsc.value / Voc.value;
        // 统计有效数据的条目
        computeData.value.push({
          fileName: selectedFile.name,
          chartId: "echartId" + Math.random(),
          colB: colB.value,
          colC: colC.value,
          colE: colE.value,
          colF: colF.value,
          colG: colG.value,
          colH: colH.value,
          colI: colI.value,
          colJ: colJ.value,
          colK: colK.value,
          colL: colL.value,
          colM: colM.value,
          colN: colN.value,
          FF: FF.value,
          ŋ: ŋ.value,
          Voc: Voc.value,
          Jsc: Jsc.value,
        });
        computeData.value.forEach((res: any, index: number) => {
          res.fileName = fileName.value[index];
          // res.filePath = (refFile as any).value.files[index].path;
        });

        iv.setComputeData(computeData.value);
        if (arr.length === (refFile as any).value.files.length) {
          fileData.value = arr;
        }
        (colB.value = []),
          (colC.value = []),
          (colE.value = []),
          (colF.value = []),
          (colG.value = []),
          (colH.value = []),
          (colI.value = []),
          (colJ.value = []),
          (colK.value = []),
          (colL.value = []),
          (colM.value = []),
          (colN.value = []),
          (FF.value = 0),
          (ŋ.value = 0),
          (Voc.value = 0),
          (Jsc.value = 0);
      },
    });
  }
  fileData.value = arr;
};
// 导出excel 目前包括 fileName Jsc Voc FF ŋ
const exportExcel = () => {
  // 导出数据保留小数位小于 0 的时候进行提醒
  if (decimalPlaceForExportData.value < 0) {
    return ElMessage.info("小数位不能为负数")
  }
  //列标题，逗号隔开，每一个逗号就是隔开一个单元格
  let str = `文件名,FF,ŋ,Voc,Jsc\n`;
  computeData.value.forEach((item: any, index: number) => {
    for (let obj in item) {
      if (obj == "fileName") {
        str += `${item[obj] + "\t"},`;
      } else if (obj == "FF" || obj == "Jsc" || obj == "Voc" || obj == "ŋ") {
        str += `${item[obj].toFixed(decimalPlaceForExportData.value) + "\t"},`;
      }
    }
    str += "\n";
  });
  //encodeURIComponent解决中文乱码
  let url = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str);
  //通过创建a标签实现
  // let link: any = document.getElementById("exportBtn");
  // link.href = url;
  // link.download = `IV 曲线数据${dateFormat(
  //   "YYYY-mm-dd HH:MM:SS",
  //   new Date()
  // )}.csv`;
  const downloadBtn = document.createElement("a");
  downloadBtn.href = url;
  downloadBtn.download = `IV 曲线数据${dayjs(Date.now()).format(
    "YYYY-MM-DD HH:mm:ss"
  )}.csv`;
  document.body.appendChild(downloadBtn);
  downloadBtn.click();
  document.body.removeChild(downloadBtn);
  // ElMessage.success('导出成功')
};
// 根据文件名查看对应文件
const selectFile = (fileName: any, i: number) => {
  resetFilterField();
  iv.setCurSelectedFile(fileName);
};
// 按照筛选条件查询
const filterInTheResult = () => {
  // 将筛选条件赋值给传到 echart 组件的变量
  iv.fliterConditionsToChart = _.cloneDeep(fliterConditions);
  // ElMessage.success(`FF筛选范围从${fliterConditions.MinFF}到${fliterConditions.MaxFF}`)

};
// 重置筛选条件
const resetFilterField = (formName = "") => {
  (fliterConditionsRef as any).resetFields && (fliterConditionsRef as any).resetFields();
  // fliterConditions = {
  //   MinFF: "",
  //   MaxFF: "",
  //   MinVoc: "",
  //   MaxVoc: "",
  //   MinJsc: "",
  //   MaxJsc: "",
  //   Minŋ: "",
  //   Maxŋ: "",
  // };
  console.log(fliterConditions);
  
  iv.fliterConditionsToChart = _.cloneDeep(fliterConditions);
};
// 是否显示筛选条件输入面板
const showFilterModal = () => {
  isShowFilterModal.value = !isShowFilterModal.value;
};
//   // 点击上传按钮先清空当前文件列表
const uploadFileBtn = () => {
  if (
    !(
      paramsData.value.obattery *
      paramsData.value.olength *
      paramsData.value.owidth
    )
  ) {
    return ;
  }
  cleanAll();
  // 面积为零时不能进行导入，提示并停止向下运行
  if (!oarea) {
    console.log("面积值不能为 0 ，请重新输入后再试！");
    // 面积输入框标红提示用户
    //   (vm.$refs.oaera as any).color = "#f50";
    //   // 两秒后取消标红
    //   setTimeout(() => {
    //     (vm.$refs.oaera as any).color = "";
    //   }, 1000);
    return;
  }
  // 按钮调用input 上传事件
  (document.getElementById("files") as any).click();
};
// 清空

const cleanAll = () => {
  // 清空时需清空上传列表
  (refFile as any).value.value = "";
  fileData.value = [];
  fileName.value = [];
  // echartData.value = [];
  iv.setChartData([]);
  dataSum.value = 0;
  computeData.value = [];
  iv.setComputeData([]);
};

// 改变电池数据时候触发
const changeObattery = (e: { keyCode: number; type: string }) => {
  if (e.keyCode === 13 || e.type === "blur") {
    if (!paramsData.value.obattery) {
      return ElMessage.info("请输入电池数量")
    }
  }
};
// 改变长度参数时候触发
const changeOlength = (e: { keyCode: number; type: string }) => {
  if (e.keyCode === 13 || e.type === "blur") {
    if (!paramsData.value.olength) {
      return ElMessage.info("请输入长度")
    }
  }
};
// 改变宽度参数时候触发
const changeOwidth = (e: { keyCode: number; type: string }) => {
  if (e.keyCode === 13 || e.type === "blur") {
    if (!paramsData.value.owidth) {
      return ElMessage.info("请输入款度")
    }
  }
};
// 计算出面积
const oarea = computed(() => {
  return (
    paramsData.value.obattery *
    paramsData.value.olength *
    paramsData.value.owidth
  );
});

//  {
//   }
// 充值参数
const reset = () => {
  paramsData.value = {
    // 串联电池数目
    obattery: 0,
    // 长
    olength: 0,
    // 宽
    owidth: 0,
  };
};

// 显示导入文件列表
const showFileList = () => {
  let dom = document.getElementsByClassName("file_list")[0];
  isExpand.value = !dom.classList.contains("file_list_expand");
  if (isExpand.value) {
    // 关上
    dom.classList.add("file_list_expand");
    return;
  } else {
    // 打开
    dom.classList.remove("file_list_expand");
  }
};
</script>
<style lang="less" scoped>
.out {
  .operation {
    display: flex;
    flex-direction: column;
  }

  :deep(.el-button) {
    margin: 0 10px;
  }

  .oparams {
    margin: 0 auto;
    display: flex;
    align-items: flex-start;
  }
  .oparams-min-width {
    margin: 0 auto;
    display: none;
    align-items: flex-start;
  }

  :deep(.el-input) {
    margin: 0 5px;
  }

  .oarea {
    transition: all 1s;
  }

  .select_file {
    display: flex;
    justify-content: space-between;
    padding: 0 370px;
    margin: 20px 0;
  }

  :deep(.el-empty) {
    margin: 15% auto;
  }
}

.desc {
  margin-top: 10px;

  .file_list {
    width: 100%;
    margin: 0 auto;
    height: 0;
    overflow: auto;
    transition: all 0.5s;
  }

  .file_list_expand {
    height: 60px;
  }

  .file_operation {
    margin-top: 10px;
  }

  :deep(.el-card) {
    border-radius: 5px;
    padding: 0px !important;
    border-color: rgb(208, 220, 236);

    :deep(.el-form) {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;

      input {
        border: solid rgb(238, 221, 221) 1px;
      }

      :deep(.el-form-item) {
        margin: 0 10px;
        display: flex;
        align-items: center;
      }
    }
  }

  span {
    font-size: 10px;
  }
}

.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
// 媒体查询
@media screen and (max-width: 800px){
  .oparams {
    display: none !important;
    background: red;
  }
  .oparams-min-width {
    display: flex !important;
  }
}
</style>
