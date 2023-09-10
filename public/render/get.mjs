let olBClicked = false;
let wmBClicked = false;
document.addEventListener('DOMContentLoaded', async () => {await showBoardList()});
async function showBoardList() {
  const threadsData = await window.getAPI.AllThreadsAPI();
    await window.postAPI.send('get-DBdata');
    await window.postAPI.receive('get-DBdata', async (data) => {
      olBClicked = data.a; wmBClicked = data.b;  
      const threadSection = document.querySelector('.thread-section');
      const allThreads = createBoardList(threadsData);
      threadSection.appendChild(allThreads);
      console.log('threadSection ', threadSection);
      await createBoardColumns(allThreads);
      });    
};

function createBoardList(data) {
  const allThreadsarr = Array.isArray(data) ? data.flat() : [data];
  console.log('allThreadsarr at createBoardList getmjs ', allThreadsarr);
  const boardList = document.createElement('div');
  boardList.classList.add('board-list');
  for (const thread of allThreadsarr) {
    console.log('thread at createBoardList ', thread, thread.title);
    const boardItem = document.createElement('div');
    boardItem.classList.add('singleThread');
    boardItem.textContent = thread.title;
    boardList.appendChild(boardItem);
  }; console.log('boardList at createBoardList ', boardList);return boardList;
};

async function createBoardColumns(allThreads) {
  console.log('allThreads before createBoardColumns ', allThreads);
  const threadItems = allThreads.querySelectorAll('.singleThread');
  const threadItemsArray = Array.from(threadItems);
  const threadColumns = [[], [], []];
  threadItemsArray.forEach((item, index) => {
    threadColumns[index % 3].push(item);
  }); 
  const boardColumns = await document.createElement('div');
  boardColumns.classList.add('board-columns');
  for (const column of threadColumns) {
    const boardColumn = await document.createElement('div');
    boardColumn.classList.add('board-column');
    for (const threadItem of column) {
      await boardColumn.appendChild(threadItem);
    }
    await boardColumns.appendChild(boardColumn);
  }
  const threadSection = document.querySelector('.thread-section');
  threadSection.innerHTML = '';
  threadSection.appendChild(boardColumns);
}