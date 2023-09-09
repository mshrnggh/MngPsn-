// @ts-nocheck
let olBClicked = false;
let wmBClicked = false;
document.addEventListener('DOMContentLoaded', async () => {
  await window.postAPI.send('get-DBdata');
  await window.postAPI.receive('get-DBdata', async (data) => {
    olBClicked = data.a;
    wmBClicked = data.b;
    if (olBClicked === true) { await removeMongoButton(); await addMongoButton('UseMongo');} 
    const useMongo = document.getElementById('to_mongoConfig');
    if (useMongo!==null){
        await useMongo.addEventListener('click', async () => {
          await window.postAPI.send('useMongoDB');
        }); 
    }
  });
});

async function removeMongoButton() {
  const mongoButton = document.querySelector('#submitMongoDB');
  if (mongoButton) {
    await mongoButton.remove();
  } else {
    await window.alert('mongoButton element not found');
  }
}

async function addMongoButton(arg) {
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
    await form.appendChild(mongoButton);
  } else {
    await window.alert('.form-section element not found');
  }
}

async function onMongoButtonRemove(callback) {
  const observer = await new MutationObserver(async (mutations) => {
    await mutations.forEach(async (mutation) => {
      if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
        await callback();
      }
    });
  });
  await observer.observe(document.body, { childList: true });
}

async function onMongoButtonAdd(callback) {
  const observer = await new MutationObserver(async (mutations) => {
    await mutations.forEach(async (mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        await callback();
      }
    });
  });
  await observer.observe(document.body, { childList: true });
}