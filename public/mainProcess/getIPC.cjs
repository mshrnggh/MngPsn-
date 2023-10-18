const {ipcMain} = require('electron');
async function getAllThreadsIPC(ol, wm, bW) { let allThreads = []; let data=[]; 
  return new Promise(async (resolve, reject) => { 
  //servercjs130行目ではallThreads = await getAllThreadsIPC();と言う代入形式で、15行目のipcMain.onが
  //非同期なので、時差を合わせる為にreturn new Promise化しないとタイミング差で値が取得できない。   
    if (wm === true) {
      const {Thread} = await import('../mngSchema.mjs'); 
      //const module = await import('../mngSchema.mjs'); const Thread = (await) module.Thread;
      //と言う2つのコードでは、不具合になる場合があった。awaitのタイミングがずれてしまうのかも？　
      let mongoData = await Thread.find({}, { _id: 1, title: 1, content: 1, straged: 1 }).lean();
      await bW.webContents.removeAllListeners('get-lclStrg');
      await bW.webContents.send('get-lclStrg');
      await ipcMain.removeAllListeners('get-lclStrg-reply');
      ipcMain.on('get-lclStrg-reply', async (event, ...args) => {
        data=args[0]; data=[...mongoData,...data.slice(0, 30)];
        allThreads = await data.map((thread) => {
          const id = thread.id || thread._id && thread._id.toString();
          const title = thread.title || thread['title:'] || '';
          const content = thread.content || thread['content:'];
          const straged = thread.straged || thread['straged:'];
          return { id, title, content, straged };
        }); resolve(allThreads);});
        
     } else if (ol === true) { 
       await bW.webContents.removeAllListeners('get-lclStrg');
       await bW.webContents.send('get-lclStrg');
       await ipcMain.removeAllListeners('get-lclStrg-reply');
       await ipcMain.on('get-lclStrg-reply', async (event, ...args) => {
         data = args[0]
         allThreads = await data.map((thread) => {
           const id = thread.id || thread._id && thread._id.toString();
           const title = thread.title||thread['title:']||'';
           const content = thread.content || thread['content:']; 
           const straged = thread.straged || thread['straged:'];
           return {id,title,content,straged};
         }); resolve (allThreads); 
       }); 
     }}).catch();};
module.exports = { getAllThreadsIPC }