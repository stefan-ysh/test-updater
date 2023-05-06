// electron-main/index.ts
import { app, BrowserWindow, ipcMain, screen, globalShortcut } from "electron";
import path from "path";
// 事件处理器
import EventEmitter from "events";
// 窗口参数 目前只有宽高
let winParams: any;

// 加载事件总线 目前用来加载欢迎页
const loadingEvents = new EventEmitter();

// 主窗口
let mainWindow: any;

// 欢迎页窗口
let welcomeWindow: any;
interface WinParams {
  width: number;
  height: number;
}
// 创建主窗口
const createWindow = (params: WinParams) => {
  const { width, height } = params;
  mainWindow = new BrowserWindow({
    webPreferences: {
      // Whether to enable DevTools. If it is set to `false`, can not use
      // `BrowserWindow.webContents.openDevTools()` to open DevTools. Default is `true`.
      devTools: process.env["NODE_ENV"] === "development" ? true : false,
      contextIsolation: false,
      // Whether node integration is enabled.
      nodeIntegration: true,
      // Whether dragging and dropping a file or link onto the page causes a navigation.
      navigateOnDragDrop: true,
      preload: path.join(__dirname, "preload.js"),
    },
    fullscreen: false,
    // 标题栏和边框一并隐藏
    // Specify `false` to create a frameless window. Default is `true`.
    frame: false,
    width: 1000,
    height: 600,
    minHeight: 500,
    minWidth: 800,
    icon: path.join(__dirname, "./public/win_icon.ico"), // 注意，这里的path是一个node模块哦，需要npm安装并且引入使用。最直接的作用就是拼接字符串。
    // Set the initial opacity of the window, between 0.0 (fully transparent) and 1.0
    //  * (fully opaque). This is only implemented on Windows and macOS.
    // opacity: 0.7,
    // background
    // backgroundColor: "red",
    // Whether window should have a shadow.
    hasShadow: true,
    // Whether window is movable
    movable: true,
    // Whether window is resizable
    resizable: true,
    // Whether window is closable
    closable: true,
    // Whether the window should always stay on top of other windows.
    alwaysOnTop: false,
    // fullscreen: true,
    maximizable: true,
  });
  // mainWindow.setAspectRatio(2);
  // 注册快捷键
  // globalShortcut.register("cmd+F5", () => {
  //   app.relaunch();
  //   app.exit();
  // });
  // globalShortcut.register("ctrl+F4", () => {
  //   mainWindow?.reload();
  // });
  // globalShortcut.register("ctrl+F6", () => {
  //   app.exit();
  // });
  // globalShortcut.register("F11", () => {
  //   // 是否全屏
  //   if (mainWindow?.isFullScreen()) {
  //     // mainWindow?.minimize();
  //     mainWindow?.setFullScreen(false);
  //     mainWindow?.setMenuBarVisibility(true);
  //   } else {
  //     mainWindow?.setFullScreen(true);
  //     mainWindow?.setMenuBarVisibility(false);
  //   }
  // });
  // globalShortcut.register("ctrl+F12", () => {
  //   mainWindow?.webContents.openDevTools({ mode: "detach" });
  // });

  if (app.isPackaged) {
    // 打包状态
    mainWindow.loadFile(path.join(__dirname, "../index.html"));
  } else {
    // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
    const url = `http://${process.env["VITE_DEV_SERVER_HOST"]}:${process.env["VITE_DEV_SERVER_PORT"]}`;

    mainWindow.loadURL(url);
  }
  // 打开控制台 ,结合 webperformance 中的 devTools 使用
  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    mainWindow = "";
  });

  mainWindow.on("resize", () => {
    // 向渲染进程发送信息
    mainWindow.webContents.send("resizeEvent");
  });

  //监听窗口最大化、最小化事件 --- 主进程
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('mainWin-max', true)
  })
  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('mainWin-max', false)
  })
};

// 加载欢迎页
const loadingWelcomePage = () => {
  // loading page 加载页窗口
  welcomeWindow = new BrowserWindow({
    frame: false,
    transparent: true,
    width: 300,
    height: 500,
    webPreferences: {
      contextIsolation: false,
      // Whether node integration is enabled.
      nodeIntegration: true,
      devTools: false,
    },
    alwaysOnTop: true,
  });
  if (app.isPackaged) {
    // 打包状态
    welcomeWindow.loadFile(path.join(__dirname, "../loading.html"));
  } else {
    // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
    const url = `http://${process.env["VITE_DEV_SERVER_HOST"]}:${process.env["VITE_DEV_SERVER_PORT"]}/loading.html`;
    welcomeWindow.loadURL(url);
  }

  // 监听加载 loadingEvents finished, 开始加载主页面
  loadingEvents.on("finished", () => {
    welcomeWindow.close();
    createWindow(winParams);
  });

  // todo 暂时以定时器设置，到了 5s 之后结束 loading 页 加载主页面
  setTimeout(() => loadingEvents.emit("finished"), 5000);
};

app.whenReady().then(() => {
  // screen.getPrimaryDisplay() 主窗口Display对象
  const width = screen.getPrimaryDisplay().workAreaSize.width;
  const height = screen.getPrimaryDisplay().workAreaSize.width;
  winParams = {
    width,
    height,
  };

  // 加载欢迎页
  loadingWelcomePage();

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow(winParams);
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// 定义事件，渲染进程中直接使用

// 最小化
ipcMain.on("min", (e) => mainWindow.minimize());

// 最大化
ipcMain.on("max", (e) => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});
// 关闭窗口
ipcMain.on("close", (e) => mainWindow.close());

// 获取可执行文件位置
const ex = process.execPath;

// 开启 开机自启动
ipcMain.on("openAutoStart", () => {
  app.setLoginItemSettings({
    openAtLogin: true,
    // openAsHidden: true,  //macOs

    path: ex,
    args: [],
  });
});

// 关闭 开机自启动
ipcMain.on("closeAutoStart", () => {
  app.setLoginItemSettings({
    openAtLogin: false,
    // openAsHidden: false,  //macOs
    path: ex,
    args: [],
  });
});
