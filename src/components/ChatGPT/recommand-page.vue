<template>
  <div class="outer-wrap">
    <h1 class="chatgpt-title">ChatGPT</h1>
    <div class="content-wrap">
      <div class="example-wrap">
        <div class="icon-title">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <h4>example</h4>
        </div>
        <ul class="description-ul example-list">
          <li
            v-for="example in exampleList"
            :key="example"
            @click="clickTheExample(example)"
          >
            {{ example }}
          </li>
        </ul>
      </div>
      <div class="capabilities-wrap">
        <div class="icon-title">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
            ></path>
          </svg>
          <h4>Capabilities</h4>
        </div>
        <ul class="description-ul">
          <li v-for="capability in capabilitiesList" :key="capability">
            {{ capability }}
          </li>
        </ul>
      </div>
      <div class="limitations-wrap">
        <div class="icon-title">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
            ></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <h4>Limitations</h4>
        </div>
        <ul class="description-ul">
          <li v-for="limitation in limitationsList" :key="limitation">
            {{ limitation }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>

// 定义 emit 事件
const emit = defineEmits(["tryTheExample"]);

// 点击示例 prompt, 传递给父组件
const clickTheExample = (example: string) => {
  emit("tryTheExample", example);
};

// 示例 prompt
const exampleList = [
  "Explain quantum computing in simple terms",
  "Got any creative ideas for a 10 year old’s birthday?",
  "How do I make an HTTP request in Javascript?",
];

// 限制
const limitationsList = [
  "May occasionally generate incorrect information",
  "May occasionally produce harmful instructions or biased content",
  "Limited knowledge of world and events after 2021",
];

// 能力
const capabilitiesList = [
  "Remembers what user said earlier in the conversation",
  "Allows user to provide follow-up corrections",
  "Trained to decline inappropriate requests",
];
</script>
<style lang="less" scoped>
.outer-wrap {
  width: 100%;
  height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .chatgpt-title {
    font-size: 3rem;
    text-align: center;
  }
  .content-wrap {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    .example-wrap,
    .limitations-wrap,
    .capabilities-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px;
    }
    .icon-title {
      display: flex;
      flex-direction: column;
      align-items: center;
      svg {
        width: 2rem;
        height: 2rem;
        stroke: var(--el-menu-text-color);
        stroke-width: 1.5;
        fill: none;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      h4 {
        font-size: 1.5rem;
      }
    }
    .description-ul {
      height: 100%;
      list-style: none;
      padding: 0;
      max-width: 25rem;
      display: flex;
      flex-direction: column;
      font-size: 1.1rem;
      li {
        background: var(--el-fill-color-light);
        border-radius: 0.375rem;
        color: var(--el-menu-text-color);
        // height: auto;
        flex-grow: 10;
        margin-top: 10px;
        line-height: 1.5;
        text-align: center;
        padding: 1.3rem;
        // 换行
        white-space: normal;
        font-weight: bold;
      }
      &.example-list {
        li {
          cursor: pointer;
          // 头部添加引号
          &::before {
            content: '"';
          }
          // 尾部添加引号箭头
          &::after {
            content: '"→';
          }
          // 鼠标悬浮更改背景色及字体颜色
          &:hover {
            background: var(--el-menu-text-color);
            color: var(--el-fill-color-light);
            // background: var(--el-menu-hover-bg-color);
            // color: var(--el-menu-active-color) !important;
          }
        }
      }
    }
  }
}

h1,
h4 {
  color: var(--el-menu-text-color);
}

// 媒体查询屏幕宽度
@media screen and (max-width: 768px) {
  .outer-wrap {
    height: 100%;
  }
  .outer-wrap .content-wrap {
    display: block;
  }
  .outer-wrap .content-wrap .description-ul {
    max-width: 100%;
  }
}
</style>
