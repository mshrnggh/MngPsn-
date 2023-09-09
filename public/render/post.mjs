window.flipNotepad = flipNotepad;
const formSection = document.querySelector('.form-section');
formSection.addEventListener('submit', async (event) => {
    event.preventDefault();
    formSection.addEventListener('submit', flipNotepad);
    const submitterId = event.submitter.id;
    await flipNotepad(event, submitterId);
});

async function flipNotepad(event, submittedId) {
  if (!event || event.submitter.nodeName !== 'BUTTON') {
     return;
   } else { 
     const formSection = document.querySelector('.form-section');
     if (!formSection) {
       console.error('formSection not found');
       return;
   }
  const inputTitle = document.querySelector('#inputTitle');
  const inputContent = document.querySelector('#inputContent');
  formSection.classList.add('flip');

  formSection.addEventListener('transitionend', (event) => {
    event.preventDefault();
    formSection.style.display = 'none';
    setTimeout( () => {
      setTimeout( () => {
        formSection.classList.remove('flip');
        inputTitle.value = '';
        inputContent.value = '';
        formSection.style.display = 'block';
      }, 305);
    }, 50);
  }, {once: true});

  event.target.removeEventListener('submit', flipNotepad);
  formSection.addEventListener('submit', flipNotepad);
  const formData = new FormData(formSection);
  const title = formData.get('inputTitle');
  const content = formData.get('inputContent');
  const note = { title, content };
  let ol = false;
  let wm = false;
  await window.postAPI.send('get-DBdata');
  await window.postAPI.receive('get-DBdata', async (data) => {
    ol = data.a; wm = data.b;
    await addToDB(note, submittedId, ol, wm);
  });
}}

async function addToDB(note, submittedId, ol, wm) {
  console.log('note, submittedId, ol, wm at addToDB ', note, submittedId, ol, wm);
  if (submittedId === 'submitLocal') {
    const newAllThre = await window.postAPI.addToLocalDB(note);
    await showReloadList( ol, wm, newAllThre );
  } else if (submittedId === 'submitMongoDB') {
    const newAllThre = await window.postAPI.addToMongoDB(note);
    await showReloadList( ol, wm, newAllThre );
  }; 
}

async function showReloadList( ol, wm, data ) {
  try { console.log('ol, wm at reloaNewDatamjs ', ol, wm, data);
    const threadSection = document.querySelector('.thread-section');
    while (threadSection.firstChild) {threadSection.removeChild(threadSection.firstChild);}
    const allReloadThre = await createReloadList(data, ol, wm);
    console.log('allReloadThre in postmjs', allReloadThre);
    threadSection.appendChild(allReloadThre);
  } catch (err) { console.log('err at postmjs ', err);};
};

async function createReloadList(data, ol, wm) {
  try {
    const allThreadsarr = Array.isArray(data) ? data : [data];
    console.log('allThreadsarr at reloadBoard ', allThreadsarr);
    const boardList = await document.createElement('div');
    boardList.classList.add('board-list');
    for (const thread of allThreadsarr) {
      //console.log('thread at createBoardList ', thread, thread.title);
      const boardItem = await document.createElement('div');
      await boardItem.classList.add('singleThread');
      boardItem.textContent = thread.title;
      await boardList.appendChild(boardItem);
    }
    return boardList;
  } catch (err) {
    console.log('err at createBoardList ', err);
  }
};