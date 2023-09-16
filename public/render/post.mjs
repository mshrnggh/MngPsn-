window.flipNotepad = flipNotepad;
document.addEventListener('DOMContentLoaded', () => {
  const formSection = document.querySelector('.form-section');
  formSection.addEventListener('submit', async (event)=>{event.preventDefault();
    const submitterId=event.submitter.id;await flipNotepad(event,submitterId,formSection);});
});
async function flipNotepad(event, submittedId, formSection) {
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
async function addToDB(note, submittedId, formSection, event) {let newAllThre;
  if (submittedId==='submitLocal') {newAllThre=await window.postAPI.addToLocalDB(note)
  } else if (submittedId==='submitMongoDB') {newAllThre = await window.postAPI.addToMongoDB(note);
  }; await showReloadList( newAllThre, formSection, event );
};
async function showReloadList( data, formSection, event ) {
  const threadSection = document.querySelector('.thread-section');
  while (threadSection.firstChild) {threadSection.removeChild(threadSection.firstChild);}
  const allReloadThre = await createReloadList(data);
  await createReloadColumns(allReloadThre, formSection, event );
};
async function createReloadList(data) {
  const allThreadsarr=Array.isArray(data)&&Array.isArray(data[0])?data.flat():Array.isArray(data)?data:[data];
  console.log('allThreadsarr at createReloadList getmjs ', allThreadsarr);
  const boardList=document.createElement('div');boardList.classList.add('board-list');
  for (const thread of allThreadsarr) {const boardItem = document.createElement('div');
    boardItem.classList.add('singleThread');let title = thread.title;
    const titleRegex=/^(?:[\x00-\x7F]|[\uFF61-\uFF9F]{2}){0,18}(?:(?![\x00-\x7F]|[\uFF61-\uFF9F]{2}).|$)/;
    if(titleRegex.test(title)){if(countLength(title)>50) {title=sliceString(title,50)+'...';console.log('title at Regex words limit ', title);}
    }else{if(countLength(title)>50){title=sliceString(title,50)+'...';console.log('title at non-Regex words limit',title);}}
    console.log('title at createBoardList getmjs ',title);
    boardItem.textContent = title; boardList.appendChild(boardItem);
  } return boardList;
  function countLength(str){let len=0;for(let i=0;i<str.length;i++){const code=str.charCodeAt(i);
    if(code>=0x00&&code<=0x7f){len+=1;}else{len+=2;}} return len;};
  function sliceString(str,len){let count=0;let result='';for(let i=0;i<str.length;i++)
    {const code=str.charCodeAt(i);if(code>=0x00&&code<=0x7f){count+=1;}else{count+=2;}
      if(count>len){break;} result+=str.charAt(i);}return result;};
};
async function createReloadColumns(reloadData, formSection, event) {
  const allThreads = reloadData.querySelectorAll('.singleThread');
  console.log('allThreads at createReloadColumns postmjs ', allThreads);
  const boardColumn=document.createElement('div'); boardColumn.classList.add('board-column');
  const columnCount = 2; const maxRows = 15;
  const rowCount=Math.ceil(Math.min(allThreads.length,columnCount*maxRows)/columnCount);
  for (let i=0;i<columnCount;i++) {const columnList=document.createElement('div');
    columnList.classList.add('board-list');
    for (let j=i*rowCount;j<Math.min((i+1)*rowCount,allThreads.length);j++){
      columnList.appendChild(allThreads[j]);
      if (columnList.children.length>=maxRows){break;}
    }; boardColumn.appendChild(columnList);
  };
  const threadSection = document.querySelector('.thread-section');
  boardColumn.appendChild(formSection); threadSection.appendChild(boardColumn);
  console.log('threSec, formSec at createReloadColumns postmjs ', formSection, threadSection);
};