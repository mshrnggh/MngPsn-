const path=require('path');const fs=require('fs');
let Thread;
import('../mngSchema.mjs').then((module) => { Thread = module.Thread; });

async function registLocal(ol, wm, event, data) {
  const filePath = path.join(__dirname, '../localData.json');
  const existinLclDB = await fs.promises.readFile(filePath, 'utf-8');
  const existinLclJ = JSON.parse(existinLclDB);
  const newDB = Array.isArray(existinLclJ) ? [...existinLclJ, data] : [data];
  await fs.promises.writeFile(filePath, JSON.stringify(newDB, null, 2));
  const newAllThre = await postReloadIPC(ol, wm, event); return newAllThre;   
};
async function registMongo(ol, wm, event, data) {
  const existingData = await Thread.find({ title: data.title });
  if(existingData.length>0){console.log('Data already exists in MongoDB');return;};
  const newMNGData=await new Thread({title:data.title,content:data.content,straged:data.straged,});
  await newMNGData.save();const newAllThre = await postReloadIPC(ol, wm, event);
  return newAllThre;
};
async function postReloadIPC(ol, wm, event){
try{let data,localData=[];					
if(ol===true){const filePath=path.join(__dirname,'../localData.json');					
const fileData=await fs.promises.readFile(filePath,'utf-8');localData=JSON.parse(fileData);data=await localData.slice(0,30);					
}else if(wm===true){					
const module = await import('../mngSchema.mjs')					
const Thread= await module.Thread; let allThreads=[];					
const mongoData=await Thread.find({},{_id:1,title:1,content:1,straged:1});					
 const mongoDataCount=await Thread.countDocuments();const mongoDataLimit=Math.min(mongoDataCount,30);					
 mongoData.splice(mongoDataLimit);data=[...mongoData];					
 const filePath=path.join(__dirname,'../localData.json');					
 const fileData=await fs.promises.readFile(filePath,'utf-8');localData=JSON.parse(fileData).slice(0,30);					
 data=await[...data,...localData.slice(0,30)];}					
 					
 if(data){data=await data.filter((thread)=>thread.id||thread._id).slice(0,30);allThreads=await data.map((thread)=>{					
 const id=thread.id||thread._id.toString();const title=thread.title||thread['title:']||'';					
 const content=thread.content||thread['content:'];const straged=thread.straged||thread['straged:'];					
 return{id,title,content,straged};});return allThreads; } else {return [];}					
}catch(err){console.error(err);return[];};};					

module.exports = {registLocal, registMongo};







