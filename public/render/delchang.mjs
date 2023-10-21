import { createBoardList, createBoardColumns, getLocalStorage, alignLocalStorage} from "./get.mjs";
document.addEventListener('DOMContentLoaded', ()=>{
  const deleteSection = document.querySelector('.delete-section');
  const strageExchange = document.querySelector('.strage-exchange');
  deleteSection.addEventListener('dragover', dragOver);
  deleteSection.addEventListener('dragleave', dragLeave);
  deleteSection.addEventListener('drop', drop);
  strageExchange.addEventListener('dragover', dragOver);
  strageExchange.addEventListener('dragleave', dragLeave);
  strageExchange.addEventListener('drop', drop); 
});//document.addEventListener('DOMContentLoaded', は非同期ではない。DOM読込完了を待つ
//一方でwindow.addEventListener('DOMContentloaded', は非同期でり、DOM読込完了を待たない
  
async function deleteStrg() { await alignLocalStorage();
  return new Promise(async(resolve,reject)=>{
      const lclStrg = await getLocalStorage();
      await window.postAPI.removeChannel('delete-lclStrg');
      await window.postAPI.send('delete-lclStrg', lclStrg);
      await window.postAPI.receive('delete-lclStrg',async(event, ...args)=>{
        const trgtKy = args[0]; const targetKey = `key${trgtKy}`;        
        await localStorage.removeItem(targetKey);
        const targetKeys = Object.keys(localStorage).filter(key => key.startsWith('key'))
        .sort((a, b)=>{ const numA = parseInt(a.replace('key', ''));
          const numB = parseInt(b.replace('key', '')); return numA - numB;
        }).filter(key =>{const num=parseInt(key.replace('key', ''));
          return !isNaN(num) && num > trgtKy;}); 

        for (const key of targetKeys) {
          const num = parseInt(key.replace('key', '')); const newKey = `key${num - 1}`;
          const value = localStorage.getItem(key); localStorage.setItem(newKey, value);
          localStorage.removeItem(key);}
});resolve();});};
//上のコードでは、エラーが発生したときにPromiseが拒否され、rejectが呼び出される場所が無いので、rejectが必要ない。
//ただしresolve()は必要で、resolveが無いとexchStrg()関数がPromiseを解決終了しなく、その結果呼び出し元がブロックされます。

async function exchStrg () { await alignLocalStorage();
  return new Promise(async(resolve,reject)=>{    
    const lclStrg = await getLocalStorage();
    await window.postAPI.removeChannel('exch-lclStrg');
    await window.postAPI.send('exch-lclStrg', lclStrg);
    await window.postAPI.receive('exch-lclStrg',async(event, ...args)=>{ 
      //preload fileのreceiveに注意事項あり。
      if (args.length > 0) { const trgtKy = args[0]; const targetKey = `key${trgtKy}`;
        const allKeys = await Object.keys(localStorage); // localStorageに格納されているすべてのキーを取得する
                
        let max = await allKeys.reduce((max, key) => { 
          const num = parseInt(key.replace('key', ''), 10); //キーから数値を取得する。10は10進法を意味する。
          return num > max ? num : max;}, 0);  // 最大値を更新する// 
          const maxKey = `key${max+1}`; // 数値が一番大きいキーより１つ大きい数値を取得する
          const selectedData = await localStorage.getItem(targetKey);
          if(selectedData) { const parsedData = JSON.parse(selectedData);
            await localStorage.setItem(maxKey,JSON.stringify(parsedData));
            await localStorage.removeItem(targetKey);
            const targetKeys = Object.keys(localStorage).filter(key => key.startsWith('key'))
            .sort((a, b)=>{ const numA = parseInt(a.replace('key', ''));
              const numB = parseInt(b.replace('key', '')); return numA - numB;
            }).filter(key =>{const num=parseInt(key.replace('key', ''));
            return !isNaN(num) && num > trgtKy;
            }); 
            for (let i = 0; i < targetKeys.length; i++) { const key = targetKeys[i];
              const num = parseInt(key.replace('key','')); const newKey = `key${num - 1}`;
              const value = localStorage.getItem(key); 
              localStorage.setItem(newKey, value); localStorage.removeItem(key);}
          };  
      };});resolve();});};

export async function dragStart(event) {   
   await event.dataTransfer.setData('text/plain', JSON.stringify({
     id:this.dataset.id, title:this.dataset.title, content:this.dataset.content, 
     straged:this.dataset.straged, value: this.value}));  
  setTimeout(() => {this.className += ' ondrag';}, 0);
}

export async function dragEnd(event) {
  event.currentTarget.style.opacity = '1';
  this.className = 'singleThread';  
}

export async function dragOver(event){event.preventDefault(); await this.classList.add("hovered");}

export async function dragLeave(event){await this.classList.remove("hovered");}

export async function drop(event) { 
  await this.classList.remove("hovered");
  event.currentTarget.style.opacity = '1';let ol, wm;let data=[];
  if(event.currentTarget.className === 'delete-section') {
    const threadElement = event.dataTransfer.getData('text/plain');
    const threadId = JSON.parse(threadElement).id;
    const straged = JSON.parse(threadElement).straged;
    const deleteData = {id: threadId, straged: straged};
    await window.postAPI.removeChannel('get-DBdata');
    await window.postAPI.send('get-DBdata');
    await window.postAPI.receive('get-DBdata',async(event, ...args)=>{[data,ol,wm]=args;
      await window.postAPI.removeChannel('delete-thread');
      await window.postAPI.send('delete-thread', deleteData,ol,wm);
      await deleteStrg();
      await window.postAPI.removeChannel('delete-thread-reply');
      await window.postAPI.receive('delete-thread-reply',async(event, ...args)=>{
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
     await window.postAPI.removeChannel('get-DBdata');
     await window.postAPI.send('get-DBdata');
     await window.postAPI.receive('get-DBdata',async(event, ...args)=>{[data,ol,wm]=args;
       await window.postAPI.removeChannel('thread-exchange');
       await window.postAPI.send('thread-exchange', exchangeData,ol,wm);
       await exchStrg();
       await window.postAPI.removeChannel('thread-exchange-reply');
       await window.postAPI.receive('thread-exchange-reply', async(event, ...args)=>{
       const newAllData=args[0];
       const allThreList = await createBoardList(newAllData);
       const allThreads = allThreList instanceof NodeList?allThreList:allThreList.querySelectorAll('.singleThread');
       await createBoardColumns(allThreads);
     });});
  } 
}
      
