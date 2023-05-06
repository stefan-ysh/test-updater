<template>
  <div
    class="elements-wrap"
    ref="elementRef"
    :style="{ transform: `scale(${zoom})` }"
  >
    <div class="elements">
      <!-- 正常元素 -->
      <span
        class="col table"
        v-for="(item, index) in ELEMENT_LIST.table"
        :key="index"
      >
        <span
          v-for="(oItem, oIndex) in item.elements"
          :key="oIndex"
          :class="`table-ele element ${oItem.group ? oItem.group : ''} ${
            curGroup && oItem.group !== curGroup && !oItem.isEmpty
              ? 'opacity-item'
              : ''
          }`"
          @click="addEle(oItem)"
          @mouseover="seeDetail(oItem)"
          @mouseleave="onMouseout()"
          :style="
            !oItem.small && oItem.isEmpty
              ? 'position:relative;'
              : oItem.small
              ? ''
              : 'visibility: hidden;'
          "
        >
          <!-- 详细信息框 -->
          <span v-if="!oItem.small && oItem.isEmpty" class="ele-detail">
            <!-- 电子运动轨道 -->
            <MercuryOrbit :curEle="curEle" />
            <!-- 计算 -->
            <div class="compute-wrap">
              <div class="formula-wrap">
                <p
                  v-for="(item, index) in formulaList"
                  :key="index"
                  class="formula-item"
                >
                  {{ convertComputeFormula(item) }}
                </p>
                <el-icon
                  title="复制方程式"
                  class="copy-formula-btn pi pi-copy"
                  @click="copyFormula"
                  ><DocumentCopy
                /></el-icon>
              </div>
              <div class="result-wrap">
                <span class="compute-result">{{
                  result ? result.toFixed(3) : ""
                }}</span>
                <div class="compute-oper-area">
                  <el-icon
                    class="result-oper-btn copy-result-btn"
                    v-if="result"
                    @click="copyResult"
                    title="复制计算结果"
                    ><DocumentCopy
                  /></el-icon>
                  <el-icon
                    class="result-oper-btn del-compute-item-btn"
                    v-if="result"
                    @click="popEle"
                    title="撤销"
                    ><CircleClose
                  /></el-icon>
                  <i
                    class="result-oper-btn reset-result-btn pi pi-refresh"
                    v-if="result"
                    @click="resetResult"
                    title="重置计算结果"
                  ></i>
                  <el-icon
                    class="result-oper-btn reset-result-btn"
                    v-if="result"
                    @click="resetResult"
                    title="重置计算结果"
                    ><Refresh
                  /></el-icon>
                </div>
              </div>
            </div>
          </span>
          <span class="number">{{ oItem.number }}</span>
          <span class="name">{{ oItem.small }}</span>
          <span class="molar">{{
            oItem.molar ? oItem.molar.toFixed(3) : oItem.molar
          }}</span>
        </span>
      </span>
      <!-- 镧系元素 -->
      <span class="col lanthanoids">
        <span
          v-for="(item, index) in ELEMENT_LIST.lanthanoids"
          :key="index"
          :class="`lanthanoids-ele element ${item.group ? item.group : ''} ${
            curGroup && item.group !== curGroup ? 'opacity-item' : ''
          }`"
          @click="addEle(item)"
          @mouseover="seeDetail(item)"
          @mouseleave="onMouseout()"
        >
          <span class="number">{{ item.number }}</span>
          <span class="name">{{ item.small }}</span>
          <span class="molar">{{
            item.molar ? item.molar.toFixed(3) : item.molar
          }}</span>
        </span>
      </span>
      <!-- 锕系元素 -->
      <span class="col actinoids">
        <span
          :class="`actinoids-ele element ${item.group ? item.group : ''} ${
            curGroup && item.group !== curGroup ? 'opacity-item' : ''
          }`"
          v-for="(item, index) in ELEMENT_LIST.actinoids"
          :key="index"
          @click="addEle(item)"
          @mouseover="seeDetail(item)"
          @mouseleave="onMouseout()"
        >
          <span class="number">{{ item.number }}</span>
          <span class="name">{{ item.small }}</span>
          <span class="molar">{{
            item.molar ? item.molar.toFixed(3) : item.molar
          }}</span>
        </span>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";
import useClipboard from "vue-clipboard3";
import { ELEMENT_LIST } from "@/constant";
import MercuryOrbit from "./mercury-orbit.vue";
// 元素周期表引用
const elementRef = ref<any>(null);

const { toClipboard } = useClipboard();

// 计算结果
const result = ref(0);
// 缩放
const zoom = ref(1);

// 当前计算的元素列表
const computedEleList: any = ref([]);

const curGroup = ref("");

const curEle: any = ref({});

const seeDetail = (a: any) => {
  curEle.value = a;
  curGroup.value = a.group;
};
const computeScale = () => {
  const w = document.documentElement.clientWidth;
  const h = document.documentElement.clientHeight;
  let scaleX,
    scaleY,
    // 设置默认屏幕宽度大小
    appWidth = 1600, 
    // 设置默认屏幕高度大小
    appHeight = 880; 
  scaleX = w / appWidth;
  scaleY = h / appHeight;
  zoom.value = Math.min(scaleX, scaleY);
};

// 计算屏幕大小以达到自适应的效果
computeScale();

// 监听窗口缩放
window.addEventListener("resize", function () {
  //要执行的动作
  computeScale();
});

// 鼠标移出事件
const onMouseout = () => {
  curGroup.value = "";
  curEle.value = "";
};

interface FormulaItem {
  small: string;
  num: number;
  name: string;
  molar: number;
}
const formulaList = ref<FormulaItem[]>([]);

// 点击元素将其加入到计算式中
const addEle = (item: any) => {
  const { small, name, molar } = item;

  if (molar) {
    computedEleList.value.push(item);
    // 添加元素到算式计算数组
    if (formulaList.value.length === 0) {
      formulaList.value.push({ num: 1, small, name, molar });
    } else {
      for (let i = 0; i < formulaList.value.length; i++) {
        const isExist = formulaList.value.find((t: any) => {
          return t.small === small;
        });
        if (isExist) {
          isExist.num++;
          break;
        } else {
          formulaList.value.push({ num: 1, small, name, molar });
          break;
        }
      }
    }
  }
};

// 转化算式为 2Zn + 5Si 类型
const convertComputeFormula = (item: any) => {
  const isLast = formulaList.value.findIndex((t: any) => {
    return t.small === item.small;
  });

  const formula = `${item.num === 1 ? " " : item.num}${item.small}${
    isLast === formulaList.value.length - 1 ? "" : " + "
  }`;

  return formula;
};

// 重置计算结果/归零,并清空计算公式中元素
const resetResult = () => {
  computedEleList.value = [];
  formulaList.value = [];
};

// 复制方程式
const copyFormula = async () => {
  ElMessage.closeAll();
  let copyContent = "";
  formulaList.value.forEach((element) => {
    copyContent += convertComputeFormula(element);
  });

  try {
    await toClipboard(copyContent);
    ElMessage({
      message: "已将化学方程式复制到剪切板!",
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
};

// 复制结算结果
const copyResult = async () => {
  ElMessage.closeAll();
  try {
    const copyContent = result.value.toFixed(3) + "";
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
    });
    console.error(e);
  }
};

// 删除算式中的元素
const popEle = () => {
  // 将要删除的元素
  const item = computedEleList.value[computedEleList.value.length - 1];

  // 处理元素数量变化
  for (let i = 0; i < formulaList.value.length; i++) {
    const idx = formulaList.value.findIndex((t: any) => {
      return t.small === item.small;
    });
    if (formulaList.value[idx].num > 1) {
      formulaList.value[idx].num--;
      break;
    } else {
      formulaList.value.splice(idx, 1);
      break;
    }
  }

  // 当前列入计算的元素数组中减去当前项
  computedEleList.value.pop();
};

// 监听计算公式
watch(
  formulaList,
  (ele) => {
    result.value = 0;
    ele.forEach((item: any) => {
      result.value += item.num * item.molar;
    });
  },
  //   { deep: true, immediate: true }
  { deep: true }
);
</script>

<style lang="scss" scoped>
.elements-wrap {
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  /* transition: all .1s; */
  .col {
    display: flex;
    user-select: none;
    .element {
      min-width: 70px;
      min-height: 70px;
      width: 70px;
      height: 70px;
      display: flex;
      flex-direction: column;
      text-align: center;
      text-decoration: none;
      transition: all 0.3s ease-in-out;
      padding: 1px;
      cursor: pointer;
      border-radius: 10px;
      margin: 2px;
      // 阴影
      // box-shadow: inset 0 0 3px 0 rgba(156, 140, 228, 0.5);
      // background: -webkit-linear-gradient(top left, #26c6da, #00bcd4);
      color: #fff;

      // font-family: 'Roboto', sans-serif;
      &.Alkali {
        background: -webkit-linear-gradient(top left, #ef5350, #f44336);
      }

      &.Alkaline {
        background: -webkit-linear-gradient(top left, #ff7043, #ff5722);
      }

      &.Metalloid {
        background: -webkit-linear-gradient(top left, #26c6da, #00bcd4);
      }

      &.Nonmetal {
        background: -webkit-linear-gradient(top left, #42a5f5, #2196f3);
      }

      &.Halogen {
        background: -webkit-linear-gradient(top left, #5c6bc0, #3f51b5);
      }

      &.Noble {
        background: -webkit-linear-gradient(top left, #7e57c2, #673ab7);
      }

      &.Lanthanoid {
        // 镧系元素
        background: -webkit-linear-gradient(top left, #7e57c2, #673ab7);
      }

      &.Actinoid {
        // 锕系元素
        background: -webkit-linear-gradient(top left, #ab47bc, #9c27b0);
      }

      &.Poor {
        background: -webkit-linear-gradient(top left, #66bb6a, #4caf50);
      }

      &.Transition {
        background: -webkit-linear-gradient(top left, #ff9800, #fb8c00);
      }
    }

    .opacity-item {
      opacity: 0.25;
    }

    &.lanthanoids,
    &.actinoids {
      margin-top: 5px;
      margin-left: 140px;
    }

    .number {
      text-align: left;
    }

    .name {
      font-size: 130%;
      line-height: 30px;
      text-shadow: 1px 1px 2px rgb(122 13 120);
    }

    .molar {
      font-size: 10px;
    }
  }

  .ele-detail {
    position: absolute;
    width: 730px;
    height: 250px;
    background: #1e2f83;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    top: -30px;
    left: 5px;
    overflow: auto;
    padding: 5px;
    border-radius: 5px 5px 0 0;
    .compute-wrap {
      .formula-wrap {
        display: flex;
        position: relative;
        align-items: center;
        .formula-item {
          margin-left: 5px;
        }
        .copy-formula-btn {
          display: none;
          margin-left: 5px;
        }
        &:hover {
          .copy-formula-btn {
            display: block;
          }
        }
      }
      .result-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        .compute-result {
          margin-right: 10px;
        }
        .compute-oper-area {
          display: flex;
          justify-content: center;
          align-items: center;
          .result-oper-btn {
            cursor: pointer;
          }
          /* .copy-result-btn {
          } */
          .del-compute-item-btn {
            margin: 0 5px;
          }
          /* .reset-result-btn {
          } */
        }
      }
    }
  }
  .operation-area {
    position: absolute;
    bottom: 0;
    .operation-area-btn {
      font-size: 30px;
      color: #d5e3e5;
      font-weight: 900;
      cursor: pointer;
      transition: all 0.3s;
      &:hover,
      &:focus {
        box-shadow: 10px red;
        transform: translateY(-0.25em);
        /* background: red; */
      }
    }
  }
}
</style>
