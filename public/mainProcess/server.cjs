const { ipcMain} = require("electron");
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
function startServer(mongodbUriValue,wmngdbButtonClicked,olocalButtonClicked) { 
  if (wmngdbButtonClicked === true) {
    mongodbUriValue = mongodbUriValue||process.env.MONGO_URI;
    if (mongodbUriValue) {
      useMongoDB(mongodbUriValue||process.env.MONGO_URI).then(() => {
      useLocalServer();
    }).catch((error) => {
       console.error(error);
    });
    } else if(olocalButtonClicked===true){
    nouseMngdb();
    useLocalServer();
    }
  } else {
    useLocalServer();
  }
   createBoard(olocalButtonClicked, wmngdbButtonClicked);
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
function useLocalServer() {}
function nouseMngdb(){ipcMain.on('nouseMongodb', (event)=>{event.reply('今回はMongoDBを使いません。')});}
function createBoard(olocalButtonClicked,wmngdbButtonClicked) {
  const { BrowserWindow, app, ipcMain } = require("electron");
  let Thread;
  import('../mngSchema.mjs').then(module => {
    Thread = module.Thread;
  });
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
   ipcMain.handleOnce('get-DBdata', (event) => {
     const data = {
       olocalButtonClicked: olocalButtonClicked,
       wmngdbButtonClicked: wmngdbButtonClicked
      };
      return data;
    });
   ipcMain.removeAllListeners('add-note-to-localdb');
   ipcMain.on('add-note-to-localdb', (event, data) => {
      const filePath = path.join(__dirname, '../localData.json');
      fs.readFile(filePath, (err, fileData) => {
        if (err) throw err;
        const existingData = JSON.parse(fileData);
        const newData = Array.isArray(existingData) ? [...existingData, data] : [data];
        fs.writeFile(filePath, JSON.stringify(newData, null, 2), (err) => {
          if (err) throw err;
          console.log('Data saved to local DB');
        });
      });
    });
    ipcMain.removeAllListeners('add-note-to-mongodb');
    ipcMain.on('add-note-to-mongodb', (event, data) => {
      const newData = new Thread({
        title: data.title,
        content: data.content,
      });
      newData.save()
      .then(() => console.log('Data saved to MongoDB'))
      .catch((err) => console.error(err));
    });
  };
  module.exports = {startServer, getBoardWindow: () => boardWindow};