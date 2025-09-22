import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = String(req.query.q || 'churrasco');
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(q)}&limit=24`;
  try{
    const r = await fetch(url); const sjson = await r.json();
    const items = (sjson.results || []).map((r:any)=>({
      id:r.id, title:r.title, price:r.price, permalink:r.permalink, thumbnail:r.thumbnail,
      rating:r?.ratings_average || r?.reviews?.rating_average || 4.4, reviews:r?.reviews?.total || 0, category_id:r.category_id
    }));
    res.status(200).json({ items });
  }catch(e:any){ console.error(e); res.status(500).json({ error:'ml_search_failed', message:e?.message }); }
}
