window.addEventListener('DOMContentLoaded', () => {
  const wmngdbButton = document.querySelector('.WMngdb');
  const olocalButton = document.querySelector('.OLocal');
  const mongodbConf = document.getElementById('mongodb-conf');
  const config = document.querySelector('.config');
  const customAlert = document.getElementById('custom-alert');
  customAlert.style.display = 'none'; 
  let wm = false;let ol = false;let mongodbUriValue = '';
  
  wmngdbButton.addEventListener('click', () => { mongodbConf.style.display = 'block';
    config.style.display = 'block'; wmngdbButton.disabled = true; olocalButton.disabled = true;
    wm = true;  if (window.startUpAPI) {
    window.startUpAPI.sendToMain('start-server', {wm,ol,mongodbUriValue});};
  });

  olocalButton.addEventListener('click', () => {config.style.display = 'none';
    wmngdbButton.disabled = true;olocalButton.disabled = true;ol = true;
    window.startUpAPI.sendConfig({ wm,ol,mongodbUriValue});
  });
  
  const confSubmit = document.querySelector('.conf-submit');
  if (confSubmit) {
    confSubmit.addEventListener('submit', async (event) => {
    event.preventDefault();
    mongodbUriValue = document.getElementById('mongodb-uri').value;
    if (window.startUpAPI) {
      window.startUpAPI.sendConfig({wm, ol, mongodbUriValue})        
    };});
  };
});
  
window.startUpAPI.on('mongodb-uri-incorrect', async (event, message) => {
  console.log('mongodb-uri-incorrect event received in mjs');
  const messageBoxOptions={message:'Your MongoDB Atlas URI is incorrect, please click the bellow [OK}-button to set it right first.'};
  const customAlert = document.getElementById('custom-alert');
  const alertMessage = document.getElementById('alert-message');
  const okButton = customAlert.querySelector('button'); 
  alertMessage.textContent = messageBoxOptions.message;
  customAlert.style.display = 'block';
  await new Promise((resolve) => {
    okButton.addEventListener('click', async () => {
      window.startUpAPI.send('mongodb-uri-incorrect-reply'); resolve();      
    });         
});}); 

window.startUpAPI.on('mongodb-uri-empty', async (event, ...args) => {
  const messageBoxOptions={message:'Your MongoDB Atlas URI is empty, please click the below [OK]-buttibn to set it first.'};
  const customAlert = document.getElementById('custom-alert');
  const alertMessage = document.getElementById('alert-message');
  const okButton = customAlert.querySelector('button'); // OKボタンを取得
  alertMessage.textContent = messageBoxOptions.message;
  customAlert.style.display = 'block';
  await new Promise((resolve) => {
    okButton.addEventListener('click', async () => {
      window.startUpAPI.send('mongodb-uri-empty-reply'); resolve();      
    });         
});});

window.startUpAPI.on('nousemongodb', async (event, ...args) => {
  console.log('nousemongodb event received in mjs');
  const messageBoxOptions={message:'MongoDB Atlas is not utilized this time. The bellow [OK]-button-click is to lead you ahead.'};
  const customAlert = document.getElementById('custom-alert');
  const alertMessage = document.getElementById('alert-message');
  const okButton = customAlert.querySelector('button'); // OKボタンを取得
  alertMessage.textContent = messageBoxOptions.message;
  customAlert.style.display = 'block';
  await new Promise((resolve) => {
    okButton.addEventListener('click', async () => {
      window.startUpAPI.send('nousemongodb-reply'); resolve();      
    });         
});});

window.startUpAPI.on('connecttomongodb', async (event, message) => {
  const messageBoxOptions= {message:'Your MongoDB Atlas is connected right. The bellow [OK]-button-click is to lead you ahead.'};
  const customAlert = document.getElementById('custom-alert');
  const alertMessage = document.getElementById('alert-message');
  const okButton = customAlert.querySelector('button'); // OKボタンを取得
  alertMessage.textContent = messageBoxOptions.message;
  customAlert.style.display = 'block';
  await new Promise((resolve) => {
    okButton.addEventListener('click', async () => {
      window.startUpAPI.send('connecttomongodb-reply'); resolve();      
    });         
});});
