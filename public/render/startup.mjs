const wmngdbButton = document.querySelector('.WMngdb');
const olocalButton = document.querySelector('.OLocal');
const mongodbConf = document.getElementById('mongodb-conf');
const config = document.querySelector('.config');
let wmngdbButtonClicked = false;
let olocalButtonClicked = false;
let mongodbUriValue = '';

//MongoDBも使う場合
wmngdbButton.addEventListener('click', () => {
  mongodbConf.style.display = 'block';
  config.style.display = 'block';
  wmngdbButton.disabled = true;
  olocalButton.disabled = true;
  wmngdbButtonClicked = true;
  mongodbUriValue = document.getElementById('mongodb-uri').value;
  window.startUpAPI.sendToMain('start-server', {
    wmngdbButtonClicked,
    olocalButtonClicked,
    mongodbUriValue,
  });
});

//ローカルサーバーのみの場合
olocalButton.addEventListener('click', () => {
  config.style.display = 'none';
  wmngdbButton.disabled = true;
  olocalButton.disabled = true;
  olocalButtonClicked = true;
  window.startUpAPI.sendConfig({
    wmngdbButtonClicked,
    olocalButtonClicked,
    mongodbUriValue,
    });
});

window.addEventListener('DOMContentLoaded', () => {
  const confSubmit = document.querySelector('.conf-submit');
  confSubmit.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log(wmngdbButtonClicked, olocalButtonClicked, mongodbUriValue)
    window.startUpAPI.sendConfig({
      wmngdbButtonClicked,
      olocalButtonClicked,
      mongodbUriValue,
    }).then(() => {
      window.alert('Config data sent successfully');
    }).catch((error) => {
      window.alert('Error sending config data:', error);
    });
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