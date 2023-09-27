  export async function dragStart(event) {
    console.log('dragStart', this.className, this.dataset.title);
    event.dataTransfer.setData('text/plain', JSON.stringify({
      id:this.dataset.id, title:this.dataset.title, content:this.dataset.content, 
      straged:this.dataset.straged, value: this.value}));
    setTimeout(() => {this.className += ' ondrag';}, 0);
    event.currentTarget.style.opacity = '1';
    console.log('dragStart done', this.className);
  }

  export async function dragEnd(event) {
    console.log('dragEnd called', this.className);
    event.currentTarget.style.opacity = '1';
    this.className = 'singleThread';
    console.log('dragEnd done', this.className);
  }
