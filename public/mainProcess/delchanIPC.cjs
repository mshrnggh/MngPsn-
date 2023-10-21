const {ipcMain} = require('electron');
const {getAllThreadsIPC}=require('./getIPC.cjs');

async function deleteDataIPC(delData, ol, wm, bW) {
  return new Promise(async(resolve,reject)=>{let data=[];
  //servercjsを見ると、代入形式(const data = deleteDataIPC())であり、11行目のipcMain.onが非同期なので、
  //タイミング差を考慮してreturn new Promise化しないと同期、非同期のタイミング差で値が取得できない。  
    if (delData.straged === 'at Local DB') {
      await ipcMain.removeAllListeners('delete-lclStrg');
      ipcMain.on('delete-lclStrg',async(event,...args)=>{data=args[0];
        if (!Array.isArray(delData)) {delData = [delData];}; 
        // delDataが配列である場合にのみfindIndexメソッドを使用する
        //Array.isArray()は、一つのまとまったメソッド表現。最初のArrayは、Javascriptのビルトインオブジェクトインスタンス
        if(Array.isArray(delData)){const delTrgtIndx=await data.findIndex(thread=>thread.id===delData[0].id);
        //thread引数は、data変数の中の複数のobjectを巡回監視するので、thread.idで表現する
        //一方比較対象のdelData配列には1つのobjectしか存在しないが、配列である為delData[0].idで表現する
        if(delTrgtIndx!==-1){await event.sender.send('delete-lclStrg',delTrgtIndx);};};   
        //12行目ipcMain.on('get-lslStrg-reply'のチャンネルとは異なるところに返信するので、event.replyでは、
        //channelが同一になると判断されてしまい、25行目のresolve(getAllThreadsIPC());が実行されるまで、
        //rendering file側のipcRenderer.onに相当する部分が受信が一瞬遅れてしまうだけで、argsが取得できない問題が
        //rendering側で発生してしまう。　その為、event.sender.send, window.webContents.sendを使用する。 
        resolve(getAllThreadsIPC(ol,wm,bW));
      });

  } else if (delData.straged==='at Mongo DB'){
    try {
      const {Thread} = await import('../mngSchema.mjs');
      const mongoData = await Thread.find({ _id: delData.id });
      if (mongoData.length>0){await Thread.deleteOne({_id:delData.id});}
    } catch (error) {reject([]);};
    resolve(getAllThreadsIPC(ol,wm,bW));
  }  
})};

async function exchangeDataIPC(exchData, ol, wm, bW) {
  return new Promise(async(resolve,reject)=>{let data=[];
  //servercjsを見ると、代入形式(const data = exchangeDataIPC())であり、かつ本ファイル43行目のipcMain.onが非同期なので、
  //タイミング差を考慮してreturn new Promise化しないと同期、非同期のタイミング差で値が取得できない。  
    if (exchData.straged === 'at Local DB') {
      await ipcMain.removeAllListeners('exch-lclStrg');
      ipcMain.on('exch-lclStrg',async(event,...args)=> {data=args[0];
        if(!Array.isArray(exchData)) {exchData = [exchData];}; 
        if(Array.isArray(exchData)){const exchIndx=data.findIndex(thread=>thread.id===exchData[0].id);
        if(exchIndx!==-1){await event.reply('exch-lclStrg',exchIndx);};};                  
      resolve(getAllThreadsIPC(ol, wm, bW));});
  
    } else if (exchData.straged === 'at Mongo DB') {
      const {Thread} = await import('../mngSchema.mjs');
      const targetMNGData = await Thread.find({ _id: exchData.id });
      if (targetMNGData.length > 0) {
        const targetThread = targetMNGData[0];  
        const allThreads = await Thread.find({});
        const filteredThreads = allThreads.filter(thread => thread._id.toString() !== targetThread._id.toString());
        await Thread.deleteMany({});
        await Thread.insertMany([...filteredThreads, targetThread]);
      } resolve(getAllThreadsIPC(ol, wm, bW));
    } else { reject(); };
});};
module.exports = { deleteDataIPC, exchangeDataIPC };