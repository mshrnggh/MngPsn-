const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const express = require('express');
const appExpr = express();
appExpr.use(express.json());
appExpr.use(express.static('public'));
appExpr.use(express.static('public/style'));
appExpr.use(express.static('public/render'));
appExpr.use(express.static('public/mainProcess'));
appExpr.use(express.static('public/preload'));
app.setPath("userData", path.join(__dirname, "data"));
const {startUp, subConfig} = require(path.join(__dirname, './public/mainProcess/startup.cjs'));
const {fork} = require('child_process');
const startupProcess = fork(path.join(__dirname, './public/mainProcess/startup.cjs'));
const serverProcess = fork(path.join(__dirname, './public/mainProcess/server.cjs'));
const postIPCProcess = fork(path.join(__dirname, './public/mainProcess/postIPC.cjs'));
app.disableHardwareAcceleration(); //hardware acceleration無効化before app is ready or app.whenReady()
app.whenReady().then(() => {startUp();});
ipcMain.handle('startup-config-data', async (event, data) => {
  const a = await data.mongodbUriValue||'';
  const b = await data.wmngdbButtonClicked;
  const c = await data.olocalButtonClicked;
  const {getStartupWindow} = await require(path.join(__dirname, './public/mainProcess/startup.cjs'));
  let startupWindow = getStartupWindow();
  // startupWindowが定義されるまで待つ
  await new Promise((resolve) => {if (startupWindow) { resolve();
    } else {app.on('browser-window-created', (event, window) => {console.log('window ', window);
        if (window === startupWindow) {console.log('startupWindow ', startupWindow, 'window ', window);
          resolve();
        }
      });}
  });
  await app.whenReady().then(() => {
    const {startServer} = require(path.join(__dirname, './public/mainProcess/server.cjs'));
    startServer(a,b,c);
  });
  await new Promise((resolve) => {setTimeout(() => {resolve();}, 1000);//1秒待機
  });
  if(startupWindow) {startupWindow.close();startupWindow = null;}return data;
});
ipcMain.on('useMongoDB', async (event) => {
  const {getBoardWindow} = await require(path.join(__dirname, './public/mainProcess/server.cjs'));
  app.whenReady().then(() => {subConfig();});
  let boardWindow = getBoardWindow();
  boardWindow.close();
  boardWindow = null;
  return;
});

ipcMain.handle('sub-config-data', async (event, data) => {
  const a = await data.mongodbUriValue||'';
  const b = await data.wmngdbButtonClicked;
  const c = await data.olocalButtonClicked;
  const {getSubConfigWindow} = await require(path.join(__dirname, './public/mainProcess/startup.cjs'));
  let subConfigWindow = getSubConfigWindow();
  // startupWindowが定義されるまで待つ
  await new Promise((resolve) => {
    if (subConfigWindow) { resolve();
    } else {app.on('browser-window-created', (event, window) => {
        console.log('window ', window);
        if (window === subConfigWindow) {
          console.log('subConfigWindow ', subConfigWindow, 'window ', window);
          resolve();
        }
      });
    }
  });
  if(subConfigWindow) {subConfigWindow.close();subConfigWindow = null;}
  await app.whenReady().then(() => {
    const {startServer} = require(path.join(__dirname, './public/mainProcess/server.cjs'));
    startServer(a,b,c);});return data;
});
app.on('window-all-closed', () => {if (process.platform !== 'darwin') {app.quit();}
});
//以下は、macのみのコード
if (process.platform === 'darwin') {app.on('window-all-closed', () => {app.quit();});
  app.on('activate', () => {if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();}});
}
 