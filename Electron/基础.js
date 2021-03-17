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

