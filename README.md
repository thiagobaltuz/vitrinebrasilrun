# Mercado Livre Affiliate Starter (Next.js)
Vitrine de afiliados (nicho **churrasco**) com busca na API pública do Mercado Livre e redireciono via link afiliado.

## Como rodar
pnpm i # ou npm i / yarn
cp .env.local.example .env.local
# edite ML_APP_ID, ML_APP_SECRET, ML_REDIRECT_URI e (opcional) Supabase
pnpm dev

Acesse: http://localhost:3000

## OAuth (Mercado Livre)
1. No Developers ML, cadastre Redirect URI: http://localhost:3000/api/ml/callback
2. Preencha ML_APP_ID e regenere o segredo → ML_APP_SECRET.
3. Inicie: GET /api/ml/auth-start

## Deeplinks de Afiliado
- Gere no Portal de Afiliados o deeplink de cada produto (a partir do permalink).
- Guarde em affiliate_links (item_id, affiliate_url).
- O botão Comprar chama /api/click?item_id=... → registra clique → 302 para deeplink/permalink.

## Supabase (opcional)
Veja supabase/schema.sql e implemente lib/db.ts com inserts/selects reais.

## Rotas
- GET /api/ml/search?q=churrasco
- GET /api/ml/auth-start
- GET /api/ml/callback
- GET /api/click?item_id=MLB123&permalink=...

Customize UI em pages/index.tsx e CSS em styles/globals.css.
