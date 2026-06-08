// js/site-meta.js – opdaterer live meta-badges på statiske sider

document.addEventListener('DOMContentLoaded', () => {
  if (!window.SiteStats) return;

  const full = document.body?.dataset?.siteMeta === 'full';
  SiteStats.applySiteMeta({ full }).catch(err => {
    console.warn('[site-meta] Kunne ikke opdatere live meta:', err);
  });
});