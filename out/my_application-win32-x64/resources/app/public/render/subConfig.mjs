window.addEventListener('DOMContentLoaded', () => {
  const customAlert = document.getElementById('custom-alert');
  customAlert.style.display = 'none'; 
  let wm = false;let ol = false;let mongodbUriValue = '';
      
  const confSubmit = document.querySelector('.conf-submit');
  if (confSubmit) {
    confSubmit.addEventListener('submit', async (event) => {
    event.preventDefault(); wm = true; ol = false;
    mongodbUriValue = document.getElementById('mongodb-uri').value;
    if (window.subConfigAPI) { 
      window.subConfigAPI.sendConfig({wm, ol, mongodbUriValue})        
  };});};
});
  
window.subConfigAPI.on('mongodb-uri-incorrect', async (event, message) => {
  console.log('mongodb-uri-incorrect event received in mjs');
  const messageBoxOptions={message:'Your MongoDB Atlas URI is incorrect, please click to bellow [OK]-button to set it right first.'};
  const customAlert = document.getElementById('custom-alert');
  const alertMessage = document.getElementById('alert-message');
  const okButton = customAlert.querySelector('button'); 
  alertMessage.textContent = messageBoxOptions.message;
  customAlert.style.display = 'block';
  await new Promise((resolve) => {
    okButton.addEventListener('click', async () => {
      window.subConfigAPI.send('mongodb-uri-incorrect-reply'); resolve();      
    });         
});}); 

window.subConfigAPI.on('mongodb-uri-empty', async (event, ...args) => {
  const messageBoxOptions={message:'Your MongoDB Atlas URI is empty, please click the bellow [OK]-button to set it first.'};
  const customAlert = document.getElementById('custom-alert');
  const alertMessage = document.getElementById('alert-message');
  const okButton = customAlert.querySelector('button'); 
  alertMessage.textContent = messageBoxOptions.message;
  customAlert.style.display = 'block';
  await new Promise((resolve) => {
    okButton.addEventListener('click', async () => {
      window.subConfigAPI.send('mongodb-uri-empty-reply'); resolve();      
    });         
});});

window.subConfigAPI.on('connecttomongodb', async (event, message) => {
  const messageBoxOptions={message:'Your MongoDB Atlas is connected right.'};
  const customAlert = document.getElementById('custom-alert');
  const alertMessage = document.getElementById('alert-message');
  const okButton = customAlert.querySelector('button'); // OKボタンを取得
  alertMessage.textContent = messageBoxOptions.message;
  customAlert.style.display = 'block';
  await new Promise((resolve) => {
    okButton.addEventListener('click', async () => {
      window.subConfigAPI.send('connecttomongodb-reply'); resolve();      
    });         
});});
