import type { NextApiRequest, NextApiResponse } from 'next';
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { ML_APP_ID, ML_REDIRECT_URI } = process.env;
  if(!ML_APP_ID || !ML_REDIRECT_URI){ res.status(500).send('Missing ML env vars'); return; }
  const state = Math.random().toString(36).slice(2);
  const url = new URL('https://auth.mercadolibre.com.br/authorization');
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', ML_APP_ID);
  url.searchParams.set('redirect_uri', ML_REDIRECT_URI);
  url.searchParams.set('state', state);
  res.setHeader('Set-Cookie', `ml_oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax`);
  res.redirect(url.toString());
}
