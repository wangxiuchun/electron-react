const { app, BrowserWindow, ipcMain, nativeTheme, dialog } = require('electron')

// 热更新
const reloader = require('electron-reloader');
reloader(module)

const path = require('path')

// 创建一个窗口
const createWindow = ()=>{
  var mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // frame: false,  // 控制是否显示边框 
    // transparent: true, // 创建一个完全透明的窗口
    title: 'ORINGE',
    icon: path.join(__dirname,'./public/icons/icon.png'),  // 窗口小图标
    webPreferences: {
      // 开启渲染进程使用node
      nodeIntegration: true,
      // 开启渲染进程的remote模块
      enableRemoteModule: true,
      // contextIsolation: false,
      preload: path.join(__dirname, './src/assets/js/preload.js') // 使用预加载脚本
    }
  })
  
  // mainWindow.loadFile('./dist/index.html'); // 加载入口文件
  mainWindow.loadURL('http://localhost:3000')
  mainWindow.webContents.openDevTools(); // 打开开发者工具
  mainWindow.on('closed', () => {
    mainWindow = null;
  })
}

// 监听初始化完成生命周期
app.on('ready', () => {
  createWindow();
  require('./src/assets/js/menu')
})
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 给渲染进程发送消息
ipcMain.handle('send-Haha', ()=> '主线程给渲染进程发送一个哈哈：哈哈')

// 点击[新建窗口]，打开一个新的窗口
ipcMain.on('add-window', (e, params)=>{
  createWindow();
})

// 点击[切换主题]，切换主题颜色
ipcMain.on('switch-theme', ()=>{
  const newTheme = nativeTheme.themeSource === 'system'? 'dark' : 'system'
  nativeTheme.themeSource = newTheme;  // 主题颜色
})

// 点击[关于]，弹出对话框
ipcMain.on('about-us', (event, content) => {
  dialog.showMessageBox(null, content[0])
})