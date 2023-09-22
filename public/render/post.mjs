window.flipNotepad = flipNotepad;
let ol = false; let wm = false; let data = []; 
document.addEventListener('DOMContentLoaded', () => {
  const formSection = document.querySelector('.form-section');
  formSection.addEventListener('submit', async (event)=>{event.preventDefault();
    const submitterId=event.submitter.id;await flipNotepad(event,submitterId,formSection);});
});
async function flipNotepad(event, submittedId,formSection) {
  if(!event||event.submitter.nodeName!=='BUTTON') { return;}
  else{if(!formSection){formSection=document.querySelector('.form-section');
      if(!formSection){console.error('formSection not found');return;};};
  async function flipAnination (event) {
    const formData = new FormData(formSection);
    const title=formData.get('inputTitle');const content=formData.get('inputContent');
    const note={title,content};formSection.classList.add('flip');
    await new Promise(resolve => setTimeout(resolve, 355));
    await addToDB(note, submittedId, formSection, event);
    formSection.style.display = 'none'; formSection.classList.remove('flip');
    const inputTitle = document.querySelector('#inputTitle');
    const inputContent = document.querySelector('#inputContent');
    inputTitle.value = ''; inputContent.value = '';
    await new Promise(resolve => setTimeout(resolve, 0)); formSection.style.display = 'block';
  };await flipAnination(event);
  event.target.removeEventListener('submit', flipNotepad);
  //formSection.addEventListener('submit',flipNotepad);このコードがここに無くても、2行目のDomContentLoadedで再度イベントリスナーが登録される
};};
async function addToDB(note, submittedId) {let newAllThre;
  if (submittedId==='submitLocal') {newAllThre=await window.postAPI.addToLocalDB(note)
  } else if (submittedId==='submitMongoDB') {
    newAllThre = await window.postAPI.addToMongoDB(note);
  }; await showReloadList(newAllThre);
};
async function showReloadList(newAllThre) {
  await window.postAPI.removeChannel('get-DBdata');
  await window.postAPI.send('get-DBdata'); 
  await window.postAPI.receive('get-DBdata',async(...args)=>{[data,ol,wm]=args; 
    const boardList = document.querySelectorAll('.board-list');
    boardList.forEach((list)=>{
    while(list.firstChild){list.removeChild(list.firstChild);};});
  const allReloadThre=await createReloadList(newAllThre);
  console.log('allReloadThre at showReloadList, mjs ', allReloadThre)
  await createReloadColumns(allReloadThre);});
};
async function createReloadList(data) { 
  const allThreadsarr=Array.isArray(data)&&Array.isArray(data[0])?data.flat():Array.isArray(data)?data:[data];
  let boardList;
  for (let i=0;i<allThreadsarr.length;i++) {
    boardList = document.querySelectorAll('.board-list');
    const boardItem=document.createElement('div');boardItem.classList.add('singleThread');
    const thread=allThreadsarr[i];let title=thread.title;
    const titleRegex=/^(?:[\x00-\x7F]|[\uFF61-\uFF9F]{2}){0,18}(?:(?![\x00-\x7F]|[\uFF61-\uFF9F]{2}).|$)/;
    if(titleRegex.test(title)){if(countLength(title)>50) {title=sliceString(title,50)+'...';}
    }else{if(countLength(title)>50){title=sliceString(title,50)+'...';}}
    boardItem.textContent = title;boardList[i%2].appendChild(boardItem);
  } const boardListDOM = document.querySelectorAll('.singleThread');return boardListDOM;
  function countLength(str){let len=0;for(let i=0;i<str.length;i++){const code=str.charCodeAt(i);
    if(code>=0x00&&code<=0x7f){len+=1;}else{len+=2;}} return len;};
  function sliceString(str,len){let count=0;let result='';for(let i=0;i<str.length;i++)
    {const code=str.charCodeAt(i);if(code>=0x00&&code<=0x7f){count+=1;}else{count+=2;}
      if(count>len){break;} result+=str.charAt(i);}return result;};
};
async function createReloadColumns(reloadData){let allThreads;
  if(reloadData instanceof NodeList){allThreads=reloadData;}
  else if(Array.isArray(reloadData)){allThreads=reloadData.flat();}
  else if(typeof reloadData==='object'){allThreads=[reloadData];}
  else{console.error('reloadData is not an object');return;};
  const boardList=document.querySelectorAll('.board-list');
  const boardColumn=document.querySelector('.board-column');
  const columnCount = 2; const maxRows = 14;
  const rowCount=Math.ceil(Math.min(allThreads.length,columnCount*maxRows)/columnCount);
  for (let i=0;i<columnCount;i++){boardList[i].innerHTML='';
    const boardColumn=document.querySelector('.board-column');
    for (let j=i*rowCount;j<Math.min((i+1)*rowCount,allThreads.length);j++){
      if(!boardList[i].contains(allThreads[j])){boardList[i].appendChild(allThreads[j]);}
      if(boardList[i].children.length>=maxRows){break;};};
    boardColumn.appendChild(boardList[i]);
  };
  const threadSection = document.querySelector('.thread-section');
  const formSection = document.querySelector('.form-section');
  boardColumn.appendChild(formSection);
  threadSection.appendChild(boardColumn);
};