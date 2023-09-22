let ol = false; let wm = false; let data = []; 
const getAllThreAgain = document.querySelector('#getAllThreAgain');
getAllThreAgain.addEventListener('click',async()=>{await showBoardList()});

async function showBoardList() {
  await window.postAPI.removeChannel('get-DBdata');
  await window.postAPI.send('get-DBdata');
  await window.postAPI.receive('get-DBdata', async(...args)=>{[data,ol,wm]=args;
    const allThreList = await createBoardList(data);await createBoardColumns(allThreList);});
};

export function createBoardList(data) {
  const allThreadsarr=Array.isArray(data) && Array.isArray(data[0])?data.flat():Array.isArray(data)?data:[data];
  console.log('allThreadsarr at createBoardList, mjs ', allThreadsarr);
  let boardList;
  for (let i = 0; i < allThreadsarr.length; i++) {
    boardList = document.querySelectorAll('.board-list');
    const singleItem = document.createElement('div');singleItem.classList.add('singleThread');
    const thread = allThreadsarr[i];let title = thread.title;
    const titleRegex = /^(?:[\x00-\x7F]|[\uFF61-\uFF9F]{2}){0,18}(?:(?![\x00-\x7F]|[\uFF61-\uFF9F]{2}).|$)/;
    if(titleRegex.test(title)){if(countLength(title)>50){title=sliceString(title,50)+'...';};
    }else{if(countLength(title)>50){title=sliceString(title,50)+'...';};};
  singleItem.textContent = title;
  boardList[i%2].appendChild(singleItem);//for文のなかで、elementをappendChildで蓄積させる
  }; 
  const singleDOM = document.querySelectorAll('.singleThread'); return singleDOM;  
  //上のfor文の外で、DOMをquerySelectorAllで取得するとNodeList形式データになるので、それをreturnする。
  function countLength(str){let len=0;for(let i=0;i<str.length;i++){const code=str.charCodeAt(i);
    if(code>=0x00&&code<=0x7f){len+=1;}else{len+=2;}}return len;}
  function sliceString(str,len){let count=0;let result='';for(let i=0;i<str.length;i++){const code=str.charCodeAt(i);
      if(code>=0x00&&code<=0x7f){count+=1;}else{count+=2;} if(count>len){break;}
      result += str.charAt(i);} return result;};
};

export async function createBoardColumns(allThreList) {
  const boardColumn = document.querySelector('.board-column');
  const boardList = boardColumn.querySelectorAll('.board-list');
  const allThreads = allThreList instanceof NodeList ? allThreList : allThreList.querySelectorAll('.singleThread');
  const columnCount = 2; const maxRows = 14;
  const rowCount=Math.ceil(Math.min(allThreads.length,columnCount*maxRows)/columnCount);
  for (let i=0;i<columnCount;i++){boardList[i].innerHTML='';
    for(let j=i*rowCount;j<Math.min((i+1)*rowCount,allThreads.length);j++){
     if(!boardList[i].contains(allThreads[j])){boardList[i].appendChild(allThreads[j]);}
     if(boardList[i].children.length>=maxRows){break;};};
    boardColumn.appendChild(boardList[i]);
  }; const threadSection = document.querySelector('.thread-section');
  const formSection = document.querySelector('.form-section');
  boardColumn.appendChild(formSection);
  threadSection.appendChild(boardColumn);   
};