<template>
  <template v-for="task in dynamicTags">
    <div
      class="task-item"
      v-if="task.date === props.curDate"
      :key="task.id"
      :title="task.title"
    >
      <span
        class="task-title"
        :class="{
          'fnished-style': task.status === 'finished',
        }"
      >
        {{ task.title }}
      </span>
      <el-icon
        v-show="task.status !== 'finished'"
        class="task-oper-btn finish-btn"
        title="完成"
        @click.stop="finishTask(task)"
      >
        <Check />
      </el-icon>
      <el-icon
        class="task-oper-btn task-oper-btn"
        title="删除"
        @click.stop="delTask(task)"
      >
        <Delete />
      </el-icon>
    </div>
  </template>

  <el-input
    v-if="inputVisible"
    ref="InputRef"
    v-model="inputValue"
    class="ml-1 w-20"
    size="small"
    @keyup.enter="addTask"
    @blur="addTask"
  />
  <el-button
    style="position: absolute; right: 0; bottom: 0"
    circle
    class="button-new-tag ml-1"
    size="small"
    plain
    type="primary"
    @click="showInput"
    title="添加日程"
  >
    +
  </el-button>
</template>
<script lang="ts" setup>
import { nextTick, ref, watch } from "vue";
import { ElInput } from "element-plus";
import { nanoid } from "nanoid";
interface TaskItem {
  id: number | string;
  title: string;
  date: string | "";
}

const taskList: { [key: string]: TaskItem[] }[] = JSON.parse(
  localStorage.getItem("taskList") || "[]"
);

const props = defineProps({
  curDate: String,
  data: Object,
});

const inputValue = ref("");
const dynamicTags = ref<any>(taskList);
const inputVisible = ref(false);
const InputRef = ref<InstanceType<typeof ElInput>>();

const finishTask = (tag: TaskItem) => {
  const tempVal = JSON.parse(localStorage.getItem("taskList") || "[]");
  const targetIdx = tempVal.findIndex((item: any, idx: number) => {
    return item.id === tag.id;
  });
  tempVal[targetIdx]["status"] = "finished";
  dynamicTags.value = tempVal;
};

const delTask = (tag: TaskItem) => {
  const tempVal = JSON.parse(localStorage.getItem("taskList") || "[]");
  const filteredVal = tempVal.filter((item: any) => item.id !== tag.id);
  dynamicTags.value = filteredVal;
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};

// 确认添加任务
const addTask = () => {
  const val = inputValue.value.trim();
  if (val) {
    const task = {
      id: nanoid(),
      title: val,
      date: props.curDate,
    };
    const tempVal = JSON.parse(localStorage.getItem("taskList") || "[]");
    tempVal.push(task);
    dynamicTags.value = tempVal;
    // if (dynamicTags.value[curDate!]) {
    //   dynamicTags.value[curDate!].push(task);
    // } else {
    //   console.log(curDate);
    //   dynamicTags.value[curDate!] = [task];
    // }
  }

  inputVisible.value = false;
  inputValue.value = "";
};
watch(
  dynamicTags,
  (newVal, oldVal) => {
    localStorage.setItem("taskList", JSON.stringify(newVal));
  },
  { deep: true }
);
// watch(
//   () => props.nowDate,
//   (newVal, oldVal) => {
//     console.log(
//       "%c [ newVal ]-192",
//       "font-size:13px; background:pink; color:#bf2c9f;",
//       newVal
//     );
//   },
//   { immediate: true }
// );
</script>
<style lang="scss" scoped>
.schedule-item {
  margin: 5px;
}
/* 任务项 */
.task-item {
  /* height: 10px; */
  width: 100%;
  position: relative;
  font-size: 12px;
  text-align: left;
  border-radius: 5px;
  margin-top: 5px;
  padding-left: 10px;
  display: flex;
  align-items: center;
  transition: all 0.5s;
  user-select: none;
  position: relative;
  /* 标题 */
  .task-title {
    color: var(--el-menu-active-color)!important;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: all .5s;
  }
  .fnished-style {
    text-decoration: line-through;
    opacity: 0.5;
  }
  /* 删除按钮 */
  .task-oper-btn {
    display: none;
    margin-left: 5px;
    z-index: 99999;
    color: red;
  }
  .finish-btn {
    color: green;
  }
  .del-btn {
    color: red;
  }

  /* hover 背景色 */
  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 100%;
    top: 50%;
    bottom: 50%;
    border-radius: 5px;
    background: #78bee6;
    transition: all 0.5s;
  }
  &:hover {
    color: black;
    // font-weight: 900;
    /* 背景色从左至右显示 */
    &::after {
      right: 0;
      top: 0;
      bottom: 0;
      opacity: 0.5;
    }
    /* 隐藏前面小圆点 */
    &::before {
      visibility: hidden;
    }
    /* 显示删除按钮 */
    .task-oper-btn {
      display: inline-block;
    }
  }
  /* 前方小圆点 */
  &::before {
    content: "";
    width: 5px;
    height: 5px;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 50%;
    background: #78bee6;
  }
}
</style>
