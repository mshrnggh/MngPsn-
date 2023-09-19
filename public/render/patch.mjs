document.addEventListener('click', event => {
  if (event.target.matches('.singleThread')) {
    const singleThreads = document.querySelectorAll('.singleThread');
    singleThreads.forEach(singleThread => {
      if (singleThread === event.target) {
        if (singleThread.classList.contains('locked')) {
          singleThread.classList.remove('locked');
        } else { singleThreads.forEach(otherSingleThread => {
            if (otherSingleThread !== singleThread) {
              otherSingleThread.classList.remove('locked');
            }});singleThread.classList.add('locked');
}}});}});
