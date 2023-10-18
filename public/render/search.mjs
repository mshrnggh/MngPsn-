import { createBoardList, createBoardColumns, getLocalStorage  } from './get.mjs';
let ol = false; let wm = false;let data = [];
const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', async (event)=>{
  event.preventDefault(); await window.postAPI.removeChannel('get-DBdata'); 
  await window.postAPI.send('get-DBdata');
  await window.postAPI.receive('get-DBdata', async(event, ...args)=>{[data,ol,wm]=args;
    console.log('data in search.mjs ',data);
    await showResearchedList(ol,wm)
});});
  
async function showResearchedList(ol,wm){
  const searchInput = document.getElementById('search-input');
  const keywords = searchInput.value.trim().split(/\s+/);
  const researched = await window.getAPI.getResearchAPI(ol,wm,keywords);
  const allResearchedArr=await Array.isArray(researched) && Array.isArray(researched[0])?researched.flat():Array.isArray(researched)?researched:[researched];
  const allResearched = await createBoardList(allResearchedArr); 
  if(allResearched.length===0){return alert('検索結果はありませんでした。');}
  const allThreads = await allResearched instanceof NodeList?allResearched:allResearched.querySelectorAll('.singleThread');
  console.log('allThreads ', allThreads);
  await createBoardColumns(allThreads);
};  
    