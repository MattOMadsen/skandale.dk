// js/om-stats.js – om.html bruger fælles SiteStats (fuld aggregering)

document.addEventListener('DOMContentLoaded', () => {
  if (!window.SiteStats) return;
  SiteStats.applySiteMeta({ full: true }).catch(err => {
    console.warn('[om-stats] Kunne ikke hente live stats:', err);
  });
});