import { defineStore } from "pinia";
type ThemeTypes = "light" | "dark";
export const settingStore = defineStore("settingStore", {
  state: () => {
    return {
      theme: "",
    };
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  getters: {
    // normal usage
    gettersData: (state) => {},
  },
  actions: {
    // init theme
    initTheme() {
      const theme: ThemeTypes = (localStorage.getItem("theme") ||
        "light") as ThemeTypes;
      this.changeTheme(theme);
    },
    // change theme
    changeTheme(theme: ThemeTypes) {
      this.theme = theme;
      (document.querySelector("html") as HTMLElement).className = theme;
      localStorage.setItem("theme", theme);
    },
  },
});
