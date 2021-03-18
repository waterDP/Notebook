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
const {Notification} = require('Electron')

const myNotification = new Notification({
  body: 'Notification from the Renderer process'
})
myNotification.onclick = () => {
  console.log('Notification clicked')
}

// todo 在主进程中显示通知
const {app, BrowserWindow, Notification} = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('index.html')
}

function showNotification() {
  const notification = {
    title: 'Basic Notification',
    body: 'Notification from the Main process'
  }
  new Notification(notification).show()
}
app.whenReady().then(createWindow).then(showNotification)

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


const reg = new RegExp("==title:(.*?)==")
const s = '==title:xnissss==ivdbhuderbgiu r==title:edijnhiw=='
console.log(reg.exec(s))