import { createClient } from '@supabase/supabase-js';
export const supabaseClient = (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  : null as any;
export function getServerSupabase(){
  const url = process.env.SUPABASE_URL as string;
  const key = process.env.SUPABASE_SERVICE_ROLE as string;
  if(!url || !key) return null;
  const { createClient } = require('@supabase/supabase-js');
  return createClient(url, key);
}
