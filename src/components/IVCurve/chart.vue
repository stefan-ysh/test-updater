<template>
  <div class="out" id="out">
    <div
      v-for="(item, index) in finalData"
      :key="item.chartId"
      :id="item.chartId"
      class="chart-div"
    ></div>
    <!-- 没有文件导入的时的展示占位图 -->
    <div v-if="!finalData.length">
      <el-empty
        :description="
          !iv.computeData.length
            ? '暂无数据，点击上传文件按钮导入数据'
            : '暂无数据，请正确设置筛选条件'
        "
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, nextTick } from "vue";
import { init } from "echarts";
import _ from "lodash";
import { ivStore } from "@/stores";
import { computed } from "@vue/reactivity";
const iv = ivStore();
const p = defineProps({
  dataSum: Number,
});

// 深色/浅色模式
// displayMode: any = "";
// 图表配置选项
const option = ref<any>({
  // backgroundColor: this.displayMode, //背景颜色，默认'rgba(0,0,0,0)'透明
  title: {
    show: true, //显示策略，默认值true,可选为：true（显示） | false（隐藏）
    text: "主标题", //主标题文本，'\n'指定换行
    link: "", //主标题文本超链接,默认值true
    target: null, //指定窗口打开主标题超链接，支持'self' | 'blank'，不指定等同为'blank'（新窗口）
    subtext: "", //副标题文本，'\n'指定换行
    sublink: "", //副标题文本超链接
    subtarget: null, //指定窗口打开副标题超链接，支持'self' | 'blank'，不指定等同为'blank'（新窗口）
    x: "center", //水平安放位置，默认为'left'，可选为：'center' | 'left' | 'right' | {number}（x坐标，单位px）
    y: "top", //垂直安放位置，默认为top，可选为：'top' | 'bottom' | 'center' | {number}（y坐标，单位px）
    textAlign: null, //水平对齐方式，默认根据x设置自动调整，可选为： left' | 'right' | 'center
    backgroundColor: "rgba(0,0,0,0)", //标题背景颜色，默认'rgba(0,0,0,0)'透明
    borderColor: "#ccc", //标题边框颜色,默认'#ccc'
    borderWidth: 0, //标题边框线宽，单位px，默认为0（无边框）
    padding: 5, //标题内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距
    itemGap: 10, //主副标题纵向间隔，单位px，默认为10
    textStyle: {
      //主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
      fontFamily: "Arial, Verdana, sans...",
      fontSize: 12,
      fontStyle: "normal",
      fontWeight: "normal",
    },
    subtextStyle: {
      //副标题文本样式{"color": "#aaa"}
      fontFamily: "Arial, Verdana, sans...",
      fontSize: 12,
      fontStyle: "normal",
      fontWeight: "normal",
    },
    zlevel: 0, //一级层叠控制。默认0,每一个不同的zlevel将产生一个独立的canvas，相同zlevel的组件或图标将在同一个canvas上渲染。zlevel越高越靠顶层，canvas对象增多会消耗更多的内存和性能，并不建议设置过多的zlevel，大部分情况可以通过二级层叠控制z实现层叠控制。
    z: 6, //二级层叠控制，默认6,同一个canvas（相同zlevel）上z越高约靠顶层。
  },
  tooltip: {
    // trigger: "axis", // item 是点，axis是区域内就触发
    // showDelay: 20,             // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
    axisPointer: {
      type: "cross",
      label: {
        backgroundColor: "#6a7985",
      },
    },
  },
  legend: {
    // data: ['搜索引擎']
  },
  toolbox: {
    show: true,
    feature: {
      mark: {
        show: true,
      },
      dataView: {
        show: true,
        readOnly: false,
      },
      // magicType: {
      //   show: true,
      //   type: ['line', 'bar']
      // },
      restore: {
        show: true,
      },
      saveAsImage: {
        show: true,
      },
      // todo 自定义按钮
      // myTool: {
      //   show: true,
      //   title: "自定义扩展方法",
      //   icon: "image://https://image.baidu.com/search/detail?ct=503316480&z=undefined&tn=baiduimagedetail&ipn=d&word=%E5%9B%BE%E6%A0%87&step_word=&ie=utf-8&in=&cl=2&lm=-1&st=undefined&hd=undefined&latest=undefined&copyright=undefined&cs=2713042258,860821358&os=1392005844,2719128708&simid=0,0&pn=4&rn=1&di=197230&ln=1977&fr=&fmq=1623431145930_R&fm=&ic=undefined&s=undefined&se=&sme=&tab=0&width=undefined&height=undefined&face=undefined&is=0,0&istype=0&ist=&jit=&bdtype=0&spn=0&pi=0&gsm=0&objurl=https%3A%2F%2Fgimg2.baidu.com%2Fimage_search%2Fsrc%3Dhttp%253A%252F%252Fpic.51yuansu.com%252Fpic2%252Fcover%252F00%252F44%252F66%252F5814b76c091d2_610.jpg%26refer%3Dhttp%253A%252F%252Fpic.51yuansu.com%26app%3D2002%26size%3Df9999%2C10000%26q%3Da80%26n%3D0%26g%3D0n%26fmt%3Djpeg%3Fsec%3D1626023145%26t%3Dfd872682398cc99100c412df24f1caec&rpstart=0&rpnum=0&adpicid=0&nojc=undefined",
      //   onclick:  (e,option) =>{
      //     console.log(e,'eeeeeeeeeee');

      //     console.log(option.getDom().id);
      //   },
      // },
      // todo 全屏
      // myFull: {
      //   show: true,
      //   title: '全屏查看',
      //   // icon: `image://${screenUrl}`,
      //   icon: "image://https://img0.baidu.com/it/u=1372099116,1175163096&fm=26&fmt=auto&gp=0.jpg",

      //   onclick: (e, option) => {
      //     const tempElement: any = document.getElementById(option.getDom().id);
      //     const element = tempElement.children[0].children[0]
      //     element.style.background = '#fff'
      //     debugger
      //     if (element.requestFullScreen) { // HTML W3C 提议
      //       element.requestFullScreen();
      //     } else if (element.msRequestFullscreen) { // IE11
      //       element.msRequestFullScreen();
      //     } else if (element.webkitRequestFullScreen) { // Webkit (works in Safari5.1 and Chrome 15)
      //       element.webkitRequestFullScreen();
      //     } else if (element.mozRequestFullScreen) { // Firefox (works in nightly)
      //       element.mozRequestFullScreen();
      //     }
      //     // 退出全屏
      //     if (element.requestFullScreen) {
      //       element.exitFullscreen();
      //     } else if (element.msRequestFullScreen) {
      //       element.exitFullscreen();
      //     } else if (element.webkitRequestFullScreen) {
      //       element.webkitCancelFullScreen();
      //     } else if (element.mozRequestFullScreen) {
      //       element.mozCancelFullScreen();
      //     }
      //   },
      // }
    },
  },
  xAxis: {
    min: 0,
  },
  yAxis: {
    min: 0,
  },
  dataZoom: [
    {
      // 这个 dataZoom 组件是 slider 型 dataZoom 组件
      type: "slider",
      xAxisIndex: 0,
      // 左边在 0% 的位置
      start: 0,
      // 左边在 100% 的位置
      end: 100,
    },
    {
      // 这个 dataZoom 组件是 inside 型 dataZoom 组件
      type: "inside",
      xAxisIndex: 0,
      start: 0,
      end: 100,
    },
    {
      // 这个 dataZoom 组件是 slider 型 dataZoom 组件
      type: "slider",
      yAxisIndex: 0,
      // 下边在 0% 的位置
      start: 0,
      end: 100,
    },
    {
      // 这个 dataZoom 组件是 inside 型 dataZoom 组件
      type: "inside",
      yAxisIndex: 0,
      // 上边在 100% 的位置
      start: 0,
      end: 100,
    },
  ],
  series: [
    {
      // 散点大小
      symbolSize: 5,
      // 数据来源
      data: [],
      // 这是个『散点图』
      type: "scatter",
      label: {
        // normal: {
        // show: true,
        position: "top",
        // },
      },
    },
  ],
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  animation: true,
});
// 初始化图表
const initChart = () => {
  finalData.value.forEach((item: any) => {
    // 新建一个promise对象
    let newPromise = new Promise<void>((resolve) => {
      resolve();
    });
    let el: HTMLElement | any;
    nextTick(() => {
      el = document.getElementById(item.chartId);
      //然后异步执行echarts的初始化函数
      newPromise.then(() => {
        //	此dom为echarts图表展示dom
        const chart = init(el);
        const bus: any[] = [];
        for (let i = 0; i < item.colB.length; i++) {
          if (item.colB[i]) bus.push([item.colB[i], item.colE[i]]);
        }
        (option.value.series[0].data as any) = bus;
        (option.value.title.text as any) = item.fileName;
        (option.value.title.subtext as any) = `${
          "Jsc: " +
          item.Jsc.toFixed(3) +
          "    Voc: " +
          item.Voc.toFixed(3) +
          "    ŋ: " +
          item.ŋ.toFixed(3) +
          "    FF: " +
          item.FF.toFixed(3)
        }`;
        chart.setOption(option.value);
      });
    });
  });
};

const finalData = computed(() => {
  let val;

  if (iv.curSelectedFile) {
    val = iv.computeData.filter((c: any) => {
      return iv.curSelectedFile === c.fileName;
    });
  } else {
    val = iv.computeData;
  }
  return val.filter((d: any) => {
    // return 出符合筛选条件的数据 最小值未输入则视为 0，最大值未输入则视为 正无穷
    return (
      Number(
        iv.fliterConditionsToChart.MinFF ? iv.fliterConditionsToChart.MinFF : 0
      ) <= Number(d.FF) &&
      Number(d.FF) <=
        Number(
          iv.fliterConditionsToChart.MaxFF
            ? iv.fliterConditionsToChart.MaxFF
            : Infinity
        ) &&
      Number(
        iv.fliterConditionsToChart.MinVoc
          ? iv.fliterConditionsToChart.MinVoc
          : 0
      ) <= Number(d.Voc) &&
      Number(d.Voc) <=
        Number(
          iv.fliterConditionsToChart.MaxVoc
            ? iv.fliterConditionsToChart.MaxVoc
            : Infinity
        ) &&
      Number(
        iv.fliterConditionsToChart.MinJsc
          ? iv.fliterConditionsToChart.MinJsc
          : 0
      ) <= Number(d.Jsc) &&
      Number(d.Jsc) <=
        Number(
          iv.fliterConditionsToChart.MaxJsc
            ? iv.fliterConditionsToChart.MaxJsc
            : Infinity
        ) &&
      Number(
        iv.fliterConditionsToChart.Minŋ ? iv.fliterConditionsToChart.Minŋ : 0
      ) <= Number(d.ŋ) &&
      Number(d.ŋ) <=
        Number(
          iv.fliterConditionsToChart.Maxŋ
            ? iv.fliterConditionsToChart.Maxŋ
            : Infinity
        )
    );
  });
});

watch(
  finalData,
  (newVal) => {
    initChart();
  },
  {
    // immediate: true,
    // deep: true,
  }
);
</script>
<style lang="less" scoped>
.out {
  display: flex !important;
  flex-wrap: wrap;
  justify-content: center;
  height: calc(100vh - 100px);
  overflow-y: auto;

  .chart-div {
    width: 450px;
    height: 450px;
    margin: 20px;
  }
}
</style>
