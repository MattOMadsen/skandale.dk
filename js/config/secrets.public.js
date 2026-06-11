// Offentlig deploy-stub (ingen hemmeligheder).
window.SKANDALE_SECRETS = window.SKANDALE_SECRETS || {
  adminPassword: null,
  supabase: {
    url: '',
    publishableKey: ''
  }
};

// Lokal override: js/config/secrets.js (gitignored) indlæses hvis den findes
(function() {
  fetch('js/config/secrets.js')
    .then((res) => (res.ok ? res.text() : ''))
    .then((code) => {
      if (!code || code.includes('<!DOCTYPE')) return;
      try {
        new Function(code)();
      } catch (err) {
        console.warn('[secrets] Kunne ikke indlæse lokal secrets.js:', err);
      }
    })
    .catch(() => {});
})();