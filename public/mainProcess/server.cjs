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
let localhostPortValue="";
let wmngdbButtonClicked=false;
let olocalButtonClicked=false;
  
function startServer(mongodbUriValue,localhostPortValue,wmngdbButtonClicked,olocalButtonClicked) { 
  if (wmngdbButtonClicked === true) {
    mongodbUriValue = mongodbUriValue||process.env.MONGO_URI;
    if (mongodbUriValue) {
        useMongoDB(mongodbUriValue||process.env.MONGO_URI).then(() => {
      useLocalServer(localhostPortValue||process.env.PORT);
    }).catch((error) => {
       console.error(error);
    });
    } else {
    nouseMngdb();
    useLocalServer(localhostPortValue||process.env.PORT);
    }
  } else {
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
  const { BrowserWindow, app,ipcMain } = require("electron");
  app.whenReady().then(() => {
   console.log(__dirname, path.join(__dirname, '../public/preload/preload_board.cjs'));
   app.commandLine.appendSwitch('disable-gpu');
   app.commandLine.appendSwitch('disable-features', 'RendererCodeIntegrity');
   app.commandLine.appendSwitch('enable-software-rasterizer');
   boardWindow = new BrowserWindow({
     fullscreen: true,
     webPreferences: {
       nodeIntegration: false, 
       contextIsolation: true,
       useAngle:false,
       hardwareAcceleratuion:false,
       worldSafeExecuteJavaScript: true, 
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
      //slashes: true
   }));
   ipcMain.on('add-note-to-localdb', (event, data) => {
      const filePath = path.join(__dirname, 'thread_data.json');
      const jsonData = JSON.stringify(data, null, 2);
      fs.appendFile(filePath, jsonData, (err) => {
        if (err) throw err;
        console.log('Data saved to local DB');
      });
   });
   ipcMain.on('add-note-to-mongodb', (event, note) => {
      const data = new Note({
      id: note.id,
      storedAt: 'MongoDB',
      title: note.title,
      content: note.content,
      createdAt: new Date(),
      });
      data.save()
      .then(() => console.log('Data saved to MongoDB'))
      .catch((err) => console.error(err));
  });
});
};

module.exports = {startServer};