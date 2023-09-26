const fs=require("fs");const path=require("path");
async function getResearchIPC(ol, wm, keywords) {return new Promise((resolve,reject)=>{
  try{ 
    import('../mngSchema.mjs').then(async(module) => {
      const Thread = await module.Thread; let allThreads =[]; 
      try{ let data=[];
        if (ol === true) {
          const filePath = path.join(__dirname, '../localData.json');
          const fileData = await fs.promises.readFile(filePath,'utf-8');
          data =JSON.parse(fileData);
        } else if (wm === true) {
          const mongoData = await Thread.find({}, {_id:1,title:1,content:1,straged:1});
          const mongoDataCount = await Thread.countDocuments();
          const mongoDataLimit = Math.min(mongoDataCount, 28);
          mongoData.splice(mongoDataLimit); data = [...mongoData, ...data];
          const filePath = path.join(__dirname, '../localData.json');
          const fileData = await fs.promises.readFile(filePath,'utf-8');
          const localData = JSON.parse(fileData);
          //const localDataLimit = Math.min(28 - mongoDataLimit, localData.length);
          data = [...data, ...localData.slice(0, 28)];
        }
       
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
        allThreads = filteredData.map((thread) => {
          const id = thread.id || thread._id.toString();
          const title = thread.title || thread['title:'] || '';
          const content = thread.content || thread['content:'];
          const straged = thread.straged || thread['straged:']; 
          return { id, title, content, straged };
        }); resolve(allThreads);
       }catch(error){console.error(error);resolve([]);}
    });}catch(error){console.log('error at searchIPC ', error);reject(error);}
});};
module.exports = { getResearchIPC };