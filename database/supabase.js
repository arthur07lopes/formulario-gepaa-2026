/*
 * GEPAA 2026 — Inicialização do Supabase no navegador.
 * Preencha projectUrl e publishableKey no painel do Supabase.
 * A publishable key pode ser pública SOMENTE com RLS configurado pelo schema.sql.
 * Nunca coloque uma secret key ou service_role key neste arquivo.
 */
window.GEPAA_SUPABASE_CONFIG = window.GEPAA_SUPABASE_CONFIG || {
  projectUrl: "",
  publishableKey: ""
};

(function initializeGepaaSupabase() {
  const config = window.GEPAA_SUPABASE_CONFIG;
  const validUrl = typeof config.projectUrl === "string" && /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(config.projectUrl.trim());
  const validKey = typeof config.publishableKey === "string" && config.publishableKey.trim().startsWith("sb_publishable_");

  if (!window.supabase || !validUrl || !validKey) {
    window.gepaaSupabase = null;
    return;
  }

  window.gepaaSupabase = window.supabase.createClient(
    config.projectUrl.trim(),
    config.publishableKey.trim(),
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
      }
    }
  );
})();
