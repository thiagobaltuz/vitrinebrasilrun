import type { NextApiRequest, NextApiResponse } from 'next';
import { saveTokens } from '@/lib/db';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code, state } = req.query;
  const cookieState = req.cookies['ml_oauth_state'];
  if (!code || state !== cookieState) return res.status(400).send('Invalid state');
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: process.env.ML_APP_ID!,
    client_secret: process.env.ML_APP_SECRET!,
    code: String(code),
    redirect_uri: process.env.ML_REDIRECT_URI!,
  });
  const r = await fetch('https://api.mercadolibre.com/oauth/token', { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body });
  const tok = await r.json();
  if (!r.ok) return res.status(500).json(tok);
  await saveTokens(tok); res.redirect('/?ml=ok');
}
