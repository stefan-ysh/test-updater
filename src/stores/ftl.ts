import { defineStore, StoreDefinition } from "pinia";
import { ElMessage } from "element-plus";
export const ftlStore: StoreDefinition = defineStore("ftl", {
  state: () => {
    return { stateData: [], storageUsage: 0 };
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  getters: {},
  actions: {
    setData(val) {
      this.stateData = val;
    },
    delRecord(id: string) {
      const idx = this.stateData.findIndex((d: any) => {
        d.id === id;
      });
      if (idx) {
        this.stateData.splice(idx, 1);
        ElMessage.closeAll();
        ElMessage.success("删除成功");
      }
    },
    setStorageUsage(val) {
      this.storageUsage = val;
    },
  },
});
