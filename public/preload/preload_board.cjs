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
    };
    console.log('before add-to-localdb event ', data);
    return await ipcRenderer.invoke('add-to-localdb', data);
  },
  addToMongoDB: async (note) => {
    const data = {
      title: note.title, 
      content: note.content,
      straged:'at Mongo DB',
    };
    console.log('data before add-to-mongo event ', data);
    return await ipcRenderer.invoke('add-to-mongodb', data);
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
  },
  reloadAllData: async () => {
    await ipcRenderer.removeAllListeners('reload-allData');
    //await ipcRenderer.send('reload-allData');
    console.log('before reload-allData is on');
    const data = await new Promise( (resolve, reject) => {
      ipcRenderer.on('reload-allData', (event, ...args) => { 
        resolve(args);
      });}); console.log('data from reloadAllData: ', data) ;return data;
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
