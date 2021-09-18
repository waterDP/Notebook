// node的事件循环是基于libuv  chromium是基于message bump
/** 
 * Electron包含三个核心  
 * ! Chromium 用于显示内容
 * ! Node.js 用于本地文件系统和操作系统
 * ! 自定义 APIs 用于使用需要的OS本地函数
 */

/** 
 * todo 主进程与渲染器进程
 * 主进程通过创建BrowserWindow实例来创建网页。每一个Browser实例在其渲染过程中运行网页，
 * 当一个BrowserWindow实例被销毁时，对应的渲染过程也会终止。
 * 主进程管理所有网页及其对应的渲染进程
 * 
 * 渲染进程只能管理相应的网页，一个渲染进程的崩溃不会其他渲染进程
 * 渲染进程通过IPC与主进程通信在网页上执行GUI操作。出于安全和可能的资源泄漏考虑，直接从渲染进程调用与本地GUI有关的API受到限制
 * 
 * 进程之间的通信可以通过Inter-Process Communication(IPC)模块进行：ipcMain和ipcRenderer
 * 
 */

/**
 * 模块
 * electron-windows-interactive-notifications
 * electron-notification-state   检查是否允许发送通知
 * 
 */

// todo 在渲染进程中显示通知

/* ----------index.html------------- */
`<html>
  <head>
    <meta charset="UTF-8">
    <!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'">
    <meta http-equiv="X-Content-Security-Policy" content="default-src 'self'; script-src 'self'">
    <title>Hello World!</title>
  </head>
  <body>
    <h1>Hello World!</h1>
    We are using Node.js <span id="node-version"></span>,
    Chromium <span id="chrome-version"></span>,
    and Electron <span id="electron-version"></span>.
  </body>
</html>`
/* ----------------------------------- */
const {app, BrowserWindow, Notification} = require('electron')

//  todo 创建一个窗体，并添加index.html的内容
function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    // 预加载
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

// 管理窗口的生命周期
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})


// todo 在主进程中显示通知
function showNotification() {
  const notification = {
    title: 'Basic Notification',
    body: 'Notification from the Main process'
  }
  new Notification(notification).show()
}
app.whenReady().then(() => {
  createWindow()
  /**
   * 因为窗口无法在ready事件前创建，你应当在你的应用初始化后仅监听activate事件
   * 通过您现有的whenReady()回调中附上您的事件监听器来完成这个操作
   */
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
}).then(() => {
  // 显示一个通知
  showNotification()
})




// 预加载
// 预加载脚本连接到渲染器时派上用场的地址，预加载脚本在渲染器进程加载之前加载，
// 并有权访问两个渲染器全局（如window和document）和node环境
/* ---------preload.js----------- */
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) {
      element.innerText = text
    }
  }
  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})
/* ------------------------------ */



// todo 将一个项目添加到最近文档
const {app} = require('electron')
app.addRecentDocument('/Users/USERNAME/work.type')

// 清理
app.clearRecentDocuments()

// todo 本地快捷键
// 应用快捷键仅在应用程序被聚焦时触发
const {app, Menu, MenuItem} = require('electron')
const menu = new Menu()
menu.append(new MenuItem({
  label: 'Electron',
  submenu: {
    role: 'help',
    accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Alt+Shift+I',
    click: () => {
      console.log('Electron rocks')
    }
  }
}))
Menu.setApplicationMenu(menu)

// todo 全局快捷键
const {app, globalShortcut} = require('electron')

app.whenReady().then(() => {
  globalShortcut.register('Alt+CommandControl+I', () => {
    console.log('Electron loves global shortcuts')
  })
}).then(createWindow)