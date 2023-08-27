const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const mongoose = require("mongoose");
function getAllThreads(olocalButtonClicked,wmngdbButtonClicked) {
  console.log('ol. wm at getAllThreads in getIPC ', olocalButtonClicked, wmngdbButtonClicked);
  return new Promise((resolve, reject) => {
    ipcMain.removeAllListeners('get-AllThreads');
    import('../mngSchema.mjs').then(module => {
      const Thread = module.Thread;
      ipcMain.once('get-AllThreads', async (event) => {
        try {
          let data = [];
          if (olocalButtonClicked === true) {
            const filePath = await path.join(__dirname, '../localData.json');
            const fileData = await fs.promises.readFile(filePath);
            const localData = await JSON.parse(fileData);
            data = await localData.slice(0, 6);
            console.log('Allthredata-OL at getAllthreads ', data);
          }
          if (wmngdbButtonClicked === true) {
            const mongoData = await Thread.find({}, { _id: 1, title: 1 }).limit(6);
            data = await [...data, ...mongoData];
            const filePath = await path.join(__dirname, '../localData.json');
            const fileData = await fs.promises.readFile(filePath);
            const localData = await JSON.parse(fileData);
            data = await [...data, ...localData.slice(0, 12)];
            console.log('Allthredata-WM at getAllthreads ', data);
          }
          data = await data.filter(thread => thread.id || thread._id).slice(0, 12);
          data = await data.map(thread => {
            const id = thread.id || thread._id;
            const title = thread.title||thread['title:']||'';
            return { id, title };
          });
          console.log('allThreadsData on getIPC ', data);
          event.reply('get-AllThreads-reply', data);
       } catch(err) {
       console.error(err);
       event.reply('get-AllThreads', []);
      }
      resolve();
    });
  });
});};
module.exports = { getAllThreads }