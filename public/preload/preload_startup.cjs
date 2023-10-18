const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('startUpAPI', {
  sendConfig: (configData) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.removeAllListeners('startup-config-data');
      ipcRenderer.send('startup-config-data', configData);
    }); 
     //ipcrendere.sendは、Promiseオブジェクトを返さないので、.then.catchできないので、
     //resolve, rejectを使う場合に、別の方法が要るが、今回送信の失敗はなさそうなので
     //resolve, rejectは使わない。
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
  } 
});
