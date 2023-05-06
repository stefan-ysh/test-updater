<template>
  <el-container
    class="chat-gpt-session-list"
    :style="{
      'pointer-events': chat.isLoading ? 'none' : 'auto',
      opacity: chat.isLoading ? 0.5 : 1,
    }"
  >
    <div style="display: flex; height: 40px">
      <el-button style="height: 100%; flex: 8" @click="() => chat.addChat()">
        + New Chat</el-button
      >
      <el-button
        style="
          height: 100%;
          flex: 2;
          padding: 5px;
          font-size: 20px;
          margin-left: 5px;
        "
        text
        :icon="FolderAdd"
        @click="() => chat.addGroup()"
      />
    </div>

    <el-tree
      v-if="treeData.length"
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
      :data="treeData"
      :draggable="!isEditing && !isToDelete"
      :default-checked-keys="defaultCheckedKeys"
      :default-expand-all="false"
      node-key="id"
      @node-drag-start="handleDragStart"
      highlight-current
      @node-drag-enter="handleDragEnter"
      @node-drag-leave="handleDragLeave"
      @node-drag-over="handleDragOver"
      @node-drag-end="handleDragEnd"
      @node-drop="handleDrop"
      @mouseleave="mouseLeaveNode"
      @node-click="handleClick"
    >
      <template #default="{ node, data }">
        <div class="tree-item-wrap" :title="data.label">
          <span v-show="data.type === 'group'">
            <el-icon v-show="!node.expanded"><Folder /></el-icon>
            <el-icon v-show="node.expanded"><FolderOpened /></el-icon>
          </span>
          <span v-show="data.type === 'chat'">
            <el-icon><ChatLineRound /></el-icon>
          </span>
          <el-input
            class="menu-label"
            :ref="(el) => setItemRef(el, `menu-label-${data.id}`)"
            @mousedown="stopPropagation"
            @dragstart="stopPropagation"
            :disabled="!isEditing || curEditMenuId !== data.id"
            @keyup.enter.stop="handleConfirm($event, node, data)"
            v-model="data.label"
          />
          <div
            style="position: absolute; right: 0px"
            class="node-operation"
            v-if="!isToDelete && !isEditing"
          >
            <el-icon size="15" @click.stop="handleDelete(data)"
              ><Delete
            /></el-icon>
            <el-icon size="15" @click.stop="handleEdit(data)"><Edit /></el-icon>
          </div>
          <div
            style="position: absolute; right: 0px"
            class="node-operation-confirm"
            v-if="
              (isToDelete && curDelMenuId === data.id) ||
              (isEditing && curEditMenuId === data.id)
            "
          >
            <el-icon size="15" @click.stop="handleCancel"><Close /></el-icon>
            <el-icon size="15" @click.stop="handleConfirm($event, node, data)"
              ><Check
            /></el-icon>
          </div>
        </div>
      </template>
    </el-tree>
  </el-container>
</template>

<script lang="ts" setup>
import type Node from "element-plus/es/components/tree/src/model/node";
import type { DragEvents } from "element-plus/es/components/tree/src/model/useDragNode";
import { FolderAdd } from "@element-plus/icons-vue";

import type {
  AllowDropType,
  NodeDropType,
} from "element-plus/es/components/tree/src/tree.type";
import { nextTick, ref } from "vue";
import { ElMessage } from "element-plus";
import { chatStore } from "@/stores";
import { computed } from "@vue/reactivity";
const chat = chatStore();
const defaultCheckedKeys = computed(() => [chat.currentSessionId]);
// 元素引用的集合
const iframeRefs = {};
// 生成元素引用并添加到集合中
const setItemRef = (el, key) => {
  if (el) {
    iframeRefs[key] = el;
  }
};
// 待删除确认标识
const isToDelete = ref(false);
// 待删除的菜单id
const curDelMenuId = ref("");
// 是否处在正编辑的状态的标识
const isEditing = ref(false);
// 正在编辑的菜单id
const curEditMenuId = ref("");

const handleDragStart = (node: Node, ev: DragEvents) => {
  // console.log("drag start", node);
};
const handleDragEnter = (
  draggingNode: Node,
  dropNode: Node,
  ev: DragEvents
) => {
  // console.log("tree drag enter:", dropNode.label);
};
const handleDragLeave = (
  draggingNode: Node,
  dropNode: Node,
  ev: DragEvents
) => {
  // isToDelete.value = false;
  // console.log("tree drag leave:", dropNode.label);
};
const handleDragOver = (draggingNode: Node, dropNode: Node, ev: DragEvents) => {
  // console.log("tree drag over:", dropNode.label);
};
const handleDragEnd = (
  draggingNode: Node,
  dropNode: Node,
  dropType: NodeDropType,
  ev: DragEvents
) => {
  // console.log("tree drag end:", dropNode && dropNode.label, dropType);
};
const handleDrop = (
  draggingNode: Node,
  dropNode: Node,
  dropType: NodeDropType,
  ev: DragEvents
) => {
  chat.sortMenu(treeData.value);
};
const allowDrop = (draggingNode: Node, dropNode: Node, type: AllowDropType) => {
  if (dropNode.data.type === "chat") {
    return type !== "inner";
  } else {
    return true;
  }
};
const allowDrag = (draggingNode: Node) => {
  // return !draggingNode.data.label.includes("Level three 3-1-1");
  return true;
};

// 目录数据
const treeData = computed(() => chat.sessionList);

// 点击节点
const handleClick = (node: any) => {
  // type 为 chat 才更新 store数据
  if (node.type === "chat") {
    chat.setCurSessionId(node.id);
  }
};

// 确认操作
const handleConfirm = (e, node: Node, data) => {
  e.preventDefault();
  if (isToDelete.value) {
    // 删除节点
    isToDelete.value = false;
    // 如果为群组则提示无法删除非空群组
    if (data.type === "group" && data.children.length > 0) {
      ElMessage.closeAll();
      return ElMessage({
        message: "无法删除非空群组，请删除群组内的会话记录后重试",
        type: "warning",
      });
    }
    const parent = node.parent;
    const children = parent.data.children || parent.data;
    const index = children.findIndex((d) => d.id === data.id);
    const id = treeData.value[index - 1].id
    chat.setCurSessionId(id);
    children.splice(index, 1);
  } else {
    // 编辑节点
    isEditing.value = false;
  }

  localStorage.setItem("sessionList", JSON.stringify(treeData.value));
};

// 取消操作
const handleCancel = () => {
  isToDelete.value = false;
  isEditing.value = false;
};
const mouseLeaveNode = () => {
  isToDelete.value = false;
  isEditing.value = false;
  // 重置带删除和编辑想id数据
  curDelMenuId.value = "";
  curEditMenuId.value = "";
};

// 阻止冒泡
const stopPropagation = (e) => {
  e.stopPropagation();
};
// 唤起删除
const handleDelete = (data) => {
  isToDelete.value = true;
  curDelMenuId.value = data.id;
};
const handleEdit = (nodeData) => {
  isEditing.value = true;
  curEditMenuId.value = nodeData.id;
  nextTick(() => {
    iframeRefs[`menu-label-${nodeData.id}`].focus();
  });
};
</script>

<style lang="less">
.chat-gpt-session-list {
  display: flex;
  flex-direction: column !important;
  padding: 5px 0 0 5px;
  /* justify-content: flex-end; */
  height: 100%;
  /* background: #1d1e20; */
  border-right: 1px solid #222224;
  .el-tree {
    .el-tree-node {
      &.is-checked {
        // background: red;
      }
    }
    .el-tree-node__content {
      height: 50px;
      display: flex;
      align-items: center;
      margin-top: 10px;
      border-bottom-left-radius: 5px;
      border-top-left-radius: 5px;
      & > .el-tree-node__expand-icon {
        // padding: 0;
      }
      .tree-item-wrap {
        height: 50px;
        display: flex;
        align-items: center;
        gap: 5px;
        font-weight: 500;
        span {
          height: 50px;
          line-height: 50px;
          .el-icon {
            height: 50px;
            // margin-right: 0;
          }
        }
        .menu-label {
          width: 7em;
          overflow: hidden;
          text-overflow: ellipsis;
          height: 20px;
          line-height: 20px;
        }
        .el-input.is-disabled {
          cursor: pointer;

          .el-input__inner {
            text-overflow: ellipsis;
            cursor: pointer;
            color: var(
              --el-input-text-color,
              var(--el-text-color-regular)
            ) !important;
            -webkit-text-fill-color: var(
              --el-input-text-color,
              var(--el-text-color-regular)
            ) !important;
          }
          .el-input__inner::selection {
            color: #ffffff !important;
            background: #409eff !important;
          }
          .el-input__wrapper {
            background: transparent;
            border: none;
            box-shadow: none;
            padding-left: 0;
          }
        }
        .node-operation {
          display: none;
        }
        .node-operation-confirm {
          display: none;
        }
        .el-icon {
          font-size: 20px;
          margin-right: 5px;
        }
      }
      // hover 时候显示操作按钮
      &:hover {
        .node-operation {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .node-operation-confirm {
          display: flex;
          align-items: center;
          gap: 5px;
        }
      }
    }
  }
}
</style>
