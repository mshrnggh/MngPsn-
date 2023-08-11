let inputText = "";
let contentText = "";
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('myAPI', {
    onElementsToServer: (callback) => {
    ipcRenderer.on('elements-to-server', (event, elements) => {
      console.log(elements);
      callback(elements);
    });
  },
  connectToDB: async (uri) => {
    try {
      await ipcRenderer.invoke('connect-to-db', uri);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error(error);
    }
  },
  receiveElements: (callback) => {
    ipcRenderer.on('get-elements-reply', (event, arg) => {
      callback(arg);
    });
  }
});
window.addEventListener('DOMContentLoaded', () => {
  const inputTextDOM = document.getElementById("input-text");
  const inputContentDOM = document.getElementById("input-content");
  if (inputTextDOM !== null) {
    inputTextDOM.addEventListener("change", (e) => {
      inputText = e.target.value;
      ipcRenderer.send("input-text", inputText);
    });
  }
  if (inputContentDOM !== null) {
    inputContentDOM.addEventListener("change", (e) => {
      contentText = e.target.value;
      ipcRenderer.send("content-text", contentText);
    });
  }
});
