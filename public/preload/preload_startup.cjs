const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('startUpAPI', {
  sendConfig: (configData) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.removeAllListeners('startup-config-data');
      ipcRenderer.send('startup-config-data', configData)
     });//ipcrendere.sendは、Promiseオブジェクトを返さないので、.then.catchできないので注意。
  },
  sendToMain: (channel, data) => {ipcRenderer.send(channel, data);},
  on: async (channel, callback) => {
    const allowedChannels = ['mongodb-uri-incorrect-reply', 'mongodb-uri-incorrect','mongodb-uri-empty','connecttomongodb','nousemongodb'];
    if (allowedChannels.includes(channel)) {
      await ipcRenderer.removeAllListeners(channel);
      await ipcRenderer.on(channel, (event, ...args) => {callback(...args);});
  };},
  send: async (channel, ...args) => {
    await ipcRenderer.removeAllListeners(channel);
    await ipcRenderer.send(channel, ...args);
    console.log(`${channel} is sent with data`, args);
  }, 
  receive: async (channel, func) => { 
    await ipcRenderer.removeAllListeners(channel);
    await ipcRenderer.on(channel, async (event, ...args) => {
      console.log(`${channel} is on with args`, args); await func(...args);
    });
  }
});
