import { createBoardList, createBoardColumns } from "./get.mjs";

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', event => {
    const thisSingThre = event.target.closest('.singleThread'); 
    if (thisSingThre) {
      console.log('event.target, thisSingThre.querySelector(".thread-title") ', event.target, thisSingThre.querySelector(".thread-title")); 
      const singleThreads = document.querySelectorAll('.singleThread');
      singleThreads.forEach(singleThread => {
        if (thisSingThre === singleThread) {
          if (singleThread.classList.contains('locked')) {
            singleThread.classList.remove('locked'); clearDisplay();
          } else { singleThreads.forEach(otherSingleThread => {
            if (otherSingleThread !== thisSingThre) {
              otherSingleThread.classList.remove('locked'); clearDisplay();
          }});
          if(!singleThread.classList.contains('locked')){
            singleThread.classList.add('locked'); 
            displayContent(singleThread);};};
};});}});

  const modifyButton = document.querySelector('#modify');
  let data, ol, wm;
  modifyButton.addEventListener('click', async (event) => {
    event.preventDefault();
    const inputTitle = document.querySelector('#inputTitle');
    const inputContent = document.querySelector('#inputContent');
    const lockedThread = document.querySelector('.singleThread.locked');
    const id = lockedThread.dataset.id;
    const straged = lockedThread.dataset.straged;
    const newTitle = inputTitle.value;
    const newContent = inputContent.value;
    const renewData = { title:newTitle, content:newContent, straged, id };
    if (lockedThread) {
      await window.postAPI.removeChannel('get-DBdata');
      await window.postAPI.send('get-DBdata');
      window.postAPI.receive('get-DBdata',async(...args)=>{[data,ol,wm]=args;
        await window.postAPI.removeChannel('update-DBdata');
        console.log('renewData before updade ', renewData);
        await window.postAPI.send('update-DBdata',renewData,ol,wm);
        await window.postAPI.removeChannel('update-DBdata-reply');
        await window.postAPI.receive('update-DBdata-reply', async (...args) => {
          console.log('args at update-DBdata-reply ', args);
          const newAllData=args[0];
          console.log('data2 ', newAllData,ol,wm);
          console.log('typeof newAllData ', typeof newAllData);
          if (typeof data === "json") {data = JSON.parse(data);}
          else {data = JSON.parse(JSON.stringify(data));}
          const allThreList = await createBoardList(newAllData);
          const allThreads = allThreList instanceof NodeList?allThreList:allThreList.querySelectorAll('.singleThread');
          await createBoardColumns(allThreads);
        });
});};});});
    
function displayContent(singleThread) {
  console.log('dipslayContent is called!');
  console.log('singleThread ', singleThread);
  if (!singleThread) return;
  const title = singleThread.querySelector('.thread-title').textContent;
  const content = singleThread.dataset.content;
  const inputTitle = document.querySelector('#inputTitle');
  const inputContent = document.querySelector('#inputContent');
  inputTitle.value = title;  inputContent.value = content;
};

function clearDisplay() {
  const inputTitle = document.querySelector('#inputTitle');
  const inputContent = document.querySelector('#inputContent');
  inputTitle.value = ""; inputContent.value = "";
};


