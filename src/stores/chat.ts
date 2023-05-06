import { nanoid } from "nanoid";
import { defineStore, StoreDefinition } from "pinia";

export const chatStore: StoreDefinition = defineStore("chat", {
  state: () => {
    const { chatHistory, sessionList } = getLocalStorage();
    return {
      currentSessionId: "",
      isLoading: false,
      chatHistory,
      sessionList,
    };
  },
  getters: {
    messages() {
      return this.currentSessionId
        ? this.chatHistory[this.currentSessionId]?.records || []
        : [];
    },
  },
  actions: {
    setCurSessionId(id: string) {
      this.currentSessionId = id;
    },
    addRecord(message: any) {
      if (!this.currentSessionId) {
        this.addChat();
      }
      this.chatHistory[this.currentSessionId].records.push(message);
      saveDataToLocalStorage(this.chatHistory, this.sessionList);
    },
    delRecord(id: string) {
      this.chatHistory[this.currentSessionId].records = this.chatHistory[
        this.currentSessionId
      ].records.filter((item) => item.id !== id);
      saveDataToLocalStorage(this.chatHistory, this.sessionList);
    },
    addChat() {
      const id = nanoid();
      this.sessionList.push({
        id,
        type: "chat",
        label: "New Chat",
        children: [],
      });
      this.chatHistory[id] = { records: [] };
      this.setCurSessionId(id);
      saveDataToLocalStorage(this.chatHistory, this.sessionList);
    },
    addGroup() {
      this.sessionList.push({
        id: nanoid(),
        type: "group",
        label: "New Group",
        children: [],
      });
      saveDataToLocalStorage(this.chatHistory, this.sessionList);
    },
    sortMenu(data) {
      this.sessionList = data;
      saveDataToLocalStorage(this.chatHistory, this.sessionList);
    },
    setLoading(isLoading: boolean) {
      this.isLoading = isLoading;
    },
  },
});

function getLocalStorage() {
  return {
    chatHistory: JSON.parse(localStorage.getItem("chatHistory") || "{}"),
    sessionList: JSON.parse(localStorage.getItem("sessionList") || "[]"),
  };
}

function saveDataToLocalStorage(chatHistory, sessionList) {
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  localStorage.setItem("sessionList", JSON.stringify(sessionList));
}