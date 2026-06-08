// js/supabase-data.js — delt Supabase-logik med localStorage-fallback

(function() {
  'use strict';

  function getApiKey() {
    const cfg = window.SKANDALE_SECRETS?.supabase || {};
    return cfg.publishableKey || cfg.anonKey || '';
  }

  function getScandalKey(index) {
    const el = document.getElementById(`user-severity-container-${index}`);
    if (el?.dataset.polId && el?.dataset.scId) {
      return `${el.dataset.polId}_${el.dataset.scId}`;
    }
    return `index_${index}`;
  }

  function getVoterId() {
    const key = 'skandale_voter_id';
    let id = localStorage.getItem(key);
    if (!id) {
      id = (crypto.randomUUID && crypto.randomUUID()) ||
        `v_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(key, id);
    }
    return id;
  }

  function formatDate(isoOrDate) {
    const d = new Date(isoOrDate);
    return d.toLocaleDateString('da-DK') + ' ' +
      d.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });
  }

  async function useSupabase() {
    return window.SkandaleSupabase?.isEnabled?.() && await window.SkandaleSupabase.getClient();
  }

  window.SkandaleData = {
    getScandalKey,
    getVoterId,
    formatDate,

    async fetchComments(scandalKey) {
      const client = await useSupabase();
      if (!client) {
        const legacy = JSON.parse(localStorage.getItem(`comments_${scandalKey}`) || '[]');
        return legacy.map(c => ({ body: c.text, created_at: c.date }));
      }

      const { data, error } = await client
        .from('scandal_comments')
        .select('body, created_at')
        .eq('scandal_key', scandalKey)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.warn('[SkandaleData] Kommentarer:', error.message);
        return [];
      }
      return data || [];
    },

    async postComment(scandalKey, text) {
      const client = await useSupabase();
      if (!client) {
        const key = `comments_${scandalKey}`;
        const comments = JSON.parse(localStorage.getItem(key) || '[]');
        comments.push({ text, date: formatDate(new Date()) });
        localStorage.setItem(key, JSON.stringify(comments));
        return true;
      }

      const { error } = await client.from('scandal_comments').insert({
        scandal_key: scandalKey,
        body: text.trim()
      });

      if (error) {
        console.error('[SkandaleData] Kunne ikke gemme kommentar:', error.message);
        return false;
      }
      return true;
    },

    async fetchSeverityRatings(scandalKey) {
      const client = await useSupabase();
      if (!client) {
        const ratings = JSON.parse(localStorage.getItem(`communityRatings_${scandalKey}`) || '[]');
        return { ratings, voterRating: null };
      }

      const voterId = getVoterId();
      const { data, error } = await client
        .from('scandal_severity_ratings')
        .select('rating, voter_id')
        .eq('scandal_key', scandalKey);

      if (error) {
        console.warn('[SkandaleData] Bedømmelser:', error.message);
        return { ratings: [], voterRating: null };
      }

      const rows = data || [];
      return {
        ratings: rows.map(r => r.rating),
        voterRating: rows.find(r => r.voter_id === voterId)?.rating || null
      };
    },

    async saveSeverityRating(scandalKey, rating) {
      const client = await useSupabase();
      if (!client) {
        localStorage.setItem(`userSeverity_${scandalKey}`, rating);
        const key = `communityRatings_${scandalKey}`;
        const ratings = JSON.parse(localStorage.getItem(key) || '[]');
        ratings.push(rating);
        localStorage.setItem(key, JSON.stringify(ratings));
        return true;
      }

      const { error } = await client.from('scandal_severity_ratings').upsert(
        {
          scandal_key: scandalKey,
          rating,
          voter_id: getVoterId(),
          updated_at: new Date().toISOString()
        },
        { onConflict: 'scandal_key,voter_id' }
      );

      if (error) {
        console.error('[SkandaleData] Kunne ikke gemme bedømmelse:', error.message);
        return false;
      }
      return true;
    },

    async removeSeverityRating(scandalKey) {
      const client = await useSupabase();
      if (!client) {
        localStorage.removeItem(`userSeverity_${scandalKey}`);
        return true;
      }

      const { error } = await client
        .from('scandal_severity_ratings')
        .delete()
        .eq('scandal_key', scandalKey)
        .eq('voter_id', getVoterId());

      if (error) {
        console.error('[SkandaleData] Kunne ikke slette bedømmelse:', error.message);
        return false;
      }
      return true;
    },

    isLive() {
      return Boolean(getApiKey() && window.SKANDALE_SECRETS?.supabase?.url);
    }
  };
})();