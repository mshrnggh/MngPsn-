const { ipcRenderer } = window.electron;
const wmngdbButton = document.querySelector('.WMngdb');
const olocalButton = document.querySelector('.OLocal');
const mongodbConf = document.getElementById('mongodb-uri');
const localConf = document.getElementById('localhost-port');
const config = document.querySelector('.config');
let wmngdbButtonClicked = false;
let olocalButtonClicked = false;
let mongodbUriValue = '';
let localhostPortValue = '';

//MongoDBも使う場合
wmngdbButton.addEventListener('click', () => {
  mongodbConf.style.display = 'block';
  localConf.style.display = 'block';
  config.style.display = 'block';
  wmngdbButton.disabled = true;
  olocalButton.disabled = true;
  wmngdbButtonClicked = true;
  mongodbUriValue = document.getElementById('mongodb-uri').value;
  localhostPortValue = document.getElementById('localhost-port').value;
  ipcRenderer.send('start-server', {
    wmngdbButtonClicked,
    olocalButtonClicked,
    mongodbUriValue,
    localhostPortValue
  });
});

//ローカルサーバーのみの場合
olocalButton.addEventListener('click', () => {
  mongodbConf.style.display = 'none';
  localConf.style.display = 'block';
  config.style.display = 'block';
  wmngdbButton.disabled = true;
  olocalButton.disabled = true;
  olocalButtonClicked = true;
  localhostPortValue = document.getElementById('localhost-port').value;
  console.log(mongodbUriValue, localhostPortValue, wmngdbButtonClicked, olocalButtonClicked);
    ipcRenderer.send('start-server', {
    wmngdbButtonClicked,
    olocalButtonClicked,
    mongodbUriValue,
    localhostPortValue
  });
});

window.addEventListener('DOMContentLoaded', () => {
  const confSubmit = document.querySelector('.conf-submit');
  confSubmit.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log("Debug for Startuphtmlmjs: ", wmngdbButtonClicked, olocalButtonClicked, mongodbUriValue, localhostPortValue);
    window.myAPI.sendConfig({
      wmngdbButtonClicked,
      olocalButtonClicked,
      mongodbUriValue,
      localhostPortValue
    }).then(() => {
      console.log('Config data sent successfully');
    }).catch((error) => {
      console.error('Error sending config data:', error);
    });
  });
});
