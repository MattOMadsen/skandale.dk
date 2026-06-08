// Supabase-klient — aktiveres når url + anonKey er sat i js/config/secrets.js
// Bruges senere til delt afstemning og kommentar-moderation.

(function() {
  'use strict';

  let client = null;
  let loadPromise = null;

  function getConfig() {
    const cfg = window.SKANDALE_SECRETS?.supabase || {};
    return {
      url: (cfg.url || '').replace(/\.supabase\.com\b/i, '.supabase.co'),
      apiKey: cfg.publishableKey || cfg.anonKey || ''
    };
  }

  async function loadLibrary() {
    if (loadPromise) return loadPromise;
    loadPromise = import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.8/+esm');
    return loadPromise;
  }

  window.SkandaleSupabase = {
    isEnabled() {
      const { url, apiKey } = getConfig();
      return Boolean(url && apiKey);
    },

    async getClient() {
      if (!this.isEnabled()) return null;
      if (client) return client;

      const { url, apiKey } = getConfig();
      const { createClient } = await loadLibrary();
      client = createClient(url, apiKey);
      return client;
    }
  };
})();