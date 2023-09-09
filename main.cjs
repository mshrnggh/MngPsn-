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
  const b = await data.wm;
  const c = await data.ol;
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
  if(startupWindow) {startupWindow.close();startupWindow = null;}; return data;
});
ipcMain.on('useMongoDB', async (event) => {
  const {getBoardWindow} = await require(path.join(__dirname, './public/mainProcess/server.cjs'));
  app.whenReady().then( async () => { await subConfig();});
  let boardWindow = await getBoardWindow();
  await boardWindow.close();
  boardWindow = null;
  return;
});

ipcMain.handle('sub-config-data', async (event, data) => {
  const a = data.mongodbUriValue||'';
  const b = data.wm;
  const c = data.ol;
  const {getSubConfigWindow} = await require(path.join(__dirname, './public/mainProcess/startup.cjs'));
  let subConfigWindow = await getSubConfigWindow();
  // startupWindowが定義されるまで待つ
  await new Promise( async (resolve) => {
    if (subConfigWindow) { await resolve();
    } else {app.on('browser-window-created', async (event, window) => {
        console.log('window ', window);
        if (window === subConfigWindow) {
          console.log('subConfigWindow ', subConfigWindow, 'window ', window);
          await resolve();
        }
      });
    }
  });
  if(subConfigWindow) {await subConfigWindow.close(); subConfigWindow = null;}
  await app.whenReady().then( async () => {
    const {startServer} = require(path.join(__dirname, './public/mainProcess/server.cjs'));
    await startServer(a,b,c);}); return data;
});
app.on('window-all-closed', async () => {if (process.platform !== 'darwin') {await app.quit();}
});
//以下は、macのみのコード
if (process.platform === 'darwin') {app.on('window-all-closed', async () => {await app.quit();});
  app.on('activate', async () => {if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow();}});
}
 