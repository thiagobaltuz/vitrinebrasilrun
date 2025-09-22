import type { NextApiRequest, NextApiResponse } from 'next';
import { recordClick, getAffiliateUrl, getPermalinkFallback } from '@/lib/db';
export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const item_id = String(req.query.item_id || '');
  const fallbackPermalink = req.query.permalink ? String(req.query.permalink) : undefined;
  if(!item_id) return res.status(400).send('missing item_id');
  const ua = req.headers['user-agent'] as string | undefined;
  const ip = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '').toString();
  await recordClick(item_id, { ua, ip });
  const aff = await getAffiliateUrl(item_id);
  const to = aff || fallbackPermalink || (await getPermalinkFallback(item_id)) || 'https://www.mercadolivre.com.br/';
  res.writeHead(302, { Location: to }); res.end();
}
