const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('startUpAPI', {
  sendConfig: (configData) => {
    console.log('startupAPI sending configData: ', configData)
    return new Promise((resolve, reject) => {
      console.log('before invoke startup-config-data', configData);
      ipcRenderer.invoke('startup-config-data', configData)
      .then(() => {console.log('Config data sent successfully');
       resolve();})
      .catch((err) => {
         console.error('Error sending config data:', err);
         reject(err);
       });
    });
  },
  sendToMain: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  sendConfToSub: (subData) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke('startup-config-data', subData)
      .then(() => {console.log('Config data sent successfully');
       resolve();})
      .catch((err) => {
         console.error('Error sending config data:', err);
         reject(err);
       });
    });
  },
  on: (channel, callback) => {
    const allowedChannels = ['mongodb-uri-incorrect-reply', 'connecttomongodb', 'serveron', 'correct-localport','nouseMongodb'];
    if (allowedChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  }
});
