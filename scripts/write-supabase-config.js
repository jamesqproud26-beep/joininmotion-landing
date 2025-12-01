// scripts/write-supabase-config.js
// Writes `supabase-config.js` at build time from environment variables.
// Intended to run in CI (Netlify) where SUPABASE_URL and SUPABASE_ANON_KEY are set.
// Do NOT commit the generated `supabase-config.js` to source control.

const fs = require('fs');
const path = require('path');

const url = process.env.SUPABASE_URL || '';
const anonKey = process.env.SUPABASE_ANON_KEY || '';

if (!url || !anonKey) {
  console.error('ERROR: SUPABASE_URL and SUPABASE_ANON_KEY must be set as environment variables.');
  process.exit(1);
}

const out = `// This file is generated at build time. Do NOT commit to git.
window.SUPABASE_CONFIG = {
  url: ${JSON.stringify(url)},
  anonKey: ${JSON.stringify(anonKey)}
};
`;

const outPath = path.join(process.cwd(), 'supabase-config.js');
fs.writeFileSync(outPath, out, { mode: 0o600 });
console.log('supabase-config.js written to', outPath);
