const {ipcMain}=require('electron'); 
let Thread; let data=[];
import('../mngSchema.mjs').then((module) => { Thread = module.Thread; });

async function registMongo(ol, wm, event, data) {
  const existingData = await Thread.find({ title: data.title });
  if(existingData.length>0){console.log('Data already exists in MongoDB');return;};
  const newMNGData=await new Thread({title:data.title,content:data.content,straged:data.straged,});
  await newMNGData.save();const newAllThre = await postReloadIPC(ol, wm, event);
  return newAllThre;
};
async function postReloadIPC(ol, wm, event){
  try { let data, lclStrg=[];		
    event.sender.send('get-lclStrg');ipcMain.removeAllListeners('get-lclStrg-reply');
    ipcMain.on('get-lclStrg-reply',async (event,...args)=>{lclStrg = args[0]; 
      console.log('data1 ', data); data=[...lclStrg.slice(0,30)];} 
    ); 

    if(wm===true){ let allThreads=[];					
      const {Thread} = await import('../mngSchema.mjs')					
      const mongoData=await Thread.find({},{_id:1,title:1,content:1,straged:1});					
      const mongoDataCount=await Thread.countDocuments();const mongoDataLimit=Math.min(mongoDataCount,30);					
      mongoData.splice(mongoDataLimit);console.log("data2 ", data);
      data=[...mongoData, data]; console.log("data3 ", data);					
  };

  if(data){data=await data.filter((thread)=>thread.id||thread._id).slice(0,30);allThreads=await data.map((thread)=>{					
  const id=thread.id||thread._id.toString();const title=thread.title||thread['title:']||'';					
  const content=thread.content||thread['content:'];const straged=thread.straged||thread['straged:'];					
  return{id,title,content,straged};});return allThreads; } else {return [];}					
}catch(err){console.error(err);return[];};};					

module.exports = {registMongo};







