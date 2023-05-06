<template>
  <div class="orbit-wrap">
    <span class="detail" style="text-align: left">
      <span v-if="props.curEle.number"
        >Number：{{ props.curEle.number }}<br
      /></span>
      <span v-if="props.curEle.number"
        >Name：{{ props.curEle.small }}<br
      /></span>
      <span v-if="props.curEle.number"
        >Molar：{{ props.curEle.molar }}<br
      /></span>
      <span v-if="props.curEle.group"
        >Group：{{ props.curEle.group }}<br
      /></span>
    </span>
    <div class="solarsys" v-if="props.curEle.electrons">
      <!--中心电子数量-->
      <div class="sun">
        +
        {{
          props.curEle.electrons.reduce(function (a, b) {
            return a + b;
          }, 0)
        }}
      </div>
      <span v-for="(item, index) in props.curEle.electrons" :key="index">
        <!--电子轨道-->
        <div
          class="mercuryOrbit"
          :style="`
          margin-top: ${50 - (index + 1) * 25}px;
          margin-left: ${50 - (index + 1) * 25}px;
          height: ${(index + 1) * 50}px;
          width: ${(index + 1) * 50}px;
          left: ${(index + 1) * 50};
          top: ${(index + 1) * 50};
          `"
        ></div>
        <span v-for="(oItem, oIndex) in item" :key="oIndex">
          <!--电子-->
          <div
            class="mercury"
            :style="`
            left: ${20 - index * 25}px;
            top: ${45 - index * 0}px;
            transform: rotate(${360 / item + (oIndex * 360) / item}deg);
            transform-origin: ${30 + index * 25}px;`"
          ></div>
        </span>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  curEle: [Object],
});
</script>
<style lang="scss">
.orbit-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  height: 70%;
  .solarsys {
    /* animation: rotate 10s;
    transform-origin: center; */
    // width: 800px;
    // height: 800px;
    /* position: relative; */
    /* margin: 100px auto; */
    // margin: 35px 135px;
    // background-color: #000000;
    transform: scale(0.8);
    padding: 0;
    zoom: 0.8;

    .sun {
      left: 35px;
      top: 35px;
      height: 30px;
      width: 30px;
      line-height: 30px;
      background-color: rgb(248, 107, 35);
      border-radius: 50%;
      box-shadow: 5px 5px 10px rgb(248, 107, 35),
        -5px -5px 10px rgb(248, 107, 35), 5px -5px 10px rgb(248, 107, 35),
        -5px 5px 10px rgb(248, 107, 35);
      position: absolute;
      margin: 0;
    }

    /*水星*/
    .mercury {
      left: 0;
      top: 0;
      height: 10px;
      width: 10px;
      background-color: rgb(166, 138, 56);
      border-radius: 50%;
      position: absolute;
      /* animation: rotate 1.5s infinite linear; */
    }

    /*水星轨道*/
    .mercuryOrbit {
      background-color: transparent;
      border-radius: 50%;
      border-style: dashed;
      border-color: gray;
      position: absolute;
      border-width: 1px;
      margin: 0px;
      padding: 0px;
    }
  }
}
</style>
