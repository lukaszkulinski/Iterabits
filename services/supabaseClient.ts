
import { createClient } from '@supabase/supabase-js';

// Helper to safely access environment variables across different environments (Vite, Node, etc.)
const getEnvVar = (key: string) => {
  try {
    // Check import.meta.env (Vite standard)
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch (e) {}

  try {
    // Check process.env (Node/Webpack standard)
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {}

  return undefined;
};

// Fallback credentials provided previously (ensures app works in preview without .env setup)
const FALLBACK_URL = 'https://trnptiyvdfhsdslywbhn.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRybnB0aXl2ZGZoc2RzbHl3YmhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NTAxNjcsImV4cCI6MjA3OTIyNjE2N30.EB0HNGEB9Rl8e_otwXUalzCcvjpjDM25Xq9ZmSIDpT8';

// Prioritize Env Vars, fallback to hardcoded keys
const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL') || getEnvVar('SUPABASE_URL') || FALLBACK_URL;
const SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY') || getEnvVar('SUPABASE_ANON_KEY') || FALLBACK_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    'Supabase credentials missing! Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.'
  );
}

export const supabase = createClient(SUPABASE_URL || '', SUPABASE_ANON_KEY || '');
