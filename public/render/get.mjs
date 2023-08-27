let olBClicked = false;
let wmBClicked = false;
let viapostIPC = 'getloaded';
document.addEventListener('DOMContentLoaded', () => showBoardList(viapostIPC));
async function showBoardList(viapostIPC) {
  await window.getAPI.requestAllThreadsAPI();
  const threadsData = await window.getAPI.getAllThreadsAPI().then((data)=>{return data;});
  console.log('threadData arrived at getmjs ', threadsData);
  try {
    await window.postAPI.receive('get-DBdata-reply', async (data) => {
      console.log('data.a, data.b at getmjs ', data.a, data.b);
      olBClicked = data.a;
      wmBClicked = data.b;
      const threadSection = document.querySelector('.thread-section');
      console.log('viapostIPC in showBoardList func. ', viapostIPC);
      if(viapostIPC === 'postreloaded') {
        const existingBoardList = document.querySelector('.board-list');
        if (existingBoardList) {
          existingBoardList.remove();
        }};
        const allThreads = await createBoardList(threadsData);
        console.log('allThreads ', allThreads);
        threadSection.appendChild(allThreads);
      }); await window.postAPI.send('get-DBdata');
    } catch (err) {console.log('err at getmjs ', err);}}
      async function createBoardList(threadsData) {
        console.log('threadsData at createBoardList ', threadsData);
        try {
          const allThreadsarr = Array.from(threadsData);
  const boardList = await document.createElement('div');
  boardList.classList.add('board-list');
  allThreadsarr.forEach((thread) => {
    const boardItem = document.createElement('div');
    boardItem.classList.add('singleThread');
    boardItem.textContent = thread.title;console.log('boardItem ', boardItem);
    boardList.appendChild(boardItem);console.log('boardList ', boardList);
  });
  return boardList; } catch (err) {console.log('err at createBoardList ', err);}
}
window.postAPI.receive('reloadAllThreads', (viapostIPC) => { showBoardList(viapostIPC);});
export {showBoardList, createBoardList, olBClicked, wmBClicked};