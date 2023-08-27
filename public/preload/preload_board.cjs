// @ts-nocheck
const { contextBridge, ipcRenderer } = require('electron');
const { v4: uuidv4 } = require('uuid');

contextBridge.exposeInMainWorld('postAPI', {
  addNoteToLocalDB: (note) => {
    const data = {
      id: uuidv4(),
      title: note.title,
      content: note.content,
      straged:'at Local DB',
      createdAt: new Date(),
    }; 
    ipcRenderer.send('add-note-to-localdb', data);
  },
  addNoteToMongoDB: (note) => {
    const data = {
      title: note.title, 
      content: note.content,
      straged:'at Mongo DB',
    };
    ipcRenderer.send('add-note-to-mongodb', data);
  },
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  receive: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  }
});

contextBridge.exposeInMainWorld('getAPI', {
  requestAllThreadsAPI: async () => {
    const data = await ipcRenderer.send('get-AllThreads');
    return data;
  },
  getAllThreadsAPI: async () => {
    const data = await new Promise((resolve, reject) => {
      ipcRenderer.on('get-AllThreads-reply', (event, ...args) => {
      resolve(args[0]);
      });
    });
    return data;
  }
});
