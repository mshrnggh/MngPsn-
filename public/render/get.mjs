let ol = false; let wm = false; let data = []; 
const getAllThreAgain = document.querySelector('#getAllThreAgain');
getAllThreAgain.addEventListener('click',async()=>{await showBoardList()});

export async function showBoardList() {
  await window.postAPI.removeChannel('get-DBdata');
  await window.postAPI.send('get-DBdata');
  await window.postAPI.receive('get-DBdata', async(...args)=>{[data,ol,wm]=args;
  if (typeof data === "json") {data = JSON.parse(data);}
  else {data = JSON.parse(JSON.stringify(data));};
  const allThreList = await createBoardList(data);
  const allThreads = allThreList instanceof NodeList?allThreList:allThreList.querySelectorAll('.singleThread');
  await createBoardColumns(allThreads);});
};

export function createBoardList(data) {
  const allThreadsarr=Array.isArray(data) && Array.isArray(data[0])?data.flat():Array.isArray(data)?data:[data];
  const boardList = document.querySelectorAll('.board-list');
  boardList.forEach((boardList)=>{boardList.innerHTML='';});
  if(!data) return null;
  for (let i = 0; i < allThreadsarr.length; i++) {
    const singleItem = document.createElement('div');singleItem.classList.add('singleThread');
    const thread = allThreadsarr[i];let title = thread.title;
    const titleRegex = /^(?:[\x00-\x7F]|[\uFF61-\uFF9F]{2}){0,18}(?:(?![\x00-\x7F]|[\uFF61-\uFF9F]{2}).|$)/;
    if(titleRegex.test(title)){if(countLength(title)>50){title=sliceString(title,50)+'...';};
    }else{if(countLength(title)>50){title=sliceString(title,50)+'...';};};
    singleItem.dataset.title=title;singleItem.dataset.id = thread.id;singleItem.dataset.straged=thread.straged;
    singleItem.dataset.content=thread.content;singleItem.textContent=title;
    boardList[i%2].appendChild(singleItem);//特定のboardListにデータをappendChildで蓄積
  }; const singleDOM = document.querySelectorAll('.singleThread');return singleDOM;  
  //上のfor文外で、DOMをquerySelectorAllで取得するとNodeList形式データになり、それをreturn
  function countLength(str){let len=0;for(let i=0;i<str.length;i++){const code=str.charCodeAt(i);
    if(code>=0x00&&code<=0x7f){len+=1;}else{len+=2;}}return len;}
  function sliceString(str,len){let count=0;let result='';for(let i=0;i<str.length;i++){const code=str.charCodeAt(i);
      if(code>=0x00&&code<=0x7f){count+=1;}else{count+=2;} if(count>len){break;}
      result += str.charAt(i);} return result;};
};

export async function createBoardColumns(allThreads) {
  const columnCount = 2; const maxRows = 14;
  const boardList = document.querySelectorAll('.board-list');
  for (let i=0;i<columnCount;i++){const boardColumn = document.querySelector('.board-column');
    const rowCount= await Math.ceil(Math.min(allThreads.length,columnCount*maxRows)/columnCount);
    for(let j=i*rowCount;j<Math.min((i+1)*rowCount,allThreads.length);j++){
      if(!boardList[i].contains(allThreads[j])){boardList[i%2].appendChild(allThreads[j]);}
      if(boardList[i%2].children.length>=maxRows){break;};};
    boardColumn.appendChild(boardList[i%2]);
  }; const threadSection = document.querySelector('.thread-section');
  const boardColumn = document.querySelector('.board-column'); 
  const formSection = document.querySelector('.form-section');
  boardColumn.appendChild(formSection);threadSection.appendChild(boardColumn);   
};
