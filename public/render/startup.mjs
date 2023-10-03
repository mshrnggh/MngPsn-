const wmngdbButton = document.querySelector('.WMngdb');
const olocalButton = document.querySelector('.OLocal');
const mongodbConf = document.getElementById('mongodb-conf');
const config = document.querySelector('.config');
let wm = false;let ol = false;let mongodbUriValue = '';

wmngdbButton.addEventListener('click', () => { mongodbConf.style.display = 'block';
  config.style.display = 'block'; wmngdbButton.disabled = true; olocalButton.disabled = true;
  wm = true; mongodbUriValue = document.getElementById('mongodb-uri').value;
  window.startUpAPI.sendToMain('start-server', {wm,ol,mongodbUriValue});
});

olocalButton.addEventListener('click', () => {config.style.display = 'none';
  wmngdbButton.disabled = true;olocalButton.disabled = true;ol = true;
  window.startUpAPI.sendConfig({ wm,ol,mongodbUriValue});
});

window.addEventListener('DOMContentLoaded', () => {
  const confSubmit = document.querySelector('.conf-submit');
  confSubmit.addEventListener('submit', async (event) => {
    event.preventDefault();
    //try {
      await window.startUpAPI.sendConfig({wm, ol, mongodbUriValue});
    //  window.alert('Config data sent successfully');
    //} catch (error) {
    //  console.error('Error sending config data:', error);//ここをwindow.alert(error)にすると、エラーが出てプログラムがとまってしまう。
    //}
  });
});

// in case MongoDB Atlas URI and/or Local port is/are incorrect
window.startUpAPI.on('mongodb-uri-incorrect-reply', (event, message) => {
  window.alert(message);
});
window.startUpAPI.on('connecttomongodb', (event, message) => {
  window.alert(message);
});
window.startUpAPI.on('serveron', (event, message) => {
  window.alert(message);
});
window.startUpAPI.on('correct-localport', (event, message) => {
  window.alert(message);
});