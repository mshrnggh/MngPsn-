const { ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
let Thread;
import('../mngSchema.mjs').then((module) => { Thread = module.Thread; });
let ol = false
let wm = false;

async function getConfToMJS(a,b){
  return new Promise( (resolve, reject) => {
    ipcMain.removeAllListeners('get-DBdata'); 
    ipcMain.on('get-DBdata', async (event) => {
      const data = {a,b}; 
      event.reply('get-DBdata', data);
      resolve();
});});}
async function registLocal(ol, wm, event, data) {
  try {
    const filePath = path.join(__dirname, '../localData.json');
    const existinLclDB = await fs.promises.readFile(filePath, 'utf-8');
    const existinLclJ = JSON.parse(existinLclDB);
    const newDB = Array.isArray(existinLclJ) ? [...existinLclJ, data] : [data];
    await fs.promises.writeFile(filePath, JSON.stringify(newDB, null, 2));
    const allLclDB = await fs.promises.readFile(filePath, 'utf-8');
    const newAllThre = await postReloadIPC(ol, wm, allLclDB);
    return newAllThre;   
  } catch (error) {
    console.error(error);
  }
};
async function registMongo(ol, wm, event, data) {
  const existingData = await Thread.find({ title: data.title });
    if (existingData.length > 0) {
      console.log('Data already exists in MongoDB');
      return;
    }
    const newMNGData = await new Thread({
      title: data.title,
      content: data.content,
      straged: data.straged,
    });
    await newMNGData.save();
    const allMngDB = await Thread.find({}, { _id: 1, title: 1 }).limit(6);
    console.log('new-data & all-data in MongoDB, ', newMNGData, allMngDB);
    const newAllThre = await postReloadIPC(ol, wm);
    console.log('newAllThre in regiLocal before event.reply ', newAllThre);
    return newAllThre;
};
async function postReloadIPC(ol, wm){
   return new Promise( (resolve, reject) => {
    try {
      let data = [];
      import('../mngSchema.mjs').then( async (module) => {
        const Thread = await module.Thread;
        let allThreads = [];
        try {
          if (ol === true) {
              const filePath = path.join(__dirname, '../localData.json');
              const  fileData = await fs.promises.readFile(filePath);
              const  localData = JSON.parse(fileData);
              data = await localData.slice(0, 12)
              console.log('reloadThre-OL at postIPC ', data);
            } else if (wm === true) {
              const filePath = path.join(__dirname, '../localData.json');
              const fileData = await fs.promises.readFile(filePath);
              const localData = JSON.parse(fileData);
              data = await localData.slice(0, 6)
              const mongoData = await Thread.find({}, { _id: 1, title: 1, straged:1,  }).limit(6);
              data = [...mongoData, ...data];
              data = [...data.slice(0, 12)];
            }      
            data = await data.filter((thread) => thread.id || thread._id).slice(0, 12);
            allThreads = await data.map((thread) => {
              const id = thread.id || thread._id.toString();
              const title = thread.title || thread['title:'] || '';
              return { id, title };
            });
            console.log('filtered allThre in postIPC ', allThreads);
            resolve(allThreads);
          } catch (err) {
            console.error(err);
            resolve([]);            
          } 
        }); 
    } catch (error) { console.error(error); reject(error); }
   });};
module.exports = {getConfToMJS, registLocal, registMongo};