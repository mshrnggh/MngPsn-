const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const {fork} = require('child_process');
const startupProcess = fork(path.join(__dirname, './public/mainProcess/startup.cjs'));
const serverProcess = fork(path.join(__dirname, './public/mainProcess/server.cjs'));
const express = require('express');
const appExpr = express();
console.log(__dirname, path.join(__dirname, '../public/preload/preload_board.cjs'));

appExpr.use(express.json());
appExpr.use(express.static('public'));
appExpr.use(express.static('public/style'));
appExpr.use(express.static('public/render'));
appExpr.use(express.static('public/mainProcess'));
appExpr.use(express.static('public/preload'));
app.setPath("userData", path.join(__dirname, "data"));

const {startUp} = require(path.join(__dirname, './public/mainProcess/startup.cjs'));
const {startServer} = require(path.join(__dirname, './public/mainProcess/server.cjs'));
app.disableHardwareAcceleration() //hardware accelerationを無効にするのは、before app is ready
app.whenReady().then(() => {
  startUp();
});
ipcMain.handle('startup-config-data', (event, data) => {
  const a = data.mongodbUriValue;
  const b = data.localhostPortValue;
  const c = data.wmngdbButtonClicked;
  const d = data.olocalButtonClicked;
  startServer(a,b,c,d);
  startupWindow.close();
  startupWindow = null;
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
//以下は、macのみのコード
if (process.platform === 'darwin') {
  app.on('window-all-closed', () => {
    app.quit();
  });
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();}
    });
}
 