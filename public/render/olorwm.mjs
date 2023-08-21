// @ts-nocheck
document.addEventListener('DOMContentLoaded', async () => {
  let onMongoButtonAdd = null;
  let onMongoButtonRemove = null;
  const data = await boardAPI.getData();
  const olBClicked = data.olocalButtonClicked;
  const wmBClicked = data.wmngdbButtonClicked;
  
  if (olBClicked === true) {
  window.boardAPI.removeMongoButton();
  window.boardAPI.addMongoButton('UseMongo');
  } 

 const useMongo = document.getElementById('to_mongoConfig');
 if (useMongo!==null){
   useMongo.addEventListener('click', () => {
   window.boardAPI.send('useMongoDB');
   }); 
 }
});
  