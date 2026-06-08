// js/site-meta.js – opdaterer live meta-badges på statiske sider

document.addEventListener('DOMContentLoaded', () => {
  if (!window.SiteStats) return;

  const full = document.body?.dataset?.siteMeta === 'full';
  const needsCounts = full
    || document.getElementById('om-politician-count')
    || document.getElementById('kontakt-politician-count');

  if (!needsCounts) {
    SiteStats.setText('site-updated-label', `Opdateret ${SiteStats.formatDaDate()}`);
    return;
  }

  SiteStats.applySiteMeta({ full }).catch(err => {
    console.warn('[site-meta] Kunne ikke opdatere live meta:', err);
  });
});