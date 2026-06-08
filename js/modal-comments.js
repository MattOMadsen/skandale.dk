// js/modal-comments.js — Kommentarer (Supabase + localStorage-fallback)

async function loadCommentsForScandal(index) {
  const list = document.getElementById(`comments-list-${index}`);
  if (!list || !window.SkandaleData) return;

  const scandalKey = SkandaleData.getScandalKey(index);
  list.innerHTML = '<p class="text-xs text-slate-400 italic">Indlæser kommentarer...</p>';

  const comments = await SkandaleData.fetchComments(scandalKey);

  if (!comments.length) {
    list.innerHTML = '<p class="text-xs text-slate-400 italic">Ingen kommentarer endnu. Vær den første.</p>';
    return;
  }

  list.innerHTML = comments.map(c => `
    <div class="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
      <p class="text-slate-700 dark:text-slate-200">${escapeHtml(c.body)}</p>
      <p class="text-[10px] text-slate-400 mt-1">${typeof c.created_at === 'string' && c.created_at.includes('T')
        ? SkandaleData.formatDate(c.created_at) : (c.created_at || '')}</p>
    </div>
  `).join('');
}

async function postComment(scandalIndex) {
  const input = document.getElementById(`comment-input-${scandalIndex}`);
  if (!input || !input.value.trim() || !window.SkandaleData) return;

  const text = input.value.trim();
  const scandalKey = SkandaleData.getScandalKey(scandalIndex);
  const btn = input.nextElementSibling;

  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Sender...';
  }

  const ok = await SkandaleData.postComment(scandalKey, text);

  if (btn) {
    btn.disabled = false;
    btn.textContent = 'Send';
  }

  if (!ok) {
    alert('Kunne ikke gemme kommentaren. Prøv igen.');
    return;
  }

  input.value = '';
  await loadCommentsForScandal(scandalIndex);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

window.loadCommentsForScandal = loadCommentsForScandal;
window.postComment = postComment;