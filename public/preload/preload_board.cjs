// @ts-nocheck
const { contextBridge, ipcRenderer } = require('electron');
const { v4: uuidv4 } = require('uuid');

function removeMongoButton() {
  const mongoButton = document.querySelector('#submitMongoDB');
  if (mongoButton) {
    mongoButton.remove();
  } else {
    window.alert('mongoButton element not found');
  }
}

function addMongoButton(arg) {
  const form = document.querySelector('.form-section');
  if (form) {
    const mongoButton = document.createElement('button');
    if(arg === 'SendMng'){
      mongoButton.id = 'submitMongoDB';
      mongoButton.type = 'submit';
      mongoButton.textContent = 'Send to MongoDB';
    } else if (arg === 'UseMongo') {
      mongoButton.id = 'to_mongoConfig';
      mongoButton.type = 'button';
      mongoButton.textContent = 'Use MongoDB';
    }  
    mongoButton.disabled = false;
    mongoButton.style.visibility = 'visible';
    console.log(mongoButton);
    form.appendChild(mongoButton);
  } else {
    window.alert('.form-section element not found');
  }
}

function onMongoButtonRemove(callback) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
        callback();
      }
    });
  });
  observer.observe(document.body, { childList: true });
}

function onMongoButtonAdd(callback) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        callback();
      }
    });
  });
  observer.observe(document.body, { childList: true });
}

contextBridge.exposeInMainWorld('boardAPI', {
  removeMongoButton,
  onMongoButtonRemove,
  onMongoButtonAdd,
  addMongoButton,
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
  getData: () => ipcRenderer.invoke('get-DBdata'),
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  receive: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  }
});

