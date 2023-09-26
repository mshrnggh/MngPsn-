const path=require('path');const fs=require('fs');
const {getAllThreadsIPC}=require('./getIPC.cjs');

async function updateDataIPC(renewData, ol, wm) {
  if (renewData.straged === 'at Local DB') {
    const filePath = path.join(__dirname, '../localData.json');
    const fileData = await fs.promises.readFile(filePath,'utf-8');
    const allData = JSON.parse(fileData);
    const targetThreadIndex = allData.findIndex(thread => thread.id === renewData.id);
    if (targetThreadIndex !== -1) {
      const updatedThread={id:renewData.id,title:renewData.title,content:renewData.content,
        straged:renewData.straged,createdAt: new Date()};
      console.log('updatedThread IPC ', updatedThread);
      const newAllData = await [
        ...allData.slice(0, targetThreadIndex), updatedThread, ...allData.slice(targetThreadIndex + 1)
      ];
      await fs.promises.writeFile(filePath,JSON.stringify(newAllData,null,2));//jsonファイル保存形式をobjectにする(xxx,null, 2)
      return await getAllThreadsIPC(ol, wm);
  };};

  if (straged === 'at Mongo DB') {
    import('../mngSchema.mjs').then( async (module) => {
      const Thread = await module.Thread; let allThreads = [];
      const mongoData = await Thread.find({}, { _id: 1, title: 1, content: 1, straged: 1, createdAt: 1 });
      const targetThread = mongoData.find(thread => thread._id.toString() === id);
    if (targetThread) {
      targetThread.title = title;
      targetThread.content = content;
      targetThread.createdAt = Date.now();
      await targetThread.save();
    };
    //const newMNGData = await Thread.find({}, { _id: 1, title: 1, content: 1, straged: 1});
    return await getAllThreadsIPC(ol, wm);
  });};
};    
module.exports = { updateDataIPC };