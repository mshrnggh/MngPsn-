import { createBoardList, createBoardColumns } from "./get.mjs";
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', async (event) => {
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
  const formSection = document.querySelector('.form-section');
  const modifyButton = document.querySelector('#modify');
  modifyButton.addEventListener('click', (event) => {
   handleClick(event, formSection);});
});
            
async function handleClick(event,formSection) { event.preventDefault(); 
  let data, ol, wm;  
  console.log('formSection1 postmjs',formSection);
  const inputTitle = document.querySelector('#inputTitle');
  const inputContent = document.querySelector('#inputContent');
  let lockedThread;
  while (!lockedThread) {
    lockedThread = document.querySelector('.singleThread.locked');
    await new Promise(resolve => setTimeout(resolve, 100));
  }; console.log('lockedThread ', lockedThread);
  const id = lockedThread.dataset.id;
  const straged = lockedThread.dataset.straged;
  const newTitle = inputTitle.value.trim();
  const newContent = inputContent.value.trim();
  const renewData = { title:newTitle, content:newContent, straged, id };
  if (lockedThread) {
    await window.postAPI.removeChannel('get-DBdata');
    await window.postAPI.send('get-DBdata');
    window.postAPI.receive('get-DBdata',async(...args)=>{[data,ol,wm]=args;
      await window.postAPI.removeChannel('update-DBdata');
      await window.postAPI.send('update-DBdata',renewData,ol,wm);
      await window.postAPI.removeChannel('update-DBdata-reply');
      await window.postAPI.receive('update-DBdata-reply', async (...args) => {
        const newAllData=args[0];
        if (typeof newAllData === "json") {data = JSON.parse(newAllData);}
        else {data = JSON.parse(JSON.stringify(newAllData));}
        const allThreList = await createBoardList(data);
        const allThreads = allThreList instanceof NodeList?allThreList:allThreList.querySelectorAll('.singleThread');
        console.log('formSection2', formSection);
        await flipModify(event,formSection);
        await createBoardColumns(allThreads);      
  });});};
};
    
async function flipModify(event, formSection) {
  console.log('flipModify called event, formSection ', event, formSection);
  if(!event||event.target.nodeName!=='BUTTON') {return;}
  if(!formSection){console.error('formSection not found');return;};
  await flipAnination(event,formSection);
  async function flipAnination (event, formSection) {
    formSection.classList.add('flip');
    console.log('in the middle of flipModify, formSec',formSection)
    await new Promise(resolve => setTimeout(resolve, 350));
    formSection.classList.remove('flip');
    await new Promise(resolve => setTimeout(resolve, 0));
    formSection.classList.remove('show');
    await new Promise(resolve => setTimeout(resolve, 350));
    formSection.classList.add('show');
    const inputTitle = document.querySelector('#inputTitle');
    const inputContent = document.querySelector('#inputContent');
    inputTitle.value = ''; inputContent.value = '';
    event.target.removeEventListener('click', handleClick);
  };
};
    
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


