const { ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
let Thread;
import('../mngSchema.mjs').then((module) => { Thread = module.Thread; });
const { getAllThreads } = require('./getIPC.cjs');
let olocalButtonClicked = false
let wmngdbButtonClicked = false;

function getConfToModuleFile(a,b){
  return new Promise((resolve, reject) => {
    ipcMain.removeAllListeners('get-DBdata'); 
    ipcMain.once('get-DBdata', (event) => {
      const data = {a,b};
      event.reply('get-DBdata-reply', data);
      resolve();
});});}
async function registerToLocalDB(olocalButtonClicked, wmngdbButtonClicked){
  await ipcMain.removeAllListeners('add-note-to-localdb');
  await ipcMain.once('add-note-to-localdb', async (event, data) => {
    console.log('ConfData received at postIPC ', data);
    try {
      console.log('ol. wm at postIPC ', olocalButtonClicked, wmngdbButtonClicked);
      const existingLocalData = await getAllThreads( olocalButtonClicked, wmngdbButtonClicked);
      console.log('existinglocalData at postIPC ', existingLocalData);
      const newData = Array.isArray(existingLocalData) ? [...existingLocalData, data] : [data];
      const filePath = path.join(__dirname, '../localData.json');
      await fs.promises.writeFile(filePath, JSON.stringify(newData, null, 2), (err) => {
        if (err) {console.error(err); }else{
        console.log('Data saved to local DB ', newData);
        const viapostIPC = 'postreloaded';
        event.reply('reloadAllThreads', viapostIPC);
      };
    });
  }catch (error){console.error(error);};});
}
function registerToMongoDB(olocalButtonClicked, wmngdbButtonClicked){
  ipcMain.removeAllListeners('add-note-to-mongodb');
  ipcMain.once('add-note-to-mongodb', async (event, data) => {
    const olocalButtonClicked = false; const wmngdbButtonClicked = true;
    const existingLocalData= await getAllThreads( olocalButtonClicked, wmngdbButtonClicked);
    console.log('existinglocalData at postIPC ', existingLocalData);
    const newData = new Thread({
    title: data.title,
    content: data.content,
    straged: data.straged,
    });
    newData.save()
    .then(() => {
      console.log('Data saved to MongoDB, ', newData);
      const viapostIPC = 'postreloaded';
      event.reply('reloadAllThreads', viapostIPC);
    }).catch((err) => console.error(err));
  });
}
module.exports = {getConfToModuleFile, registerToLocalDB, registerToMongoDB};