import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { priceBRL, svgPlaceholder } from '@/lib/util';

type Item = { id:string; title:string; price:number; permalink:string; thumbnail?:string; rating?:number; reviews?:number; category_id?:string; };
const COLLECTIONS = ['Parrillas','Grelhadores','Facas','Hambúrguer','Acessórios','Chapas & Tábuas','Kits'];

export default function Home(){
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('churrasco');
  const [sort, setSort] = useState('relevance');
  const [minP, setMinP] = useState<number | undefined>();
  const [maxP, setMaxP] = useState<number | undefined>();
  const [rmin, setRmin] = useState(0);
  const [activeCol, setActiveCol] = useState<string | null>(null);
  const [clicks, setClicks] = useState(0);
  const [topProduct, setTopProduct] = useState<string>('—');
  const [clickMap] = useState<Map<string, number>>(new Map());

  useEffect(()=>{ (async()=>{ setLoading(true); const r=await fetch(`/api/ml/search?q=${encodeURIComponent(q)}`); const j=await r.json(); setItems(j.items||[]); setLoading(false); })(); },[q]);

  const filtered = useMemo(()=>{
    let list = items.slice();
    list = list.filter(p => {
      const matchesCol = !activeCol || (p.title.toLowerCase().includes(activeCol.toLowerCase()));
      const matchesPrice = (minP===undefined || p.price>=minP) && (maxP===undefined || p.price<=maxP);
      const matchesRating = (rmin===0 || (p.rating||0)>=rmin);
      return matchesCol && matchesPrice && matchesRating;
    });
    list.sort((a,b)=>{
      if(sort==='price_asc') return a.price-b.price;
      if(sort==='price_desc') return b.price-a.price;
      if(sort==='rating_desc') return (b.rating||0)-(a.rating||0);
      return (b.rating||0)-(a.rating||0) || (b.reviews||0)-(a.reviews||0) || (a.price-b.price);
    });
    return list;
  },[items,sort,minP,maxP,rmin,activeCol]);

  const ctr = useMemo(()=>`${(clicks/Math.max(filtered.length,1)*100).toFixed(1)}%`,[clicks,filtered.length]);

  async function onBuy(it: Item){
    setClicks(c=>c+1);
    clickMap.set(it.id,(clickMap.get(it.id)||0)+1);
    const top=[...clickMap.entries()].sort((a,b)=>b[1]-a[1])[0];
    if(top){ const prod=items.find(x=>x.id===top[0]); if(prod) setTopProduct(prod.title); }
    window.location.href=`/api/click?item_id=${encodeURIComponent(it.id)}&permalink=${encodeURIComponent(it.permalink)}`;
  }

  return (<>
    <Head><title>Churrasco Pro — Vitrine</title><meta name="viewport" content="width=device-width, initial-scale=1" /></Head>
    <header className="header"><div className="header-inner"><div className="brand"><div className="brand-logo" aria-hidden="true"/><h1>Churrasco Pro</h1></div>
    <div className="header-cta"><button className="btn ghost" onClick={()=>document.getElementById('chips')?.scrollIntoView({behavior:'smooth'})}>Coleções</button>
    <button className="btn" onClick={()=>document.getElementById('newsletter')?.scrollIntoView({behavior:'smooth'})}>Receber Ofertas</button></div></div></header>
    <main className="container">
      <section className="hero">
        <div className="hero-grid">
          <div className="card">
            <span className="badge">CURADORIA • churrasco & hambúrguer</span>
            <h2 className="hero-title">Os melhores itens de churrasco numa vitrine só.</h2>
            <p className="hero-sub">Parrillas, grelhas, facas e acessórios — filtrados por preço, avaliação e frete. Você escolhe, a gente manda o link afiliado direto pro Mercado Livre.</p>
            <div className="hero-stats">
              <div className="stat"><b>{filtered.length}</b><span>Produtos</span></div>
              <div className="stat"><b>{COLLECTIONS.length}</b><span>Coleções</span></div>
              <div className="stat"><b>{clicks}</b><span>Cliques</span></div>
            </div>
            <div className="filters">
              <input className="input" type="search" placeholder="Buscar: faca, parrilla, moedor..." value={q} onChange={e=>setQ(e.target.value)} />
              <select className="input" value={sort} onChange={e=>setSort(e.target.value)}>
                <option value="relevance">Ordenar: Relevância</option>
                <option value="price_asc">Preço: menor → maior</option>
                <option value="price_desc">Preço: maior → menor</option>
                <option value="rating_desc">Avaliação: melhor</option>
              </select>
              <div className="range"><label className="small">R$ min</label>
                <input className="input" type="number" min={0} step={10} placeholder="0" onChange={e=>setMinP(e.target.value?Number(e.target.value):undefined)} /></div>
              <div className="range"><label className="small">R$ máx</label>
                <input className="input" type="number" min={0} step={10} placeholder="2500" onChange={e=>setMaxP(e.target.value?Number(e.target.value):undefined)} /></div>
              <select className="input" onChange={e=>setRmin(Number(e.target.value))}>
                <option value="0">Avaliação: todas</option><option value="4">4★+</option><option value="4.5">4.5★+</option>
              </select>
              <button className="btn ghost" onClick={()=>{setQ('churrasco');setSort('relevance');setMinP(undefined);setMaxP(undefined);setRmin(0);setActiveCol(null);}}>Limpar</button>
            </div>
          </div>
          <div className="card">
            <h3 style={{margin:'6px 0 10px'}}>Coleções destacadas</h3>
            <div className="chips" id="chips">
              {COLLECTIONS.map(c => (
                <button key={c} className={`chip ${activeCol===c?'active':''}`} onClick={()=> setActiveCol(activeCol===c? null : c)}>{c}</button>
              ))}
            </div>
            <div className="kit" style={{marginTop:12}}><b>Kit do Churrasqueiro</b>
              <p className="small">Seleção com parrilla + faca + termômetro + soprador. Clique numa coleção para filtrar.</p>
            </div>
            <div className="dashboard">
              <div className="kpi"><div className="small">CTR estimado</div><b>{ctr}</b></div>
              <div className="kpi"><div className="small">Produto mais clicado</div><b>{topProduct}</b></div>
            </div>
            <p className="notice">Links afiliados: podemos ganhar comissão. Preços e estoque mudam em tempo real.</p>
          </div>
        </div>
      </section>
      <section className="section">
        <h2>Produtos</h2>
        <div className="grid">
          {loading && <div style={{gridColumn:'1/-1'}}>Carregando…</div>}
          {!loading && filtered.map(it => (
            <article key={it.id} className="card card-product">
              <div className="pimg"><img src={svgPlaceholder('Churrasco')} alt={it.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
              <h3 className="ptitle">{it.title}</h3>
              <div className="meta"><span className="price">{priceBRL(it.price)}</span><span className="rating"><span className="star">★</span> {(it.rating ?? 4.4).toFixed(1)}</span></div>
              <div className="meta"><span className="small">{it.reviews ?? 0} avaliações</span><span className="small">Mercado Livre</span></div>
              <div className="actions"><button className="btn" onClick={()=>onBuy(it)}>Comprar</button><a className="btn ghost" href={it.permalink} target="_blank" rel="noreferrer">Ver no ML</a></div>
            </article>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="card subgrid">
          <form id="newsletter" className="card" style={{background:'var(--muted)'}} onSubmit={(e)=>{e.preventDefault(); alert('✅ Cadastrado!');}}>
            <h3>Receba promoções de churrasco</h3><p className="small">Apenas ofertas quentes. Sem spam.</p>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              <input required placeholder="Seu e-mail" className="input" style={{flex:1,minWidth:220}} /><button className="btn" type="submit">Cadastrar</button>
            </div>
          </form>
          <div className="card"><h3>Como funciona</h3>
            <ol className="small" style={{lineHeight:1.6}}><li>Nós curamos os melhores produtos.</li><li>Você compara e clica em <b>Comprar</b>.</li><li>Vai para o Mercado Livre pelo nosso link afiliado.</li></ol>
            <p className="small">Simples, transparente e rápido.</p></div>
        </div>
      </section>
    </main>
    <footer className="footer"><div>© 2025 Churrasco Pro • Curadoria de produtos de churrasco</div><div className="small">Feito com ❤️ para churrasqueiros exigentes.</div></footer>
  </>);
}
