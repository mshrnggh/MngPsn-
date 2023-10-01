window.flipNotepad = flipNotepad;
let ol = false; let wm = false; let data = []; 
import { dragStart, dragEnd} from "./delchang.mjs";
document.addEventListener('DOMContentLoaded', () => {
  const formSection = document.querySelector('.form-section');
  console.log('formSection1',formSection);
  formSection.addEventListener('submit', async (event)=>{
    event.preventDefault(); const submitterId=event.submitter.id;
    //const formSection = document.querySelector('.form-section');
    console.log('formSection2',formSection);
    await flipNotepad(event,submitterId,formSection);});
});
async function flipNotepad(event,submitterId,formSection) {
  if(!event||event.submitter.nodeName!=='BUTTON') {return;}
  if(!formSection){console.error('formSection not found');return;};
  await flipAnination(event,formSection);
  async function flipAnination (event, formSection) {
    const formData = new FormData(formSection);
    const title=formData.get('inputTitle');const content=formData.get('inputContent');
    const note={title,content};formSection.classList.add('flip');
    console.log('in the middle of flipAnination, formSec',formSection)
    await new Promise(resolve => setTimeout(resolve, 350));
    await addToDB(note, submitterId, formSection, event);
    formSection.classList.remove('flip');
    await new Promise(resolve => setTimeout(resolve, 0));
    formSection.classList.remove('show');
    await new Promise(resolve => setTimeout(resolve, 350));
    formSection.classList.add('show');
    const inputTitle = document.querySelector('#inputTitle');
    const inputContent = document.querySelector('#inputContent');
    inputTitle.value = ''; inputContent.value = '';
    event.target.removeEventListener('submit', flipNotepad);
    };
  //formSection.addEventListener('submit',flipNotepad);このコードがここに無くても、2行目のDomContentLoadedで再度イベントリスナーが登録される
};
async function addToDB(note, submitterId) {let newAllThre;
  if (submitterId==='submitLocal') {newAllThre=await window.postAPI.addToLocalDB(note)
  } else if (submitterId==='submitMongoDB') {
    newAllThre = await window.postAPI.addToMongoDB(note);
  }; await showReloadList(newAllThre);
};
async function showReloadList(newAllThre) {
  await window.postAPI.removeChannel('get-DBdata');
  await window.postAPI.send('get-DBdata'); 
  await window.postAPI.receive('get-DBdata',async(...args)=>{[data,ol,wm]=args; 
    console.log('typeof1 data, newAllThre ', typeof data, typeof newAllThre);
    if (typeof data === "json") {data = JSON.parse(data);}
    else {data = JSON.parse(JSON.stringify(data));}
    const allReloadThre = await createReloadList(newAllThre);
    const allReloadData = allReloadThre instanceof NodeList?allReloadThre:allReloadThre.querySelectorAll('.singleThread');
    await createReloadColumns(allReloadData);});
};
async function createReloadList(data) { 
  const allThreadsarr=Array.isArray(data)&&Array.isArray(data[0])?data.flat():Array.isArray(data)?data:[data];
  const boardList = document.querySelectorAll('.board-list');
  boardList.forEach((boardList)=>{boardList.innerHTML='';});if(!data) return null;
  for (let i=0;i<allThreadsarr.length;i++) {
    const boardItem = document.createElement('div');boardItem.classList.add('singleThread');
    boardItem.setAttribute('draggable', 'true');const thread=allThreadsarr[i];let title=thread.title;
    const titleRegex=/^(?:[\x00-\x7F]|[\uFF61-\uFF9F]{2}){0,18}(?:(?![\x00-\x7F]|[\uFF61-\uFF9F]{2}).|$)/;
    if(titleRegex.test(title)){if(countLength(title)>48) {title=sliceString(title,48)+'...';}
    }else{if(countLength(title)>48){title=sliceString(title,48)+'...';}}
    boardItem.dataset.title=title;boardItem.dataset.id=thread.id;// datasetにidプロパティ追加
    boardItem.dataset.content=thread.content;boardItem.dataset.straged=thread.straged;
    const threadTitle = document.createElement('div');threadTitle.classList.add('thread-title');
    const pingedDiv = document.createElement('span');
    pingedDiv.classList.add('pinged');pingedDiv.innerHTML = '&nbsp;';
    threadTitle.appendChild(pingedDiv);const titleText = document.createTextNode(title);
    threadTitle.appendChild(titleText);boardItem.appendChild(threadTitle);
    boardItem.addEventListener('dragstart',dragStart);boardItem.addEventListener('dragend', dragEnd);
    boardList[i%2].appendChild(boardItem);
  }; const boardListDOM = document.querySelectorAll('.singleThread');return boardListDOM;
  function countLength(str){let len=0;for(let i=0;i<str.length;i++){const code=str.charCodeAt(i);
    if(code>=0x00&&code<=0x7f){len+=1;}else{len+=2;}} return len;};
  function sliceString(str,len){let count=0;let result='';for(let i=0;i<str.length;i++)
    {const code=str.charCodeAt(i);if(code>=0x00&&code<=0x7f){count+=1;}else{count+=2;}
      if(count>len){break;} result+=str.charAt(i);}return result;};
};
async function createReloadColumns(allReloadData){
  const boardList=document.querySelectorAll('.board-list');
  const columnCount = 2; const maxRows = 15;
  const rowCount=Math.ceil(Math.min(allReloadData.length,columnCount*maxRows)/columnCount);
  for (let i=0;i<columnCount;i++){
    const boardColumn=document.querySelector('.board-column');
    for (let j=i*rowCount;j<Math.min((i+1)*rowCount,allReloadData.length);j++){
      if(!boardList[i].contains(allReloadData[j])){boardList[i].appendChild(allReloadData[j]);}
      if(boardList[i].children.length>=maxRows){break;};};
    boardColumn.appendChild(boardList[i]);
  };
  const threadSection = document.querySelector('.thread-section');
  const formSection = document.querySelector('.form-section');
  const boardColumn=document.querySelector('.board-column');
  boardColumn.appendChild(formSection);
  threadSection.appendChild(boardColumn);
};