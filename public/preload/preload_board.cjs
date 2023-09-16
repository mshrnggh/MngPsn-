// @ts-nocheck
const { contextBridge, ipcRenderer } = require('electron');
const { v4: uuidv4 } = require('uuid');
contextBridge.exposeInMainWorld('postAPI', {
  addToLocalDB: async (note) => {
    const data = {id: await uuidv4(),title: note.title,content: note.content,straged:'at Local DB',createdAt: await new Date(),}; 
    await ipcRenderer.removeAllListeners('add-to-localdb');
    await ipcRenderer.removeAllListeners('add-to-localdb-reply');
    const newDataPromise = new Promise( (resolve, reject) => {
      ipcRenderer.once('add-to-localdb-reply', (event, ...args) => {
        resolve(args);}); });
    await ipcRenderer.send('add-to-localdb', data);
    const newAllThre = await newDataPromise || Promise.resolve(); 
    return await newAllThre;
  },
  addToMongoDB: async (note) => {
    const data = {title: note.title,content: note.content,straged:'at Mongo DB'};
    await ipcRenderer.removeAllListeners('add-to-mongodb');
    await ipcRenderer.removeAllListeners('add-to-mongodb-reply');
    await ipcRenderer.send('add-to-mongodb', data);
    ipcRenderer.on('add-to-mongodb-reply', async (event, arg) => { return await arg;});
  },
  send: async (channel, data) => {
    await ipcRenderer.removeAllListeners(channel);
    await ipcRenderer.send(channel, data);
    console.log(`${channel} is sent with data`, data);
  },
  receive: async (channel, func) => { 
    await ipcRenderer.removeAllListeners(channel);
    ipcRenderer.once(channel, async (event, ...args) => { 
      console.log(`${channel} is on with args`, args); 
      await func(...args);});
  }
});
contextBridge.exposeInMainWorld('getAPI', {
  AllThreadsAPI: async () => {
    await ipcRenderer.removeAllListeners('get-AllThreads');
    await ipcRenderer.send('get-AllThreads');
    const data = await new Promise ((resolve, reject) => {
      ipcRenderer.once('get-AllThreads', (event, ...args) => { 
      resolve(args);
      });}); return data;
  } 	
});
