// @ts-nocheck
const { contextBridge, ipcRenderer } = require('electron');
const { v4: uuidv4 } = require('uuid');
contextBridge.exposeInMainWorld('postAPI', {
  addToLocalDB: async (note) => {
    const data = {id: await uuidv4(),title: note.title,content: note.content,straged:'at Local DB',createdAt: await new Date(),}; 
    await ipcRenderer.removeAllListeners('add-to-localdb');
    await ipcRenderer.removeAllListeners('add-to-localdb-reply');
    const newDataPromise = new Promise( (resolve, reject) => {
      ipcRenderer.once('add-to-localdb-reply',(event,...args)=>{resolve(args);});});
    await ipcRenderer.send('add-to-localdb', data);
    const newAllThre = await newDataPromise || Promise.resolve(); 
    return await newAllThre;
  },
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
    console.log(`${channel} is removed`);
  },
  send: async (channel, ...args) => {
    await ipcRenderer.removeAllListeners(channel);
    await ipcRenderer.send(channel, ...args);
    console.log(`${channel} is sent with data`, args);
  }, 
  receive: async (channel, func) => { await ipcRenderer.removeAllListeners(channel);
    await ipcRenderer.on(channel, async (event, ...args) => {
      console.log(`${channel} is on with args`, args); await func(...args);
    });
  }
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
