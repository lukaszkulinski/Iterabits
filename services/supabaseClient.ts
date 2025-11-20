import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://trnptiyvdfhsdslywbhn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRybnB0aXl2ZGZoc2RzbHl3YmhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NTAxNjcsImV4cCI6MjA3OTIyNjE2N30.EB0HNGEB9Rl8e_otwXUalzCcvjpjDM25Xq9ZmSIDpT8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);