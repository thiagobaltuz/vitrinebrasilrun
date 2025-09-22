export const priceBRL = (v:number) => v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
export function svgPlaceholder(label:string){
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#121826'/><stop offset='100%' stop-color='#1b2437'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/><g font-family='Inter, Arial' fill='#e9eef6' font-size='28' font-weight='800'><text x='40' y='80'>${label}</text></g><g stroke='#2d3b57' stroke-width='8' opacity='.7'><path d='M60 480 Q400 340 740 520'/></g></svg>`;
  return 'data:image/svg+xml;utf8,'+encodeURIComponent(svg);
}
