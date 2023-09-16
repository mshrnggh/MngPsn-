const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
searchButton.addEventListener('click', () => {
  const keywords = searchInput.value.trim().split(/\s+/);
  const threadSection = document.querySelector('.thread-section');
  threadSection.innerHTML = '';
  threads.forEach((thread) => {
    const title = thread.title.toLowerCase();
    if (keywords.some((keyword) => title.includes(keyword.toLowerCase()))) {
      const threadElement = createThreadElement(thread);
      threadSection.appendChild(threadElement);
    }
  });
});