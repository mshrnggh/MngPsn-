const {ipcMain} = require('electron');
const {getAllThreadsIPC} = require('./getIPC.cjs');
async function updateDataIPC(renewData, ol, wm, bW) {
  //servercjs190行目は、await updateDataIPC(renewData, ol, wm, bW);と言う形は、
  //代入形式（const data = await updateDataIPC(renewData, ol, wm, bW);）では無いので、
  //今回は、return new Promise化は必要ない。
  if (renewData.straged==='at Local DB'){
    await bW.webContents.removeAllListeners('get-lclStrg');
    await bW.webContents.send('get-lclStrg');
    await ipcMain.removeAllListeners('get-lclStrg-reply');
      ipcMain.on('get-lclStrg-reply', async(event,...args)=>{data=args[0];
        const targetThreadIndex=data.findIndex(thread=>thread.id===renewData.id);
        if (targetThreadIndex!==-1){
          const updatedThread={id:renewData.id,title:renewData.title,content:renewData.content,
          straged:renewData.straged,createdAt:new Date()};
          await event.reply('update-lclStrg',updatedThread,ol,wm);          
          return await getAllThreadsIPC(ol,wm,bW);  
    };});
  } else if (renewData.straged==='at Mongo DB'){
    const title=renewData.title, content=renewData.content,straged=renewData.straged;
    import('../mngSchema.mjs').then(async(module)=>{
      const Thread = await module.Thread; 
      await Thread.findOneAndUpdate({_id:renewData.id },
        {$set:{title,content,straged,createdAt:Date.now()}},{new:true}
      ); return await getAllThreadsIPC(ol, wm, bW);
});};};
module.exports = { updateDataIPC };
