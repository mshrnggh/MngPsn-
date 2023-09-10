const { ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
async function getAllThreadsIPC(ol, wm) {
  return new Promise( (resolve, reject) => {
    try {
      ipcMain.removeAllListeners('get-AllThreads');
      import('../mngSchema.mjs').then( async (module) => {
        const Thread = await module.Thread;
        let allThreads = [];
        await ipcMain.once('get-AllThreads', async (event) => {
          try {
            let data = [];
            if (ol === true) {
              const filePath = path.join(__dirname, '../localData.json');
              const fileData = await fs.promises.readFile(filePath);
              const localData = JSON.parse(fileData);
              data = await localData.slice(0, 18);
              console.log('getAllThreIPC-OL: ', data);
            } else if (wm === true) {
              const mongoData = await Thread.find({}, { _id: 1, title: 1 });
              const mongoDataCount = await Thread.countDocuments();
              const mongoDataLimit = Math.min(mongoDataCount, 9);
              mongoData.splice(mongoDataLimit);
              data = [...mongoData, ...data];
              const filePath = path.join(__dirname, '../localData.json');
              const fileData = await fs.promises.readFile(filePath);
              const localData = JSON.parse(fileData);
              const localDataLimit = Math.min(18 - mongoDataLimit, localData.length);
              data = [...data, ...localData.slice(0, localDataLimit)];
              console.log('getAllThreIPC-WM: ', data);
            }
            data = await data.filter((thread) => thread.id || thread._id).slice(0, 18);
            allThreads = await data.map((thread) => {
              const id = thread.id || thread._id.toString();
              const title = thread.title || thread['title:'] || '';
              return { id, title };
            });
            console.log('filtered getAllThreIPC ', allThreads);
            await ipcMain.removeAllListeners('get-AllThreads');
            await event.reply('get-AllThreads', allThreads);
            resolve();
          } catch (err) {
            console.error(err);
            await ipcMain.removeAllListeners('get-AllThreads');
            await event.reply('get-AllThreads', []);
            resolve();
          }
        });
      });
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}
module.exports = { getAllThreadsIPC }