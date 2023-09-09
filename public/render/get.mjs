let olBClicked = false;
let wmBClicked = false;

document.addEventListener('DOMContentLoaded', async () => {await showBoardList()});
async function showBoardList() {
  try {
    const threadsData = await window.getAPI.AllThreadsAPI();
    await window.postAPI.send('get-DBdata');
    await window.postAPI.receive('get-DBdata', async (data) => {
      olBClicked = data.a; wmBClicked = data.b;  
      const threadSection = document.querySelector('.thread-section');
      const allThreads = await createBoardList(threadsData);
      console.log('allThreads in mjs', allThreads);
      threadSection.appendChild(allThreads);
      });    
    } catch (err) {console.log('err at getmjs ', err);};
};

async function createBoardList(data) {
  try {
    const allThreadsarr = Array.isArray(data) ? data.flat() : [data];
    const boardList = await document.createElement('div');
    boardList.classList.add('board-list');
    for (const thread of allThreadsarr) {
      console.log('thread at createBoardList ', thread, thread.title);
      const boardItem = await document.createElement('div');
      await boardItem.classList.add('singleThread');
      boardItem.textContent = thread.title;
      await boardList.appendChild(boardItem);
    }
    return boardList;
  } catch (err) {
    console.log('err at createBoardList ', err);
  }
};
