let mongodbUriValue = '';
window.addEventListener('DOMContentLoaded', () => {
  const confSubmit = document.querySelector('.conf-submit');
  confSubmit.addEventListener('submit', (event) => {
    event.preventDefault();
    window.subConfigAPI.subConfig({
      wm: true,
      ol: false,
      mongodbUriValue,
    }).then(() => {
      window.alert('sub-config data sent successfully');
    }).catch((error) => {
      window.alert('Error sending sub-config data:', error);
    });
  });
});
// in case MongoDB Atlas URI and/or Local port is/are incorrect
window.subConfigAPI.on('mongodb-uri-incorrect-reply', (event, message) => {
  window.alert(message);
});
window.subConfigAPI.on('connecttomongodb', (event, message) => {
  window.alert(message);
});
window.subConfigAPI.on('serveron', (event, message) => {
  window.alert(message);
});
window.subConfigAPI.on('correct-localport', (event, message) => {
  window.alert(message);
});