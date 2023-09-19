const {getConfToMJS,registLocal,registMongo}=require('./postIPC.cjs');
const {getAllThreadsIPC}=require('../mainProcess/getIPC.cjs');
const {getResearchIPC}=require('../mainProcess/searchIPC.cjs');
const {ipcMain}=require("electron");const fs=require("fs");const path=require("path");
const url=require('url');const dotenv=require("dotenv");dotenv.config();
const express=require("express");const appExpr=express();appExpr.use(express.json());
const mongoose=require("mongoose");let boardWindow;
let mongodbUriValue="";let wm=false;let ol=false;

async function startServer(mongodbUriValue,wm,ol){ 
  console.log('startServer is called, mngURI, wm, ol ',mongodbUriValue,wm,ol);
  if (wm===true){mongodbUriValue=mongodbUriValue||process.env.MONGO_URI;
    try{useMongoDB(mongodbUriValue);}catch(error){console.error(error);}
  }else if(ol===true){nouseMngdb();}await createBoard(ol,wm);
};
async function useMongoDB(mongodbUriValue,res){ 
  if(mongodbUriValue===process.env.MONGO_URI){return new Promise((resolve,reject)=>{
      mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true,useUnifiedTopology:true})
      .then(()=>{ipcMain.on('connecttomongodb',(event)=>{event.reply("Connected to MongoDB Atlas");});
        const server=appExpr.listen(process.env.PORT,()=>{
          ipcMain.on('serveron',(event)=>{event.reply(`Server running on port ${process.env.PORT}`);});
          resolve(server);
    });}).catch(error=>{reject(error);});});
  }else if(mongodbUriValue&&mongodbUriValue!==process.env.MONGO_URI){
    return new Promise((resolve,reject)=>{
      mongoose.connect(mongodbUriValue,{useNewUrlParser:true,useUnifiedTopology:true})
      .then(async()=>{ipcMain.on('connecttomongodb',async(event)=>{event.reply("Connected to MongoDB Atlas");});
        process.env.MONGO_URI = mongodbUriValue;const envPath=path.join(__dirname,'.env');
        const envContent=await fs.readFileSync(envPath,'utf-8');
        const newEnvContent=await envContent.replace(`MONGO_URI=${process.env.MONGO_URI}`,`MONGO_URI=${mongodbUriValue}`);
        await fs.writeFileSync(envPath, newEnvContent);
        const server=await appExpr.listen(process.env.PORT,()=>{
          ipcMain.on('serveron',async(event)=>{event.reply(`Server running on port ${process.env.PORT}`);});
          resolve(server);
      });}).catch(error=>{reject(error);
        ipcMain.on('mongodb-uri-incorrect',(event)=>{
          event.reply('mongodb-uri-incorrect-reply','MongoDB Atlas URI is incorrect!');
  });});});}
}
function nouseMngdb(){ipcMain.on('nouseMongodb',(event)=>{event.reply('今回はMongoDBを使いません。')});}
async function createBoard(ol,wm) {
  const {BrowserWindow,app}=require("electron");let Thread='';
  await import('../mngSchema.mjs').then(module=>{Thread=module.Thread;});
  await app.commandLine.appendSwitch('disable-gpu');
  await app.commandLine.appendSwitch('disable-features','RendererCodeIntegrity');
  await app.commandLine.appendSwitch('enable-software-rasterizer');
  boardWindow = await new BrowserWindow({
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true, contextIsolation: true,
      worldSafeExecuteJavaScript: true, useAngle:false,
      enableRemoteModule: false, 
      preload: path.join(__dirname, '../preload/preload_board.cjs'),    
      webSecurity: true, allowRunningInsecureContent: false, 
      contentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-inline' file:; style-src 'self' 'unsafe-inline';"
   },});
   boardWindow.loadURL(url.format({pathname: path.join(__dirname, '../render/index.html'),
     protocol:'file:',slashes: true
   }));
  await getConfToMJS(ol,wm); await getAllThreadsIPC(ol,wm);
  
  if (ipcMain.eventNames().includes('add-to-localdb') && ipcMain.listenerCount('add-to-localdb') >= 1) {
    ipcMain.removeAllListeners('add-to-localdb');
    ipcMain.removeAllListeners('add-to-localdb-reply');
    ipcMain.on('add-to-localdb', async (event, data) => { 
      const newData = await registLocal(ol, wm, event, data); 
      const serializedData = JSON.parse(JSON.stringify(newData));
      event.reply('add-to-localdb-reply', serializedData);
    });
  } else {
    ipcMain.on('add-to-localdb', async (event, data) => {
      const newData = await registLocal(ol, wm, event, data);
      const serializedData = JSON.parse(JSON.stringify(newData));
      event.reply('add-to-localdb-reply', serializedData);});
  }; 

  if (ipcMain.eventNames().includes('add-to-mongodb')&&ipcMain.listenerCount('add-to-mongodb')>=1){
    ipcMain.removeAllListeners('add-to-mongodb');
    ipcMain.removeAllListeners('add-to-mongodb-reply');
    ipcMain.on('add-to-mongodb', async (event, data) => { 
      console.log('data1 at add-to-mongodb is called at server.cjs ',data);
      const newData=await registMongo(ol,wm,event,data);
      console.log('newData1 at server.cjs ',newData);
      const serializedData=JSON.parse(JSON.stringify(newData));
      console.log('serializedData1 at server.cjs ', serializedData);
      event.reply('add-to-mongodb-reply', serializedData);});
  } else {
    ipcMain.on('add-to-mongodb', async (event, data) => { 
      console.log('data2 at add-to-mongodb is called at server.cjs ', data);
      const newData = await registMongo(ol, wm, event, data);
      const serializedData = JSON.parse(JSON.stringify(newData));
      console.log('serializedData2 at server.cjs ', serializedData);
      event.reply('add-to-mongodb-reply', serializedData);});
  };
    
  if (ipcMain.eventNames().includes('get-Research') && ipcMain.listenerCount('get-Research') >= 1) {
    ipcMain.removeAllListeners('get-Research');
    ipcMain.removeAllListeners('get-Research');
    ipcMain.on('get-Research', async (event, ol, wm, keywords) => { 
      const newData = await getResearchIPC(ol, wm, keywords); 
      const serializedData = JSON.parse(JSON.stringify(newData));
      event.reply('get-Research-reply', serializedData);
    });
  } else {
    ipcMain.on('get-Research', async (event, ol, wm, keywords) => {
      const newData = await getResearchIPC(ol, wm, keywords);
      const serializedData = JSON.parse(JSON.stringify(newData));
      event.reply('get-Research-reply', serializedData);});
  }; 
  
};
module.exports = {startServer, getBoardWindow: () => boardWindow};