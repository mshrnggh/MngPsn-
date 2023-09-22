const path=require('path');const fs=require('fs');
async function getAllThreadsIPC(ol, wm) {return new Promise((resolve,reject)=>{
  try{console.log('getAllThreIPC is called, ol, wm ', ol, wm);
    import('../mngSchema.mjs').then( async (module) => {
      const Thread = await module.Thread; let allThreads = [];
      try{ let data=[];
        if (ol === true) {
          const filePath = path.join(__dirname, '../localData.json');
          const fileData = await fs.promises.readFile(filePath);
          const localData =JSON.parse(fileData);data=localData.slice(0,28);
        } else if (wm === true) {
          const mongoData = await Thread.find({}, { _id: 1, title: 1 });
          const mongoDataCount = await Thread.countDocuments();
          const mongoDataLimit = Math.min(mongoDataCount, 14);
          mongoData.splice(mongoDataLimit);data = [...mongoData, ...data];
          const filePath = path.join(__dirname, '../localData.json');
          const fileData = await fs.promises.readFile(filePath);
          const localData = JSON.parse(fileData);
          const localDataLimit = Math.min(28 - mongoDataLimit, localData.length);
          data = [...data, ...localData.slice(0, localDataLimit)];
        } 
          data = await data.filter((thread) => thread.id || thread._id).slice(0, 28);
          allThreads = await data.map((thread) => {
            const id = thread.id || thread._id.toString();
            const title=thread.title||thread['title:']||'';return{id,title};
          });
          console.log('filtered getAllThreIPC ', allThreads); resolve(allThreads);
        } catch(err){console.error(error);resolve([]);}
      });}catch(error){console.error(error);reject(error);}
});};
module.exports = { getAllThreadsIPC }