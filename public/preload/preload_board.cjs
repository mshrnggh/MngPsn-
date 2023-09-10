// @ts-nocheck
const { contextBridge, ipcRenderer } = require('electron');
const { v4: uuidv4 } = require('uuid');
contextBridge.exposeInMainWorld('postAPI', {
  addToLocalDB: async (note) => {
    const data = {
      id: await uuidv4(),
      title: note.title,
      content: note.content,
      straged:'at Local DB',
      createdAt: await new Date(),
    }; return await ipcRenderer.invoke('add-to-localdb', data);
  },
  addToMongoDB: async (note) => {
    const data = {
      title: note.title, 
      content: note.content,
      straged:'at Mongo DB',
    }; return await ipcRenderer.invoke('add-to-mongodb', data);
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
