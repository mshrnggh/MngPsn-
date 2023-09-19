import { createBoardList, createBoardColumns } from './get.mjs';
let ol = false; let wm = false;
document.addEventListener('DOMContentLoaded', async()=>{ 
  await window.postAPI.send('get-DBdata');
  await window.postAPI.receive('get-DBdata', async(data)=>{
    ol=data.ol;wm=data.wm; await showResearchedList(ol,wm)
  });});
  
async function showResearchedList(ol,wm){
  const searchButton = document.getElementById('search-button');
  const searchInput = document.getElementById('search-input');
  let threadSection = document.querySelector('.thread-section');
  let boardColumn; let boardList;let singleThreads;//boaL,boaC,singT変数をスコープ外でも使う
  searchButton.addEventListener('click', async ()=>{
    boardColumn = threadSection.querySelectorAll('.board-column');//定義
    boardColumn.forEach((column) => {
      boardList = column.querySelectorAll('.board-list');//定義
      boardList.forEach((list) => {
        singleThreads = list.querySelectorAll('.singleThread');//定義
        singleThreads.forEach((thread) => {thread.remove();});
      });
    });
    const keywords = searchInput.value.trim().split(/\s+/);
    console.log('ol,wm, keywords at showResearchedList, mjs ',ol,wm,keywords);
    const threadsData = await window.getAPI.getResearchAPI(ol,wm,keywords);
    console.log('threadsData at showResearchedList, mjs ', threadsData);
    const allThreads = createBoardList(threadsData);
    const newSingles = allThreads.querySelectorAll('.singleThread');
    
    const columnCount = 2; const maxRows = 14;
    const rowCount=Math.ceil(Math.min(newSingles.length,columnCount*maxRows)/columnCount);
    for (let i=0;i<columnCount;i++){
      for(let j=i*rowCount;j<Math.min((i+1)*rowCount,newSingles.length);j++){
        boardList[i].appendChild(newSingles[j]);
        if(boardList[i].children.length>=maxRows){break;};};
        // boardColumn.appendChild(boardList[i]);NodeListを入れ替えたので、この行は不要で不可。
    };
      //threadSection.appendChild(boardColumn);NodeListを入れ替えたので、この行は不要で不可。
      console.log('boaC,threS finally at showResearchList() ', boardColumn,threadSection);
    });};
    
    