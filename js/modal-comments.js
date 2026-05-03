// js/modal-comments.js - Kommentarer

function postComment(scandalId) {
  const input = document.getElementById(`comment-input-${scandalId}`);
  if (!input || !input.value.trim()) return;

  const key = `comments_${scandalId}`;
  const comments = JSON.parse(localStorage.getItem(key) || '[]');
  
  comments.push({
    text: input.value.trim(),
    date: new Date().toLocaleDateString('da-DK') + ' ' + new Date().toLocaleTimeString('da-DK', {hour: '2-digit', minute:'2-digit'})
  });
  
  localStorage.setItem(key, JSON.stringify(comments));
  input.value = '';
  
  // Genindlæs modalen
  const modal = document.getElementById('politicianModal');
  const politicianId = parseInt(modal.dataset.currentPoliticianId);
  if (politicianId) {
    showPoliticianModal(politicianId);
  }
}