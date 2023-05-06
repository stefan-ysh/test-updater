<template>
  <div class="params">
    <!-- <a-textarea type="number" @pressEnter='caculate'  placeholder="输入坐标, x y间以空格分隔, 多个坐标以回车隔开,计算时将优先选择当前参数" v-model="pasteData" allow-clear /> -->
    <el-input
      size="small"
      v-model="xVal"
      @keyup.enter="caculate"
      placeholder="请输入要计算的CIE色坐标x值"
    >
      <template #prepend>x</template>
    </el-input>
    <el-input
      size="small"
      v-model="yVal"
      @keyup.enter="caculate"
      placeholder="请输入要计算的CIE色坐标y值"
    >
      <template #prepend>y</template>
    </el-input>
    <el-button size="small" type="primary" @click="caculate">
      <el-icon><Compass /></el-icon>
      计算
    </el-button>
    <el-button size="small" @click="reset">
      <el-icon title="重置"><Refresh /> </el-icon>
      重置
    </el-button>
    <el-button size="small" @click="point">
      <el-icon title="描点"><Sunny /></el-icon>
      描点
    </el-button>
  </div>
  <div v-show="result" style="color: var(--el-text-color-regular)">
    <ul>
      <li v-for="(item, index) in result" :key="index">
        {{ `CIE色坐标(${item.x},${item.y})的CCT值为 ${item.CCT}` }}
        <el-icon
          class="copy_icon copy-btn"
          @click="copyResult(index)"
          title="复制结果"
          ><CopyDocument
        /></el-icon>
      </li>
    </ul>
  </div>
  <!-- 色度图 -->
  <div style="display: flex; justify-content: center" :style="{ zoom }">
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="494.6"
      height="525.8"
    >
      <defs>
        <path
          id="border"
          d="M150,473C147,473 145,471 142,469C135,462 129,455 124,446C121,441 118,436 116,431C113,424 110,416 107,408C103,396 99,385 95,373C86,339 77,298 72,264C66,226 61,179 62,141C63,118 65,81 80,60C84,54 91,50 98,49C105,48 112,51 118,53C140,60 160,76 178,90C236,135 287,191 339,243C360,264 380,284 401,305C409,313 417,321 426,329C428,332 430,334 433,337C434,337 434,338 435,339C435,339 436,340 436,340"
        />
      </defs>
      <path
        opacity="0.125"
        :stroke="coordinateColor"
        stroke-width="1"
        fill="none"
        d="M85.5,475.5l0,-460.8M111.5,475.5l0,-460.8M136.5,475.5l0,-435.2M162.5,475.5l0,-409.6M188.5,475.5l0,-384M213.5,475.5l0,-358.4M239.5,475.5l0,-332.8M264.5,475.5l0,-307.2M290.5,475.5l0,-281.6M316.5,475.5l0,-256M341.5,475.5l0,-230.4M367.5,475.5l0,-204.8M392.5,475.5l0,-179.2M418.5,475.5l0,-153.6M444.5,475.5l0,-128M469.5,475.5l0,-102.4M60.5,450.5l409.6,0M60.5,424.5l409.6,0M60.5,399.5l409.6,0M60.5,373.5l409.6,0M60.5,347.5l384,0M60.5,322.5l358.4,0M60.5,296.5l332.8,0M60.5,271.5l307.2,0M60.5,245.5l281.6,0M60.5,219.5l256,0M60.5,194.5l230.4,0M60.5,168.5l204.8,0M60.5,143.5l179.2,0M60.5,117.5l153.6,0M60.5,91.5l128,0M60.5,66.5l102.4,0M60.5,40.5l76.8,0M60.5,15.5l51.2,0M111.5,15.5L469.5,373.5"
      />
      <clipPath id="clipborder">
        <use xlink:href="#border" />
      </clipPath>
      <use :stroke="coordinateColor" stroke-width="4" fill="none" xlink:href="#border" />
      <path
        d="M148.4,473.3l-0.4,6M148.1,473.3l-1.3,5.9M147.8,473.2l-4.5,8.9M147.2,472.8l-3.4,4.9M146.5,472.3l-3.8,4.7M145.5,471.4l-4,4.5M144.2,470.2l-6.7,7.4M142.5,468.7l-4,4.5M140.2,466.7l-4,4.5M137.3,464.2l-4.1,4.4M133.7,460.6l-7.4,6.8M129.4,455.4l-4.8,3.5M123.5,446.2l-5.2,3M116.1,431.3l-5.5,2.5M106.7,407.9l-9.4,3.4M95.2,373l-5.8,1.7M83.2,324.8l-5.9,1.3M72,264.5l-5.9,0.9M64.2,200.1l-10,0.8M62,140.5l-6,-0.2M67.1,91.7l-5.8,-1.5M79.9,60l-4.6,-3.9M98,48.9l-1.8,-9.8M118.5,52.8l1.9,-5.7M139.2,63.2l3,-5.2M158.8,75.6l3.4,-4.9M177.6,89.6l6.2,-7.9M196.1,104.9l3.9,-4.5M214.4,121.3l4,-4.4M232.7,138.5l4.1,-4.4M251,156.1l7,-7.2M269.3,173.9l4.2,-4.3M287.4,191.8l4.2,-4.3M305.1,209.5l4.2,-4.3M322.4,226.7l7.1,-7.1M338.9,243.1l4.2,-4.3M354.5,258.6l4.2,-4.3M368.7,272.8l4.2,-4.2M381,285.1l7.1,-7.1M391.9,295.9l4.2,-4.3M400.9,304.8l4.2,-4.3M408.2,312.1l4.2,-4.2M414.1,317.9l7.1,-7.1M418.7,322.6l4.2,-4.3M422.5,326.3l4.2,-4.3M425.6,329.4l4.2,-4.2M428.1,332l7.1,-7.1M430.2,334l4.2,-4.3M431.7,335.5l4.2,-4.2M432.9,336.7l4.2,-4.2M433.7,337.5l7.1,-7.1M434.3,338.1l4.2,-4.2M434.8,338.6l4.2,-4.2M435.2,339l4.2,-4.2M435.5,339.3l7.1,-7.1M435.8,339.6l4.2,-4.2M436,339.8l4.2,-4.2M436.1,339.9l4.2,-4.2"
        :stroke="coordinateColor"
        stroke-width="1"
      />
      <g clip-path="url(#clipborder)">
        <filter id="blur">
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
        <image
          width="27"
          height="28"
          filter="url(#blur)"
          xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAcCAIAAAAfs1O6AAAAAXNSR0IArs4c6QAAA7tJREFUeF591cuKHFUYwPH/d+rUpaenZ5JMLkaMuBAJQly5EeJCtz6M+AC+khvxIbIw4AVMAsEQJ5kkM+mpnumu7rqdz65zOHQxgvCnqCqoX38f1XQL+gsALTRQwwYquIRzOIHH3/HkM/gQbsF1uKbMlKljryfvyDpsS9JgtrVIi0UNgCQwzsYywMS7KVhIdci6oaTDxCSIkACgEbpSGkV/raShwPVe9FCIJn48muB1346LM4aLUBwwcF40DdKAP5r4cETHXBSTEZ/5AdMe25F4a8SNZ8T+t6uikoXCgHE0qaEOxyjuUB0vl43FFPJtSu5I4/s1NSZyxBODBiimV7ic8MqjmPVerDEbZAOjYzgJECgIoODAoxEhDlgohSNvd5ysI9dAqMWgCTpeOUOj5Z0jHuYcTpRtRUdaY9eYakgqqAaXyrceMuNliSv7im0Zk5t8co2vpnw67Ska0jVmNcQSWQ2xrdqhCT9+DwZklwiAOGge4h6Qf0xx1x3caPYmyxO7wFx6bumttW/jq2EziD9E0SAmnCOAIt3XmPtbUfM7XX6wKrJylsyPWSAXEMTqKmpxFkAUHDpGFeoPSI6or7v9WV1kl2JKlUXC+Z8sy0Gpfa2vC4UXAqh6IkEckgwZ8wC9w+wmzfV2NblMkrKVsqHsKYXF31THnov1Xuyx9BaIa/pIMT2afm7y2/RHrp1VF+l5I/OVzNect5z3LISLnNVz2gDtilsDeBS8C+I+Qm+i19omnztzNpWzKfN93teUHaWjhDJl/gTHOEtnxyAICio4ua1y4HRSrZN3Be9yTgvOJsy3bsu840x5Ba9n0EdPwVm6BAiKvyP0hla+rc2Bo2jVLFveWN5kbN3TCWcbThtetTwXmELnC2jvxdaAh0KdUAuV3Ktkr8XWjguj7ywnGW+35RwX/NGA8VzrC2IXxSbxInQ7jnO5sSKvMRWUom8TfW35J5VHGW4K5r9fnCj2diCAXmiFmoFbyL0TZhuyFeYSPYVjw++WNwXsg0ACqa8NXRENQMtAr+FCOOX+a/ZW2BI5hWeiT42SCYXSCRpQXwM20MTFDWuGKmEJC+E9vOTWS4pn2F/V/AxPcSRKqmThNxeK/8myFoANrIQS3sJfHL6geEwBFgUUo7tNs/hFAST+URroIPFbV16s4IIw4Bc/cQsOIQcTn1QS9QsKveIEBUaoQBK3rhi6JAzIb3wJRzCFDDUAKEIYE+tLNc7rS8MxZFkCccAXfPOIuzCDHLVxRkXUbxdQoSdOSlwiZv4FiZsWgB+yll0AAAAASUVORK5CYII="
          transform="translate(36,35.8) scale(16)"
        ></image>
      </g>
      <path
        :stroke="coordinateColor"
        stroke-width="1"
        stroke-linecap="square"
        fill="none"
        d="M60,15l0,461l410,0M60,476l0,4M86,476l0,4M111,476l0,4M137,476l0,4M162,476l0,4M188,476l0,4M214,476l0,4M239,476l0,4M265,476l0,4M290,476l0,4M316,476l0,4M342,476l0,4M367,476l0,4M393,476l0,4M418,476l0,4M444,476l0,4M470,476l0,4M60,476l-4,0M60,450l-4,0M60,425l-4,0M60,399l-4,0M60,373l-4,0M60,348l-4,0M60,322l-4,0M60,297l-4,0M60,271l-4,0M60,245l-4,0M60,220l-4,0M60,194l-4,0M60,169l-4,0M60,143l-4,0M60,117l-4,0M60,92l-4,0M60,66l-4,0M60,41l-4,0M60,15l-4,0"
      />
      <g
        font-family="Nimbus Roman No9 L, Times, serif"
        font-size="10"
        stroke="none"
      >
        <g fill="blue">
          <text x="185" y="482" text-anchor="end">380</text>
          <text x="124.9" y="474.7" text-anchor="end">460</text>
          <text x="115.9" y="456" text-anchor="end">470</text>
          <text x="95.5" y="418" text-anchor="end">480</text>
          <text x="80" y="340" text-anchor="end">490</text>
          <text x="52.2" y="207.1" text-anchor="end">500</text>
          <text x="95.9" y="37.1" text-anchor="middle">520</text>
          <text x="185" y="80.1" text-anchor="start">540</text>
          <text x="259.4" y="147.5" text-anchor="start">560</text>
          <text x="330.9" y="218.2" text-anchor="start">580</text>
          <text x="389.5" y="276.6" text-anchor="start">600</text>
          <text x="422.5" y="309.4" text-anchor="start">620</text>
          <text x="442" y="342" text-anchor="start">700</text>
        </g>
        <g :fill="coordinateTextColor">
          <g text-anchor="middle" id="testAddSvg">
            <!-- 差值 51.2 -->
            <text x="264.8" y="515.8" font-style="italic">x</text>
            <text x="60" y="495.8">0.0</text>
            <text x="111.2" y="495.8">0.1</text>
            <text x="162.4" y="495.8">0.2</text>
            <text x="213.6" y="495.8">0.3</text>
            <text x="264.8" y="495.8">0.4</text>
            <text x="316" y="495.8">0.5</text>
            <text x="367.2" y="495.8">0.6</text>
            <text x="418.4" y="495.8">0.7</text>
            <text x="469.6" y="495.8">0.8</text>
            <!-- <circle cx="50" cy="50" r="40" :stroke="coordinateColor" stroke-width="3" fill="red" /> -->
          </g>
          <g text-anchor="end">
            <!-- 差值 51.2 -->
            <text x="20" y="251.4" font-style="italic">y</text>
            <text x="52" y="481.8">0.0</text>
            <text x="52" y="430.6">0.1</text>
            <text x="52" y="379.4">0.2</text>
            <text x="52" y="328.2">0.3</text>
            <text x="52" y="277">0.4</text>
            <text x="52" y="225.8">0.5</text>
            <text x="52" y="174.6">0.6</text>
            <text x="52" y="123.4">0.7</text>
            <text x="52" y="72.2">0.8</text>
            <text x="52" y="21">0.9</text>
          </g>
        </g>
      </g>
    </svg>
    <div id="current-coordinate" v-show="tip">
      {{ tip }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { CopyDocument } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { trim } from "lodash";
import { onMounted, reactive, ref } from "vue";
import useClipboard from "vue-clipboard3";
const { toClipboard } = useClipboard();
// const pasteData = ref("");
const result = ref<any[]>([]);
const xVal = ref(0.4);
const yVal = ref(0.4);

const tip = ref("");
const params = ref<{ x: number; y: number }[]>([]);
const tipDom = reactive<any>({
  left: "100px",
  top: "200px",
});
const zoom = ref(1);
const coordinateColor = "grey"
const coordinateTextColor = "grey"
const handleResize = () => {
  // // 高度计算zoom
  // let percentage,
  //   //设置默认屏幕大小
  //   appWidth = 1000;
  // percentage = ((window.innerWidth - 50) * 100) / appWidth;
  // percentage = Math.floor(percentage) / 100;
  // zoom.value = percentage - 0.05;
  const w = document.documentElement.clientWidth;
  const h = document.documentElement.clientHeight - 100;
  let scaleX,
    scaleY,
    // 设置默认屏幕宽度大小
    appWidth = 1000, 
    // 设置默认屏幕高度大小
    appHeight = 500; 
  scaleX = w / appWidth;
  scaleY = h / appHeight;
  zoom.value = Math.min(scaleX, scaleY);
};
window.onresize = handleResize;
onMounted(() => {
  handleResize();
});
// 开始计算
const caculate = () => {
  ElMessage.closeAll();
  params.value = [];
  result.value = [];
  //   if (pasteData.value) {
  //     let a = pasteData.value.trim().split("\n");
  //     a.forEach((item) => {
  //       console.log(item);
  //       if (!item) {
  //         return;
  //       }
  //       let b = item.split(" ");
  //       params.value.push({
  //         x: b[0],
  //         y: b[1],
  //       });
  //     });
  //     params.value.forEach((item) => {
  //       let n = (item.x - 0.332) / (item.y - 0.1858);
  //       let CCT = -437 * Math.pow(n, 3) + 3601 * Math.pow(n, 2) - 6831 * n + 5517;
  //       // result = `CIE色坐标(${xVal.value},${yVal.value})的CCT值为 ${CCT}`
  //       result.value.push({
  //         x: item.x,
  //         y: item.y,
  //         CCT,
  //       });
  //     });
  //   } else if (xVal.value && yVal.value) {
  //     let n = (xVal.value - 0.332) / (yVal.value - 0.1858);
  //     let CCT = -437 * Math.pow(n, 3) + 3601 * Math.pow(n, 2) - 6831 * n + 5517;
  //     result.value.push({
  //       x: xVal.value,
  //       y: yVal.value,
  //       CCT,
  //     });
  //   } else {
  //     // $message.warning(
  //     //   $t("lang.tips.PleaseFillInTheParametersCorrectly") as string
  //     // );
  //     ElMessage({
  //       type: "warning",
  //       message: "请正确填写参数",
  //     });
  //   }
  if (xVal.value && yVal.value) {
    let n = (xVal.value - 0.332) / (yVal.value - 0.1858);
    let CCT = -437 * Math.pow(n, 3) + 3601 * Math.pow(n, 2) - 6831 * n + 5517;
    if (CCT.toString() === "NaN") {
      return ElMessage({
        type: "info",
        message: "计算出错，请检查参数是否为数字",
        duration: 1500,
      });
    }
    result.value.push({
      x: xVal.value,
      y: yVal.value,
      CCT,
    });
  } else {
    ElMessage({
      type: "info",
      message: "参数不能为空",
      duration: 1500,
    });
  }
};
// 重置参数
const reset = () => {
  xVal.value = 0;
  yVal.value = 0;
  // pasteData.value = "";
  result.value = [];
};

//
const point = () => {
  ElMessage.closeAll();
  // 进行坐标值校验
  if (!xVal.value && !yVal.value) {
    ElMessage({
      type: "warning",
      message: "参数不能为空",
      duration: 1000,
    });
  } else if (xVal.value > 0.8 || yVal.value > 0.9) {
    ElMessage({
      type: "warning",
      message: "当前坐标值超出色度图区间，请检查后重试！",
      duration: 1500,
    });
  }
  // 通过计算取得当前输入坐标值
  const x = (xVal.value / 0.1) * 51.2 + 60;
  // 减去单位间隔  加上初始值  减去圆形半径
  const y = (yVal.value / 0.1) * -51.2 + 481.8 - 3;
  // 获取容器（色度图）
  const svgDom = document.getElementById("testAddSvg") as any;
  // 生成描点
  const polygonDom = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  // 设置描点样式
  polygonDom.setAttribute(
    "style",
    `cx:${x}; cy:${y}; r:3; stroke:${rc(0, 255)}; stroke-width:1; fill:${rc(
      0,
      255
    )};cursor:pointer;`
  );
  // 描点携带参数
  polygonDom.setAttribute("id", `point${x}${y}`);
  polygonDom.setAttribute("data-x", `${xVal.value}`);
  polygonDom.setAttribute("data-y", `${yVal.value}`);
  // 鼠标移入
  polygonDom.onmouseover = (params: any) => {
    // 阻止默认事件
    // params.preventDefault();
    // params.stopPropagation();
    const { clientX, clientY } = params;
    tipDom.left = (clientX + 10) / zoom.value + "px";
    tipDom.top = (clientY + 10) / zoom.value + "px";
    let x = params.currentTarget.dataset.x;
    let y = params.currentTarget.dataset.y;
    tip.value = `${x}, ${y}`;
  };
  // 鼠标移开
  polygonDom.onmouseleave = (params: any) => {
    // params.preventDefault();
    // params.stopPropagation();
    tip.value = "";
  };
  svgDom.appendChild(polygonDom);
};
// random number：返回指定范围内的随机整数
const rn = (min: number, max: number) => {
  const n = Math.floor(Math.random() * (max - min) + min);
  return n;
};
// random color: 返回指定范围内的随机颜色
const rc = (min: number, max: number) => {
  const r = rn(min, max);
  const g = rn(min, max);
  const b = rn(min, max);
  return `rgb(${r},${g},${b})`;
};
// 复制结果
const copyResult = async (index: number) => {
  const copyContent = result.value[index].CCT.toString();
  ElMessage.closeAll();
  try {
    await toClipboard(copyContent);
    ElMessage({
      message: "已将计算结果复制到剪切板!",
      type: "success",
      repeatNum: 0,
    });
  } catch (e) {
    ElMessage({
      message: "复制失败，请稍后再试!",
      type: "error",
      duration: 1500,
    });
    console.error(e);
  }
};
</script>
<style lang="less" scoped>
.params {
  min-width: 550px;
  margin: 0 auto;
  display: flex;
  // flex-direction: column;
  align-items: center;

  span,
  button {
    margin: 0 5px;
  }
}

.operation {
  :deep(button) {
    margin: 5px;
  }

  .copy_icon {
    transition: all 0.5s;
    cursor: pointer;

    &:hover {
    }
  }
}

ul {
  padding: 0;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 5px 0;

  li {
    display: flex;
    align-items: center;
    list-style: none;
    // margin-bottom: 5px;
    transition: all 0.5s;
    padding: 5px;

    .copy-btn {
      cursor: pointer;
      // display: none;
      margin-left: 10px;
      &:hover {
        color: green;
      }
    }

    // &:hover {
    //   .copy-btn {
    //     display: block;
    //   }

    //   background-color:rgb(145, 145, 221);
    //   border-radius: 5px;
    //   color: white;
    // }
  }
}
#current-coordinate {
  position: absolute;
  top: v-bind("tipDom.top");
  left: v-bind("tipDom.left");
  color: var(--el-text-color-regular);
}
</style>
