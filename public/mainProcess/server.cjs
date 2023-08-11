const { app } = require("electron");
const fs = require("fs");
const path = require("path");
const url = require('url');
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const appExpr = express();
appExpr.use(express.json());
const mongoose = require("mongoose");
//const startup = require(path.join(__dirname, 'startup.cjs'));
let boardWindow;
let mongodbUriValue="";
let localhostPortValue="";
let wmngdbButtonClicked=false;
let olocalButtonClicked=false;
  
function startServer(mongodbUriValue,localhostPortValue,wmngdbButtonClicked,olocalButtonClicked) { 
  //console.log('1:', mongodbUriValue, localhostPortValue, wmngdbButtonClicked, olocalButtonClicked);
  if (wmngdbButtonClicked === true) {
    //console.log("2: ",mongodbUriValue, localhostPortValue, wmngdbButtonClicked, olocalButtonClicked);
    mongodbUriValue = mongodbUriValue||process.env.MONGO_URI;
    if (mongodbUriValue) {
      //console.log("3: ",mongodbUriValue, localhostPortValue, wmngdbButtonClicked, olocalButtonClicked);
      useMongoDB(mongodbUriValue||process.env.MONGO_URI).then(() => {
      useLocalServer(localhostPortValue||process.env.PORT);
    }).catch((error) => {
      //console.error(error);
    });
    } else {
    //console.log("4: ", mongodbUriValue, localhostPortValue, wmngdbButtonClicked, olocalButtonClicked);
    nouseMngdb();
    useLocalServer(localhostPortValue||process.env.PORT);
    }
  } else {
    //console.log("5: ",mongodbUriValue, localhostPortValue, wmngdbButtonClicked, olocalButtonClicked);
    useLocalServer(localhostPortValue||process.env.PORT);
  }
  createBoard();
};

function useMongoDB(mongodbUriValue, res) { 
  if (mongodbUriValue === process.env.MONGO_URI){
     return new Promise((resolve, reject) => {
       mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
       .then(() => {
         console.log("Connected to MongoDB Atlas");
         const server = appExpr.listen(process.env.PORT, () => {
           console.log(`Server running on port ${process.env.PORT}`);
         });
       }).catch(error => console.error(error));});
    } else if (mongodbUriValue && mongodbUriValue !== process.env.MONGO_URI) {
        return new Promise((resolve, reject) => {
          mongoose.connect(mongodbUriValue, { useNewUrlParser: true, useUnifiedTopology: true })
          .then(() => {
            console.log("Connected to MongoDB Atlas");
            process.env.MONGO_URI = mongodbUriValue;
            const envPath = path.join(__dirname, '.env');
            const envContent = fs.readFileSync(envPath, 'utf-8');
            const newEnvContent = envContent.replace(`MONGO_URI=${process.env.MONGO_URI}`, `MONGO_URI=${mongodbUriValue}`);
            fs.writeFileSync(envPath, newEnvContent);})
            const server = appExpr.listen(process.env.PORT, () => {
              console.log(`Server running on port ${process.env.PORT}`);
            });
          }).catch(error => { console.error(error);
            console.log("MongoDB Atlas URI is incorrect!");
            //res.redirect('/');
          });
        };
    }    

function useLocalServer(localhostPortValue) {
  if (localhostPortValue === process.env.PORT) {
    appExpr.listen(process.env.PORT, () => console.log(`Server started at Port ${process.env.PORT}`));
  } else if (localhostPortValue !== process.env.PORT) {
    appExpr.listen(localhostPortValue, (error) => {
      if (error) {
        console.error(error);
        console.log("利用できるPORT番号を設定してください！");
        } else {
        console.log(`Server started at Port ${localhostPortValue}`);
        process.env.PORT = localhostPortValue;
        const envPath = path.join(__dirname, '.env');
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const newEnvContent = envContent.replace(`PORT=${process.env.PORT}`, `PORT=${localhostPortValue}`);
        fs.writeFileSync(envPath, newEnvContent);
      }
    });
  } else if (!localhostPortValue) {  
    appExpr.listen(process.env.PORT, () => console.log(`Server started at Port ${process.env.PORT}`));
  }
};

function nouseMngdb(){console.log('今回はMongoDBを使いません。');};

function createBoard() {
  const { BrowserWindow,app } = require("electron");
  app.whenReady().then(() => {
  app.commandLine.appendSwitch('disable-gpu');
  app.commandLine.appendSwitch('disable-features', 'RendererCodeIntegrity');
  app.commandLine.appendSwitch('enable-software-rasterizer');
  boardWindow = new BrowserWindow({
    fullscreen: true,
    webPreferences: {
      nodeIntegration: false, // レンダラープロセスでNode.jsのAPIを使えなくする
      contextIsolation: true, // レンダラープロセスのJavaScriptのコンテキストを分離する
      useAngle:false, // Angleを無効にする
      hardwareAcceleratuion:false, // ハードウェアアクセラレーションを無効にする
      worldSafeExecuteJavaScript: true, // レンダラープロセスで実行されるJavaScriptのコンテキストを分離する
      enableRemoteModule: false, // remoteモジュールを無効にする
      preload: path.join(__dirname, 'preload_board.cjs'),
      webSecurity: true, // クロスサイトスクリプティングを防ぐ
      allowRunningInsecureContent: false, // httpsでないコンテンツの実行を許可しない
      contentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-inline' file:; style-src 'self' 'unsafe-inline';"
    },
  });
    boardWindow.loadURL(url.format({
      pathname: path.join(__dirname, '../render/index.html'),
      protocol: 'file:',
      slashes: true
     }));
});
};

module.exports = {startServer, useMongoDB, useLocalServer, nouseMngdb, createBoard};