// supabase-config.example.js
// Copy this file to `supabase-config.js` and fill in your project's values.
// Keep your real anon key private; don't commit `supabase-config.js` to a public repo.

window.SUPABASE_CONFIG = {
  // Example: 'https://xyzabc123.supabase.co'
  url: 'https://your-project-ref.supabase.co',

  // Example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...'
  // This should be your anon/public key for client-side usage.
  anonKey: 'your-anon-key-here'
};

/*
  Security note:
  - This file lives in the browser; anyone can view the anon key in network or source view.
  - Supabase anon keys are intended for client usage with RLS (row level security) enabled.
  - For production, configure RLS and policies so users can only perform allowed operations.
*/
