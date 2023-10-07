const path=require('path');const fs=require('fs');
async function getAllThreadsIPC(ol, wm) {return new Promise((resolve,reject)=>  {
  let allThreads = []; let data=[];
  try{
    if (wm === true) {
      import('../mngSchema.mjs').then( async (module) => {
        const Thread = await module.Thread; 
        const lclDataPath = path.join(__dirname, '../localData.json');
        const localData = await fs.promises.readFile(lclDataPath,'utf-8');
        data = JSON.parse(localData);
        const mongoData = await Thread.find({}, { _id: 1, title: 1, content: 1, straged: 1 });
        const mongoDataCount = await Thread.countDocuments();
        const mongoDataLimit = Math.min(mongoDataCount, 28);
        mongoData.splice(mongoDataLimit); 
        data = [...mongoData, ...data]; data = data.slice(0, 28);
        allThreads = data.map((thread) => {
            const id = thread.id || thread._id && thread._id.toString();
            const title = thread.title || thread['title:'] || '';
            const content = thread.content || thread['content:'];
            const straged = thread.straged || thread['straged:'];
            return { id, title, content, straged };
        }); resolve(allThreads);
      });
     } else if (ol === true) { (async ()=> {
       const lclDataPath = path.join(__dirname, '../localData.json');
       const localData = await fs.promises.readFile(lclDataPath,'utf-8');
       data = JSON.parse(localData); 
       allThreads = await data.map((thread) => {
         const id = thread.id || thread._id && thread._id.toString();
         const title = thread.title||thread['title:']||'';
         const content = thread.content || thread['content:']; 
         const straged = thread.straged || thread['straged:'];
         return {id,title,content,straged};
       }); resolve(allThreads);
     })();
  } 
} catch (error) {console.error(error);reject(error);}
});};

module.exports = { getAllThreadsIPC }