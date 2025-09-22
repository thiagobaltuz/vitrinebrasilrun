-- Tabelas
create table if not exists products (
  item_id text primary key,
  title text not null,
  price numeric not null,
  permalink text not null,
  thumbnail text,
  rating numeric,
  reviews integer,
  category_id text,
  last_seen_at timestamptz default now(),
  inactive boolean default false
);

create table if not exists affiliate_links (
  item_id text primary key references products(item_id) on delete cascade,
  affiliate_url text not null,
  source_tag text,
  created_at timestamptz default now()
);

create table if not exists click_events (
  id bigserial primary key,
  item_id text not null,
  ts timestamptz default now(),
  ip text,
  user_agent text
);

-- Índices úteis
create index if not exists idx_products_category on products(category_id);
create index if not exists idx_clicks_item on click_events(item_id);

-- RLS
alter table products enable row level security;
alter table affiliate_links enable row level security;
alter table click_events enable row level security;

-- Policies:
-- 1) products: leitura pública (somente SELECT)
drop policy if exists "public read products" on products;
create policy "public read products" on products
for select
to anon, authenticated
using (true);

-- 2) affiliate_links: sem políticas = ninguém (anon/authenticated) acessa.
-- Service Role ignora RLS, então as rotas server-side continuam funcionando.

-- 3) click_events: sem políticas (apenas Service Role insere).
-- Se quiser permitir insert público (não recomendado), crie uma policy específica.
