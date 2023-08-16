const { contextBridge, ipcRenderer } = require('electron');
const { v4: uuidv4 } = require('uuid');

contextBridge.exposeInMainWorld('boardAPI', {
  addNoteToLocalDB: (note) => {
    const data = {
      id: uuidv4(),
      'title:': note.title + ' :straged at Local DB',
      'content:': note.content,
      CreatedAt: new Date(),
    };
    ipcRenderer.send('add-note-to-localdb', data);
  },
  addNoteToMongoDB: (note) => {
    const data = {
      title: note.title + ' :straged at Mongo DB', 
      content: note.content,
    };
    ipcRenderer.send('add-note-to-mongodb', data);
  },
});