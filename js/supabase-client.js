// Supabase-klient — aktiveres når url + anonKey er sat i js/config/secrets.js
// Bruges senere til delt afstemning og kommentar-moderation.

(function() {
  'use strict';

  let client = null;
  let loadPromise = null;

  function getConfig() {
    return window.SKANDALE_SECRETS?.supabase || {};
  }

  async function loadLibrary() {
    if (loadPromise) return loadPromise;
    loadPromise = import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.8/+esm');
    return loadPromise;
  }

  window.SkandaleSupabase = {
    isEnabled() {
      const { url, anonKey } = getConfig();
      return Boolean(url && anonKey);
    },

    async getClient() {
      if (!this.isEnabled()) return null;
      if (client) return client;

      const { url, anonKey } = getConfig();
      const { createClient } = await loadLibrary();
      client = createClient(url, anonKey);
      return client;
    }
  };
})();