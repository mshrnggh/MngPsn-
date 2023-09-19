const {ipcMain}=require('electron');const path=require('path');const fs=require('fs');

async function getResearchIPC(ol, wm, keywords) {return new Promise((resolve,reject)=>{
    try{ 
    import('../mngSchema.mjs').then(async(module) => {
      const Thread = await module.Thread; let allThreads =[]; let data=[];
        if (ol === true) {
          const filePath = path.join(__dirname, '../localData.json');
          const fileData = await fs.promises.readFile(filePath);
          const localData =JSON.parse(fileData);data=localData.slice(0,28);
        } else if (wm === true) {
          const mongoData = await Thread.find({}, { _id: 1, title: 1 });
          const mongoDataCount = await Thread.countDocuments();
          const mongoDataLimit = Math.min(mongoDataCount, 14);
          mongoData.splice(mongoDataLimit); data = [...mongoData, ...data];
          const filePath = path.join(__dirname, '../localData.json');
          const fileData = await fs.promises.readFile(filePath);
          const localData = JSON.parse(fileData);
          const localDataLimit = Math.min(28 - mongoDataLimit, localData.length);
          data = [...data, ...localData.slice(0, localDataLimit)];
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
          return { id, title };
        });

        console.log('filtered getAllThreIPC ', allThreads);
        resolve(allThreads);
      });
    } catch (error) {
      console.log('error at getResearchIPC ', error);
      reject(error);
    }

  });
};

module.exports = { getResearchIPC };