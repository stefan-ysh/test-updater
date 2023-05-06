import { defineStore, StoreDefinition } from "pinia";
// import { ElMessage } from "element-plus";
// // 筛选条件接口
// interface FliterConditions {
//   MinFF: string;
//   MaxFF: string;
//   MinVoc: string;
//   MaxVoc: string;
//   MinJsc: string;
//   MaxJsc: string;
//   Minŋ: string;
//   Maxŋ: string;
// }
export const ivStore: StoreDefinition = defineStore("iv", {
  state: () => {
    return {
      curSelectedFile: "",
      echartData: [],
      computeData: [],
      fliterConditionsToChart: [],
    };
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  getters: {
    finalData({ curSelectedFile, computeData, fliterConditionsToChart }: any) {
      let val;
      if (curSelectedFile) {
        val = computeData.filter((c: any) => {
          return curSelectedFile === c.fileName;
        });
      } else {
        val = computeData;
      }
      return val.filter((d: any) => {
        // return 出符合筛选条件的数据 最小值未输入则视为 0，最大值未输入则视为 正无穷
        return (
          Number(
            fliterConditionsToChart.MinFF ? fliterConditionsToChart.MinFF : 0
          ) <= Number(d.FF) &&
          Number(d.FF) <=
            Number(
              fliterConditionsToChart.MaxFF
                ? fliterConditionsToChart.MaxFF
                : Infinity
            ) &&
          Number(
            fliterConditionsToChart.MinVoc ? fliterConditionsToChart.MinVoc : 0
          ) <= Number(d.Voc) &&
          Number(d.Voc) <=
            Number(
              fliterConditionsToChart.MaxVoc
                ? fliterConditionsToChart.MaxVoc
                : Infinity
            ) &&
          Number(
            fliterConditionsToChart.MinJsc ? fliterConditionsToChart.MinJsc : 0
          ) <= Number(d.Jsc) &&
          Number(d.Jsc) <=
            Number(
              fliterConditionsToChart.MaxJsc
                ? fliterConditionsToChart.MaxJsc
                : Infinity
            ) &&
          Number(
            fliterConditionsToChart.Minŋ ? fliterConditionsToChart.Minŋ : 0
          ) <= Number(d.ŋ) &&
          Number(d.ŋ) <=
            Number(
              fliterConditionsToChart.Maxŋ
                ? fliterConditionsToChart.Maxŋ
                : Infinity
            )
        );
      });
    },
  },
  actions: {
    // setData(val) {
    //   this.stateData = val;
    // },
    // delRecord(id: string) {
    //   const idx = this.stateData.findIndex((d) => {
    //     d.id === id;
    //   });
    //   if (idx) {
    //     this.stateData.splice(idx, 1);
    //     ElMessage.closeAll();
    //     ElMessage.success("删除成功");
    //   }
    // },
    // setStorageUsage(val) {
    //   this.storageUsage = val;
    // },
    setCurSelectedFile(fileName) {
      this.curSelectedFile = fileName;
    },
    setChartData(data) {
      this.echartData = data;
    },
    setComputeData(data) {
      this.computeData = data;
    },
  },
});
