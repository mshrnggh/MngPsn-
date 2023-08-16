window.flipNotepad = flipNotepad;
const formSection = document.querySelector('.form-section');
formSection.addEventListener('submit', (event) => {
    event.preventDefault();
    formSection.addEventListener('submit', flipNotepad);
    const submitterId = event.submitter.id;
    console.log(submitterId);
    flipNotepad(event, submitterId);
});

function flipNotepad(event,submittedId) {
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
    setTimeout(() => {
      setTimeout(() => {
        formSection.classList.remove('flip');
        inputTitle.value = '';
        inputContent.value = '';
        formSection.style.display = 'block';
      }, 305);
    }, 50);
  },{once: true});

  event.target.removeEventListener('submit', flipNotepad);
  formSection.addEventListener('submit', flipNotepad);
  const formData = new FormData(formSection);
  const title = formData.get('inputTitle');
  const content = formData.get('inputContent');
  const note = { title, content };
  console.log(formData, title, content,submittedId);
  addNoteToDB(note, submittedId);
}}

function addNoteToDB(note, submittedId) {
  if (submittedId === 'submitLocal') {
    window.boardAPI.addNoteToLocalDB(note);
    
  } else if (submittedId === 'submitMongoDB') {
    window.boardAPI.addNoteToMongoDB(note);
  }
}