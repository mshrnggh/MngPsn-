let olBClicked = false;
let wmBClicked = false;
document.addEventListener('DOMContentLoaded', async () => {await showBoardList()});
async function showBoardList() {
  const threadsData = await window.getAPI.AllThreadsAPI();
    await window.postAPI.send('get-DBdata');
    await window.postAPI.receive('get-DBdata', async (data) => {
      olBClicked = data.a; wmBClicked = data.b;  
      const allThreads = createBoardList(threadsData);
      await createBoardColumns(allThreads);
    });    
};
function createBoardList(data) {
  const allThreadsarr = Array.isArray(data) ? data.flat() : [data];
  console.log('allThreadsarr at createBoardList getmjs ', allThreadsarr);
  const boardList = document.createElement('div');
  boardList.classList.add('board-list');
  for (const thread of allThreadsarr) {
    const boardItem = document.createElement('div');
    boardItem.classList.add('singleThread');
    boardItem.textContent = thread.title;
    boardList.appendChild(boardItem);
  }; return boardList;
};
async function createBoardColumns(boardList) {
  const allThreads = boardList.querySelectorAll('.singleThread');
  const boardSection = document.createElement('div');
  boardSection.classList.add('all-threads');
  const boardColumns = document.createElement('div');
  boardColumns.classList.add('board-columns');
  for (let i = 0; i < 3; i++) {
    const boardColumn = document.createElement('div');
    boardColumn.classList.add('board-column');
    const  columnList = document.createElement('div');
    columnList.classList.add('board-list');
    for (let j = i; j < allThreads.length; j += 3) {
      columnList.appendChild(allThreads[j]);
    }
    boardColumn.appendChild(columnList);
    boardColumns.appendChild(boardColumn);
  }
  boardSection.appendChild(boardColumns);
  const threadSection = document.querySelector('.thread-section');
  threadSection.appendChild(boardSection);
  console.log('boardSection, threadSection at createBoardColumns getmjs ', threadSection);
}