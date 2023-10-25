// @ts-nocheck
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('postAPI', {
  addToMongoDB: async (note) => {
    const data = {title: note.title,content: note.content,straged:'at Mongo DB'};
    await ipcRenderer.removeAllListeners('add-to-mongodb');
    await ipcRenderer.removeAllListeners('add-to-mongodb-reply');
    const newDataPromise = new Promise( (resolve, reject) => {
      ipcRenderer.once('add-to-mongodb-reply',(event,...args)=>{resolve(args);});});
    await ipcRenderer.send('add-to-mongodb', data);
    const newAllThre = await newDataPromise || Promise.resolve(); 
    return await newAllThre;
  },
  removeChannel: async (channel) => {
    await ipcRenderer.removeAllListeners(channel);  
  },
  send: async (channel, ...args) => {
    await ipcRenderer.removeAllListeners(channel);
    await ipcRenderer.send(channel, ...args);
  }, 
  receive: async (channel, func) => { await ipcRenderer.removeAllListeners(channel);
    await ipcRenderer.on(channel, async (event, ...args) => {
      if (args !==undefined && args.length>0){await func(event,...args)}
      if(args !==undefined && args.length===0){await func(event)};
  });} // この部分は、ipcRenderer.on(channel, (event, ...args) => func(...args));と同じだが、
  //最後の部分は、func(event,...args)にした方が一般的。
});
contextBridge.exposeInMainWorld('getAPI', {
  getResearchAPI: async (ol,wm,keywords) => {
    await ipcRenderer.removeAllListeners('get-Research');
    await ipcRenderer.removeAllListeners('get-Research-reply');
    await ipcRenderer.send('get-Research', ol, wm, keywords);
    const data = await new Promise ((resolve, reject) => {
      ipcRenderer.on('get-Research-reply', (event, ...args) => { 
      resolve(args);
    });}); return await data;
  }, 	
});
