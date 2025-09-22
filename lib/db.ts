import { getServerSupabase } from '@/lib/supabase';

export type MLToken = {
  access_token: string;
  refresh_token: string;
  user_id: number;
  expires_in: number; // seconds
  scope?: string;
  token_type?: string;
};

export async function saveTokens(tok: MLToken){
  // Opcional: persistir tokens do ML (crie tabela se for usar). Aqui só logamos.
  console.log('saveTokens (stub):', tok.user_id);
}

export async function recordClick(item_id:string, meta:{ip?:string, ua?:string}){
  const s = getServerSupabase();
  if(!s){ console.warn('Supabase server client não configurado'); return; }
  const { error } = await s.from('click_events').insert({
    item_id, ip: meta.ip || null, user_agent: meta.ua || null
  });
  if(error) console.error('recordClick error', error);
}

export async function getAffiliateUrl(item_id:string): Promise<string | null>{
  const s = getServerSupabase();
  if(!s){ console.warn('Supabase server client não configurado'); return null; }
  const { data, error } = await s.from('affiliate_links').select('affiliate_url').eq('item_id', item_id).maybeSingle();
  if(error){ console.error('getAffiliateUrl error', error); return null; }
  return data?.affiliate_url ?? null;
}

export async function getPermalinkFallback(item_id:string): Promise<string | null>{
  const s = getServerSupabase();
  if(!s){ console.warn('Supabase server client não configurado'); return null; }
  const { data, error } = await s.from('products').select('permalink').eq('item_id', item_id).maybeSingle();
  if(error){ console.error('getPermalinkFallback error', error); return null; }
  return data?.permalink ?? null;
}
