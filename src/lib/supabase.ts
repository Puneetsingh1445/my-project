import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL     as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// A valid Supabase anon key is always a JWT and starts with "eyJ"
const isValidUrl = (url?: string) =>
  !!url && url.startsWith('https://') && url.endsWith('.supabase.co');

const isValidKey = (key?: string) =>
  !!key && key.startsWith('eyJ');   // JWT base64 header

const configured = isValidUrl(supabaseUrl) && isValidKey(supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
    'Add them to your .env file and restart the dev server.'
  );
} else if (!configured) {
  console.error(
    '[Supabase] Invalid credentials detected.\n' +
    `  URL: ${supabaseUrl}\n` +
    `  Key starts with: ${supabaseAnonKey?.slice(0, 12)}...\n` +
    'The anon key must be a JWT (starts with "eyJ"). ' +
    'Copy the correct values from: Supabase Dashboard → Settings → API'
  );
}

export const supabase = configured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

export const isSupabaseEnabled = !!supabase;
