const { ipcMain } = require('electron');
async function getResearchIPC(ol, wm, keywords, bW) {
  return new Promise(async (resolve, reject) => {
  //9行目のipcMain.onが非同期なので、かつservercjs170行目が代入形式（const data = getResearchIPC)
  //なので、時間差を合わせる意味でreturn new Promise化しないと、時差が出て、値が取得できない。
  try{ let data, allThreads =[]; bW.webContents.removeAllListeners('get-lclStrg');
     bW.webContents.send('get-lclStrg'); ipcMain.removeAllListeners('get-lclStrg-reply');
     ipcMain.on('get-lclStrg-reply', async(event,...args)=>{data = args[0];    
       if (wm===true){ const {Thread} = await import('../mngSchema.mjs')
         const mongoData = await Thread.find({}, {_id:1,title:1,content:1,straged:1});    
         data = [...mongoData,...data.slice(0, 30)];
       };       
    // キーワード検索
    const filteredData = data.filter((thread) => {
      const title = thread.title || thread['title:'] || '';
      const content = thread.content || '';
      return keywords.some((keyword) => {
        const regex = new RegExp(keyword, 'i');
        return regex.test(title) || regex.test(content);
      });
    });     
    // スレッドデータ取得
    if(filteredData){ 
      allThreads = await filteredData.map((thread) => {
        const id = thread.id || thread._id.toString();
        const title = thread.title || thread['title:'] || '';
        const content = thread.content || thread['content:'];
        const straged = thread.straged || thread['straged:']; 
        return { id, title, content, straged };     
      });allThreads=allThreads.slice(0,30); resolve(allThreads);
    }else{resolve([]);};
  });
  }catch(error){console.error(error);resolve([]);};});
};
module.exports = { getResearchIPC };