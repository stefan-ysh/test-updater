import { defineStore, StoreDefinition } from "pinia";
const isExpired: () => boolean = () => {
  const covert = Number(new Date()) / 1000;
  const nTime = Math.floor(covert);
  const eTime = import.meta.env.VITE_EXPIRED_TIME; // 2023-01-01
  if (nTime > eTime) {
    return true;
  } else {
    return false;
  }
};
export const permissionStore: StoreDefinition = defineStore("permission", {
  state: () => {
    return { isExpired: false, isFullScreen: false };
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  getters: {},
  actions: {
    setExpiredFlag() {
      this.isExpired = isExpired();
    },
    toggleFullScreen() {
      this.isFullScreen = !this.isFullScreen;
    },
  },
});
