const fs=require("fs");const path=require("path");
async function getResearchIPC(ol, wm, keywords) {
  try{ let data,allThreads =[];
    if (ol === true) {
      const filePath = path.join(__dirname, '../localData.json');
      const fileData = await fs.promises.readFile(filePath,'utf-8');
      data =JSON.parse(fileData);
    } else if (wm === true) {
      const module = await import('../mngSchema.mjs')
      const Thread = await module.Thread;  
      const mongoData = await Thread.find({}, {_id:1,title:1,content:1,straged:1});    
      data = [...mongoData, ...data];
      const filePath = path.join(__dirname, '../localData.json');
      const fileData = await fs.promises.readFile(filePath,'utf-8');
      const localData = JSON.parse(fileData);
      data = [...data, ...localData];
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
      });allThreads=allThreads.slice(0,30); return(allThreads);
    }else{return([]);};

}catch(error){console.error(error);return([]);};};
module.exports = { getResearchIPC };