import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// The public anon key is designed for browser use when database RLS is enabled.
// Never put a Supabase service-role key in frontend code.
export const supabase = url && anonKey ? createClient(url, anonKey) : null;
