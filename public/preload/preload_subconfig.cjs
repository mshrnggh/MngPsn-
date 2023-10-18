const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('subConfigAPI', {
  sendConfig: (configData) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.removeAllListeners('sub-config-data');
      ipcRenderer.send('sub-config-data', configData)
     });
     //ipcrendere.sendは、Promiseオブジェクトを返さないので、.then.catchできないので、
     //resolve, rejectを使う場合に、別の方法が要るが、今回送信の失敗はなさそうなので
     //resolve, rejectは使わない。
  },
  send: async (channel, ...args) => {
    await ipcRenderer.removeAllListeners(channel);
    await ipcRenderer.send(channel, ...args);
    console.log(`${channel} is sent with data`, args);
  },
  on: async (channel, callback) => {
    const allowedChannels = ['mongodb-uri-incorrect','mongodb-uri-empty','connecttomongodb'];
    if (allowedChannels.includes(channel)) {
      await ipcRenderer.removeAllListeners(channel);
      await ipcRenderer.on(channel, (event, ...args) => {callback(...args);});
  };}
});
