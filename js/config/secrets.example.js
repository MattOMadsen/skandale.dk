// Kopier denne fil til secrets.js og udfyld dine egne værdier.
// secrets.js er i .gitignore og må ALDRIG committes til git.
//
// Supabase:
//   - anonKey er OK i frontend (beskyttes af Row Level Security)
//   - service_role key må ALDRIG stå her — kun på server/Edge Functions
//
// Efter kopiering: tilføj <script src="js/config/secrets.js"></script> før admin/supabase scripts.

window.SKANDALE_SECRETS = {
  adminPassword: 'SKIFT_MIG',

  supabase: {
    url: 'https://DIT_PROJEKT.supabase.co',
    publishableKey: 'sb_publishable_...'
  }
};