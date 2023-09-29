const path=require('path');const fs=require('fs');
const {getAllThreadsIPC}=require('./getIPC.cjs');

async function deleteDataIPC(data, ol, wm) {
  if (data.straged === 'at Local DB') {
    const filePath = path.join(__dirname, '../localData.json');
    const fileData = await fs.promises.readFile(filePath,'utf-8');
    const allData = JSON.parse(fileData);
    const targetThreadIndex = allData.findIndex(thread => thread.id === data.id);
    if (targetThreadIndex !== -1) {
      const newAllData=[...allData.slice(0,targetThreadIndex),
        ...allData.slice(targetThreadIndex + 1)];
      await fs.promises.writeFile(filePath,JSON.stringify(newAllData,null,2));//jsonファイル保存形式をobjectにする(xxx,null, 2)
      return await getAllThreadsIPC(ol, wm);
  };};

  if (data.straged==='at Mongo DB'){
    try {
      const module = await import('../mngSchema.mjs');
      const Thread = await module.Thread; 
      const mongoData = await Thread.find({ _id: data.id });
      if (mongoData.length>0){await Thread.deleteOne({_id:data.id});}
      return await getAllThreadsIPC(ol,wm); 
    } catch (error) {console.log('error at deleteIPC ',error);};  
  };
};

async function exchangeDataIPC(renewData, ol, wm) {
  if (renewData.straged === 'at Local DB') {
    const filePath = path.join(__dirname, '../localData.json');
    const fileData = await fs.promises.readFile(filePath,'utf-8');
    const allData = JSON.parse(fileData);
    const targetThreadIndex = allData.findIndex(thread => thread.id === renewData.id);
    if (targetThreadIndex !== -1) {
      const targetThread = allData.splice(targetThreadIndex, 1)[0];
      const exchangedAllData = [...allData,targetThread];
      await fs.promises.writeFile(filePath, JSON.stringify(exchangedAllData, null, 2));
    }; return await getAllThreadsIPC(ol, wm);
  };

  if (renewData.straged === 'at Mongo DB') {
    const module = await import('../mngSchema.mjs');
    const Thread = await module.Thread; 
    const targetMNGData = await Thread.find({ _id: renewData.id });
    if (targetMNGData.length > 0) {
      const targetThread = targetMNGData[0];  
      const allThreads = await Thread.find({});
      const filteredThreads = allThreads.filter(thread => thread._id.toString() !== targetThread._id.toString());
      await Thread.deleteMany({});
      await Thread.insertMany([...filteredThreads, targetThread]);
    } return await getAllThreadsIPC(ol, wm);
  };
};
module.exports = { deleteDataIPC, exchangeDataIPC };