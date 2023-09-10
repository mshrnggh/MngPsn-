window.flipNotepad = flipNotepad;
const formSection = document.querySelector('.form-section');
formSection.addEventListener('submit', async (event) => {
    event.preventDefault();
    formSection.addEventListener('submit', flipNotepad);
    const submitterId = event.submitter.id;
    await flipNotepad(event, submitterId);
});
async function flipNotepad(event, submittedId) {
  if (!event || event.submitter.nodeName !== 'BUTTON') { return;
   } else { 
     const formSection = document.querySelector('.form-section');
     if (!formSection) { console.error('formSection not found'); return; };
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
}};
async function addToDB(note, submittedId, ol, wm) {
  if (submittedId === 'submitLocal') {
    const newAllThre = await window.postAPI.addToLocalDB(note);
    await showReloadList( ol, wm, newAllThre );
  } else if (submittedId === 'submitMongoDB') {
    const newAllThre = await window.postAPI.addToMongoDB(note);
    await showReloadList( ol, wm, newAllThre );
  }; 
}
async function showReloadList( ol, wm, data ) {
  try { 
    const threadSection = document.querySelector('.thread-section');
    while (threadSection.firstChild) {threadSection.removeChild(threadSection.firstChild);}
    const allReloadThre = createReloadList(data, ol, wm);
    console.log('allReloadThre in postmjs', allReloadThre);
    threadSection.appendChild(allReloadThre);
    await createReloadColumns(allReloadThre);
  } catch (err) { console.log('err at postmjs ', err);};
};
function createReloadList(data, ol, wm) {
  const allThreadsarr = Array.isArray(data) ? data : [data];
  const boardList = document.createElement('div');
  boardList.classList.add('board-list');
  for (const thread of allThreadsarr) {
    const boardItem = document.createElement('div');
    boardItem.classList.add('singleThread');
    boardItem.textContent = thread.title;
    boardList.appendChild(boardItem);
  }; return boardList;
};  

async function createReloadColumns(allThreads) {
  const threadItems = allThreads.querySelectorAll('.singleThread');
  const threadItemsArray = Array.from(threadItems);
  const threadColumns = [[], [], []];
  threadItemsArray.forEach((item, index) => {
    threadColumns[index % 3].push(item);
  });
  const boardColumns = await document.createElement('div');
  boardColumns.classList.add('board-columns');
  for (const column of threadColumns) {
    const boardColumn = await document.createElement('div');
    boardColumn.classList.add('board-column');
    for (const threadItem of column) {
      await boardColumn.appendChild(threadItem);
    }
    await boardColumns.appendChild(boardColumn);
  }
  const threadSection = document.querySelector('.thread-section');
  threadSection.innerHTML = '';
  threadSection.appendChild(boardColumns);
}