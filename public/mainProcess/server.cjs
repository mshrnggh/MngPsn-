const {getConfToModuleFile, registerToLocalDB, registerToMongoDB} = require('./postIPC.cjs');
const {getAllThreads} = require('../mainProcess/getIPC.cjs');
const {ipcMain} = require("electron");
const fs = require("fs");
const path = require("path");
const url = require('url');
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const appExpr = express();
appExpr.use(express.json());
const mongoose = require("mongoose");
let boardWindow;
let mongodbUriValue="";
let wmngdbButtonClicked=false;
let olocalButtonClicked=false;

async function startServer(mongodbUriValue,wmngdbButtonClicked,olocalButtonClicked) { 
  if (wmngdbButtonClicked === true) {
    mongodbUriValue = mongodbUriValue||process.env.MONGO_URI;
    if (mongodbUriValue) {
      try { await useMongoDB(mongodbUriValue||process.env.MONGO_URI); 
    } catch(error) { console.error(error); }
  } else if (olocalButtonClicked===true){
    nouseMngdb();
    }
  }
   await createBoard(olocalButtonClicked, wmngdbButtonClicked);
};
function useMongoDB(mongodbUriValue, res) { 
  if (mongodbUriValue === process.env.MONGO_URI){
    return new Promise((resolve, reject) => {
      mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        ipcMain.on('connecttomongodb', (event)=> {event.reply("Connected to MongoDB Atlas");});
        const server = appExpr.listen(process.env.PORT, () => {
          ipcMain.on('serveron', (event)=> {event.reply(`Server running on port ${process.env.PORT}`);});
          resolve(server);
        });
      })
      .catch(error => {
        reject(error);
      });
    });
  } else if (mongodbUriValue && mongodbUriValue !== process.env.MONGO_URI) {
    return new Promise((resolve, reject) => {
      mongoose.connect(mongodbUriValue, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        ipcMain.on('connecttomongodb', (event)=> {event.reply("Connected to MongoDB Atlas");});
        process.env.MONGO_URI = mongodbUriValue;
        const envPath = path.join(__dirname, '.env');
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const newEnvContent = envContent.replace(`MONGO_URI=${process.env.MONGO_URI}`, `MONGO_URI=${mongodbUriValue}`);
        fs.writeFileSync(envPath, newEnvContent);
        const server = appExpr.listen(process.env.PORT, () => {
          ipcMain.on('serveron', (event)=> {event.reply(`Server running on port ${process.env.PORT}`);});
          resolve(server);
        });
      })
      .catch(error => {
        reject(error);
        ipcMain.on('mongodb-uri-incorrect', (event) => {
          event.reply('mongodb-uri-incorrect-reply', 'MongoDB Atlas URI is incorrect!');
        });
      });
    });
  }
}
function nouseMngdb(){ipcMain.on('nouseMongodb', (event)=>{event.reply('今回はMongoDBを使いません。')});}
async function createBoard(olocalButtonClicked,wmngdbButtonClicked) {
  const { BrowserWindow, app } = require("electron");
  let Thread;
  await import('../mngSchema.mjs').then(module => {Thread = module.Thread;});
   app.commandLine.appendSwitch('disable-gpu');
   app.commandLine.appendSwitch('disable-features', 'RendererCodeIntegrity');
   app.commandLine.appendSwitch('enable-software-rasterizer');
   boardWindow = new BrowserWindow({
     fullscreen: true,
     webPreferences: {
       nodeIntegration: true, 
       contextIsolation: true,
       worldSafeExecuteJavaScript: true, 
       useAngle:false,
       enableRemoteModule: false, 
       preload: path.join(__dirname, '../preload/preload_board.cjs'),    
       webSecurity: true, 
       allowRunningInsecureContent: false, 
       contentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-inline' file:; style-src 'self' 'unsafe-inline';"
     },
   });
   boardWindow.loadURL(url.format({
      pathname: path.join(__dirname, '../render/index.html'),
      protocol: 'file:',
      slashes: true
   }));
  await getConfToModuleFile(olocalButtonClicked, wmngdbButtonClicked);
  await getAllThreads(olocalButtonClicked, wmngdbButtonClicked);
  await registerToLocalDB(olocalButtonClicked, wmngdbButtonClicked);
  await registerToMongoDB(olocalButtonClicked, wmngdbButtonClicked);  
};
module.exports = {startServer, getBoardWindow: () => boardWindow};