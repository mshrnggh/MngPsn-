import { createBoardList, createBoardColumns } from "./get.mjs";
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', async (event) => {
    const thisSingThre = event.target.closest('.singleThread'); 
    if (thisSingThre) {
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
async function handleClick(event, formSection) { event.preventDefault(); 
  let renewData, data, ol, wm, allThreads;  
  const inputTitle = document.querySelector('#inputTitle');
  const inputContent = document.querySelector('#inputContent');
  let lockedThread;
  while (!lockedThread) {lockedThread = document.querySelector('.singleThread.locked');
    await new Promise(resolve => setTimeout(resolve, 100));}; 
  const id = lockedThread.dataset.id;
  const straged = lockedThread.dataset.straged;
  const newTitle = inputTitle.value.trim();
  const newContent = inputContent.value.trim();
  renewData = { title:newTitle, content:newContent, straged, id, createdAt: await new Date() }; 
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i); const value = localStorage.getItem(key);
    if(renewData.id===JSON.parse(value).id){localStorage.setItem(key, JSON.stringify(renewData));
    break;};
  };
  if (lockedThread) {
    await window.postAPI.removeChannel('get-DBdata');
    await window.postAPI.send('get-DBdata');
    await window.postAPI.receive('get-DBdata',async(event, ...args)=> { [data,ol,wm]=args;
      await window.postAPI.removeChannel('update-DBdata');
      await window.postAPI.send('update-DBdata',renewData,ol,wm);
      await window.postAPI.removeChannel('update-DBdata-reply');
      await window.postAPI.receive('update-DBdata-reply', async (event, ...args) => {
        const newAllData=args[0];
        if (typeof newAllData === "json") {data = JSON.parse(newAllData);}
        else {data = JSON.parse(JSON.stringify(newAllData));}; 
        const allThreList = await createBoardList(data);
        allThreads = allThreList instanceof NodeList?allThreList:allThreList.querySelectorAll('.singleThread');
        await createBoardColumns(allThreads);
      });}); 
      await flipModify(event,formSection);     
};};
async function flipModify(event, formSection) { 
  if(!event||event.target.nodeName!=='BUTTON') {return;}
  if(!formSection){console.error('formSection not found');return;};
  await flipAnination(event,formSection);
  async function flipAnination (event, formSection) {
    formSection.classList.add('flip');
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