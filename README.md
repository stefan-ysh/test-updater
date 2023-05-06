# eResearch

## 简介

一个逐步完善的科研人员实用小工具合集，旨在促进科技发展，为世界进步尽一点绵薄之力。
## features
### 日程管理
![image](https://user-images.githubusercontent.com/58702199/232374455-8ab19a45-2007-4315-8516-83053609b41c.png)
### chatgpt
![image](https://user-images.githubusercontent.com/58702199/232374395-b15eae7b-84e1-40f5-b4fd-c1205db12004.png)
### 元素周期表
![image](https://user-images.githubusercontent.com/58702199/232374303-76e1fb18-82b0-4310-a30a-1d7e08eb6e50.png)
### ftl
![image](https://user-images.githubusercontent.com/58702199/232374345-65053e9e-8d8d-449d-88f2-4eeef33cc13f.png)
### 色温计算
![image](https://user-images.githubusercontent.com/58702199/232374352-a122d199-5310-431b-880d-255970e8a7a3.png)
### IV 曲线计算
![image](https://user-images.githubusercontent.com/58702199/232374375-f3e1ba7c-f58b-45c2-bdab-3b07c536c78e.png)


## 项目插件

- [Vue3](https://cn.vuejs.org)

- [Vite](https://vitejs.dev)

- [Pinia](https://pinia.vuejs.org)

- [Electron](https://www.electronjs.org)

- [Element Plus](https://element-plus.gitee.io)

- [TypeScript](https://www.typescriptlang.org)

- [vite-plugin-electron](https://github.com/electron-vite/vite-plugin-electron)

<!-- ## 项目地址 -->

<!-- - [https://gitee.com/javanx/todolist](https://gitee.com/javanx/todolist)

- [https://gitee.com/javanx/todolist-server](https://gitee.com/javanx/todolist-server) -->

## 功能开发过程

### 启动加载页面

#### 1. 准备启动加载的静态文件

如根目录的`loading.html`

#### 2. 准备触发/监听事件

```js
// 事件处理器
import EventEmitter from "events";

// 加载事件总线 目前用来加载欢迎页
const loadingEvents = new EventEmitter();

// 监听 finished 事件
loadingEvents.on("finished", () => {});

// 触发 finished 事件
loadingEvents.emit("finished");
```

#### 3. 创建加载欢迎页的方法

在内部设置定时起触发 finished 事件

```js
// 创建欢迎页窗口
const welcomeWindow = new BrowserWindow();

// 加载欢迎页方法
const loadWelcomePage = () => {
  // 加载 loading.html
  welcomeWindow.loadURL("xxx/xxx/xxx/loading.html");

  // 定时起触发 finished 事件
  setTimeout(() => {
    loadingEvents.emit("finished");
  }, 5000);
};
```

#### 4. 初始化后创建 loading 窗口

在`app`准备的生命周期内开始加载`loading.html`

```js
// 或 app.whenReady().then(() => { loadWelcomePage() });
app.on("ready", () => {
  loadWelcomePage();
});
```

#### 5. 监听 finished 事件

监听到定时器内触发的 finished 事件，关闭欢迎页窗口，加载主窗口

```js
// 监听加载 loadingEvents finished, 开始加载主页面
loadingEvents.on("finished", () => {
  // 关闭欢迎页
  welcomeWindow.close();
  // 创建程序主窗口
  createWindow(winParams);
});
```

自定义顶部工具栏的时候，加上这个样式才能进行拖拽移动

```html
<TopHeader style="-webkit-app-region: drag" />
```
