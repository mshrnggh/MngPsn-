const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('startUpAPI', {
  sendConfig: (configData) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.removeAllListeners('startup-config-data');
      console.log('configData just before sending strtupconfdata event ', configData);
      ipcRenderer.send('startup-config-data', configData)
      .then(() => {console.log('Config data sent successfully');resolve();})
      .catch((err) => {console.error('Error sending config data:', err);reject(err);});
    });
  },
  sendToMain: (channel, data) => {ipcRenderer.send(channel, data);},
  on: (channel, callback) => {
    const allowedChannels = ['mongodb-uri-incorrect-reply', 'connecttomongodb', 'serveron', 'correct-localport','nouseMongodb'];
    if (allowedChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    };},
});
