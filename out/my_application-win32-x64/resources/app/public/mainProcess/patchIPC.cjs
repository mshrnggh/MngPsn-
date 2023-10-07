const path=require('path');const fs=require('fs');
const {getAllThreadsIPC} = require('./getIPC.cjs');

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
  };};
  if (renewData.straged === 'at Mongo DB') {
    const title = renewData.title, content = renewData.content, straged = renewData.straged;
    import('../mngSchema.mjs').then( async (module) => {
      const Thread = await module.Thread; 
      const renewMNGData = await Thread.findOneAndUpdate(
      { _id: renewData.id },
      { $set: { title, content, straged, createdAt: Date.now() } },
      { new: true }
      );    
      console.log('renewMNGData updataIPC', renewMNGData);  
      const mongoData = await Thread.find({}, { _id: 1, title: 1, content: 1, straged: 1, createdAt: 1 });
      return await getAllThreadsIPC(mongoData, ol, wm);
    });
  };
};

module.exports = { updateDataIPC };
