/*
  Waitlist form handler with Supabase integration.

  Instructions:
  - Copy `supabase-config.example.js` to `supabase-config.js` and fill with your
    Supabase project URL and anon key (do NOT publish the anon key in a public repo).
  - Create a table named `subscribers` in your Supabase database with at least:
      id uuid (default gen_random_uuid()) or serial primary key
      email text
      created_at timestamptz (default now())

  The code below uses the UMD build of @supabase/supabase-js loaded from CDN
  (the script tag is included in `index.html`). The global exposed by the
  UMD build is `supabase` which provides `createClient`.
*/

const form = document.getElementById("waitlist-form");
const messageEl = document.getElementById("form-message");
const submitButton = form.querySelector('button[type="submit"]');

function setMessage(text, opts = {}) {
  messageEl.textContent = text;
  messageEl.style.color = opts.color || '#ffffff';
}

// Initialize Supabase client if config is provided
let supabaseClient = null;
if (window.SUPABASE_CONFIG && window.supabase && typeof window.supabase.createClient === 'function') {
  try {
    supabaseClient = window.supabase.createClient(
      window.SUPABASE_CONFIG.url,
      window.SUPABASE_CONFIG.anonKey
    );
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
  }
} else {
  console.warn('Supabase config or library missing. Provide SUPABASE_CONFIG and include the supabase CDN.');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const emailEl = document.getElementById('email');
  const email = emailEl.value.trim();

  if (!email) {
    setMessage('Please enter a valid email address.', { color: '#ffb3b3' });
    return;
  }

  // Disable button to prevent double submits
  submitButton.disabled = true;
  submitButton.style.opacity = '0.7';
  setMessage('Adding you to the waitlist...');

  try {
    if (!supabaseClient) {
      // Fallback: don't fail silently if Supabase isn't configured
      throw new Error('Supabase client not configured. See README.md and supabase-config.example.js');
    }

    const payload = { email };

    const { data, error } = await supabaseClient.from('subscribers').insert(payload).select();

    if (error) {
      // If duplicate or constraint error, show friendly message
      console.error('Supabase insert error:', error);
      let msg = 'Something went wrong. Please try again.';
      if (error.code === '23505' || (error.details && /already exists/.test(error.details))) {
        msg = "You're already on the list — thanks!";
      }
      setMessage(msg, { color: '#ffb3b3' });
      return;
    }

    setMessage("You're in! We'll be in touch soon.");
    form.reset();
  } catch (err) {
    console.error(err);
    setMessage('Failed to add your email. Check console for details.', { color: '#ffb3b3' });
  } finally {
    submitButton.disabled = false;
    submitButton.style.opacity = '';
  }
});
