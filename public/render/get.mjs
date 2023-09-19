let ol = false; let wm = false;
document.addEventListener('DOMContentLoaded', async () => {await showBoardList()});
async function showBoardList() {const threadsData = await window.getAPI.AllThreadsAPI();
  await window.postAPI.send('get-DBdata');
  await window.postAPI.receive('get-DBdata', async (data) => {
    ol=data.ol;wm=data.wm;  
    const allThreads = createBoardList(threadsData);
    await createBoardColumns(allThreads);
  });
};
export function createBoardList(data) {
  const allThreadsarr=Array.isArray(data) && Array.isArray(data[0])?data.flat():Array.isArray(data)?data:[data];
  const boardList = document.createElement('div');boardList.classList.add('board-list');
  for (const thread of allThreadsarr) {const boardItem = document.createElement('div');
    boardItem.classList.add('singleThread');let title = thread.title;
    const titleRegex = /^(?:[\x00-\x7F]|[\uFF61-\uFF9F]{2}){0,18}(?:(?![\x00-\x7F]|[\uFF61-\uFF9F]{2}).|$)/;
    if(titleRegex.test(title)){if(countLength(title)>50){title=sliceString(title,50)+'...';};
    }else{if(countLength(title)>50){title=sliceString(title,50)+'...';};};
    boardItem.textContent = title;boardList.appendChild(boardItem);
  } return boardList;
  function countLength(str){let len = 0;for(let i=0;i<str.length;i++) {const code=str.charCodeAt(i);
    if(code>=0x00&&code<=0x7f){len+=1;}else{len+=2;}}return len; }
  function sliceString(str,len){let count=0;let result='';for(let i=0;i<str.length;i++){const code=str.charCodeAt(i);
      if(code>=0x00&&code<=0x7f){count+=1;}else{count+=2;} if(count>len){break;}
      result += str.charAt(i);} return result;};
};
export async function createBoardColumns(boardList) {
  let boardColumn = document.querySelector('.board-column');
  const allThreads = boardList.querySelectorAll('.singleThread');
  boardColumn = document.createElement('div');boardColumn.classList.add('board-column');
  const columnCount = 2; const maxRows = 14;
  const rowCount=Math.ceil(Math.min(allThreads.length,columnCount*maxRows)/columnCount);
  for (let i=0;i<columnCount;i++){const columnList=document.createElement('div');
    columnList.classList.add('board-list');
    for(let j=i*rowCount;j<Math.min((i+1)*rowCount,allThreads.length);j++){
     columnList.appendChild(allThreads[j]);
     if(columnList.children.length>=maxRows){break;};};
    boardColumn.appendChild(columnList);
  };
  const formSection = document.querySelector('.form-section');
  const threadSection = document.querySelector('.thread-section');
  if (formSection && threadSection) {
    boardColumn.appendChild(formSection);
    threadSection.appendChild(boardColumn);
  }
  boardColumn.appendChild(formSection);
  threadSection.appendChild(boardColumn);
};