// @ts-nocheck
document.addEventListener('DOMContentLoaded', async () => {
  let onMongoButtonAdd = null;
  let onMongoButtonRemove = null;
  await window.boardAPI.send('get-DBdata',);
  await window.boardAPI.receive('get-DBdata', (data) => {
    console.log('data ', data);
    const olBClicked = data.olocalButtonClicked;
    const wmBClicked = data.wmngdbButtonClicked;
  
    if (olBClicked === true) {
      removeMongoButton();
      addMongoButton('UseMongo');
    } 

    const useMongo = document.getElementById('to_mongoConfig');
    if (useMongo!==null){
      useMongo.addEventListener('click', () => {
      window.boardAPI.send('useMongoDB');
      }); 
    }
  });
});

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