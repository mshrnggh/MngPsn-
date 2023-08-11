const { contextBridge, ipcRenderer, ipcMain } = require('electron');
contextBridge.exposeInMainWorld('myAPI', {
  sendConfig: (configData) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke('startup-config-data', configData)
      .then((result) => {resolve(result)}).catch((error) => {reject(error)});
      });
   }
});

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel, data) => {
      ipcRenderer.send(channel, data);
    },
    on: (channel, callback) => {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    },
    invoke: (channel, data) => {
      return ipcRenderer.invoke(channel, data);
    }
  }
});
