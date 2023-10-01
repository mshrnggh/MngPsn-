import { createBoardList, createBoardColumns } from "./get.mjs";
document.addEventListener('DOMContentLoaded', async()=>{
  const deleteSection = document.querySelector('.delete-section');
  const strageExchange = document.querySelector('.strage-exchange');
  await deleteSection.addEventListener('dragover', dragOver);
  await deleteSection.addEventListener('dragleave', dragLeave);
  await deleteSection.addEventListener('drop', drop);
  await strageExchange.addEventListener('dragover', dragOver);
  await strageExchange.addEventListener('dragleave', dragLeave);
  await strageExchange.addEventListener('drop', drop); 
});

 export async function dragStart(event) {   
   await event.dataTransfer.setData('text/plain', JSON.stringify({
     id:this.dataset.id, title:this.dataset.title, content:this.dataset.content, 
     straged:this.dataset.straged, value: this.value}));
   setTimeout(() => {this.className += ' ondrag';}, 0);
   event.currentTarget.style.opacity = '1';   
}

export async function dragEnd(event) {
  event.currentTarget.style.opacity = '1';
  this.className = 'singleThread';  
}

export async function dragOver(event) {
  event.preventDefault();
  await this.classList.add("hovered");
  event.currentTarget.style.opacity = '0.5';  
}

export async function dragLeave(event) {  
  await this.classList.remove("hovered");
  event.currentTarget.style.opacity = '1';
}

export async function drop(event) { 
  await this.classList.remove("hovered");
  event.currentTarget.style.opacity = '1';let ol, wm;let data=[];
  if(event.currentTarget.className === 'delete-section') {
    const threadElement = event.dataTransfer.getData('text/plain');
    const threadId = JSON.parse(threadElement).id;
    const straged = JSON.parse(threadElement).straged;
    const deleteData = {id: threadId, straged: straged};
    console.log('deleteData at drop ', deleteData);
    await window.postAPI.removeChannel('get-DBdata');
    await window.postAPI.send('get-DBdata');
    window.postAPI.receive('get-DBdata',async(...args)=>{[data,ol,wm]=args;
      await window.postAPI.removeChannel('delete-thread');
      await window.postAPI.send('delete-thread', deleteData,ol,wm);
      await window.postAPI.removeChannel('delete-thread-reply');
      await window.postAPI.receive('delete-thread-reply',async(...args)=>{
        const newAllData=args[0];        
        const allThreList = await createBoardList(newAllData);
        const allThreads = allThreList instanceof NodeList?allThreList:allThreList.querySelectorAll('.singleThread');
        await createBoardColumns(allThreads);
      });});
    
  }else if(event.currentTarget.className === 'strage-exchange') {
     const threadElement = event.dataTransfer.getData('text/plain');
     const id = JSON.parse(threadElement).id;
     const title = JSON.parse(threadElement).title;
     const content = JSON.parse(threadElement).content;
     const straged = JSON.parse(threadElement).straged;
     const exchangeData = {id,title,content,straged};
     console.log('exchangeData on exchange', exchangeData);
     await window.postAPI.removeChannel('get-DBdata');
     await window.postAPI.send('get-DBdata');
     window.postAPI.receive('get-DBdata',async(...args)=>{[data,ol,wm]=args;
       await window.postAPI.removeChannel('thread-exchange');
       await window.postAPI.send('thread-exchange', exchangeData,ol,wm);
       await window.postAPI.removeChannel('thread-exchange-reply');
       await window.postAPI.receive('thread-exchange-reply', async(...args)=>{
       const newAllData=args[0];
       const allThreList = await createBoardList(newAllData);
       const allThreads = allThreList instanceof NodeList?allThreList:allThreList.querySelectorAll('.singleThread');
       await createBoardColumns(allThreads);
     });});
  } 
}
      
