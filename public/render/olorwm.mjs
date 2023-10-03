// @ts-nocheck
import { createBoardList, createBoardColumns } from "./get.mjs";

let ol = false; let wm = false;let data=[];
document.addEventListener('DOMContentLoaded', async () => {
  await window.postAPI.removeChannel('get-DBdata');
  await window.postAPI.send('get-DBdata');
  await window.postAPI.receive('get-DBdata',async(...args)=>{[data,ol,wm]=args;
    if (ol === true) {await removeMongoButton();await addMongoButton('UseMongo');} 
    const useMongo = document.getElementById('to_mongoConfig');
    if (useMongo!==null){
        await useMongo.addEventListener('click', async () => {
          await window.postAPI.send('useMongoDB');}); 
    };
    if (typeof data === "json") {data = JSON.parse(data);}
    else {data = JSON.parse(JSON.stringify(data));};
    const allThreList = await createBoardList(data);
    const allThreads = allThreList instanceof NodeList?allThreList:allThreList.querySelectorAll('.singleThread');
    await createBoardColumns(allThreads);});
});

async function removeMongoButton() {
  const mongoButton = document.querySelector('#submitMongoDB');
  if (mongoButton) {await mongoButton.remove();
  } else {await window.alert('mongoButton element not found');}
}
async function addMongoButton(arg) {
  const form = document.querySelector('.form-section');
  if (form) {
    const mongoButton = document.createElement('button');
    if(arg === 'SendMng'){mongoButton.id = 'submitMongoDB';
      mongoButton.type = 'submit'; mongoButton.textContent = 'Send to MongoDB';
    } else if (arg === 'UseMongo') {mongoButton.id = 'to_mongoConfig';
      mongoButton.type = 'button';mongoButton.textContent = 'Use MongoDB';
    }  
    mongoButton.disabled = false; mongoButton.style.visibility = 'visible';
    await form.appendChild(mongoButton);
  } else { await window.alert('.form-section element not found');}
}