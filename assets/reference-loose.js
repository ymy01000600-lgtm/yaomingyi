/* Everything moves: every heading, paragraph, pill and button on the page becomes a .dragger like the wall pieces
   The slingshot copy moves too; Matt's grab handle stays above it, so he can still be pulled from on top of the words.
   Headlines come apart word by word. The email address stays put (the Copy email button is how people take it). Tidy up puts it all back. */
{
  const PIECES=[
    '.nav-links a','.nav .reel-pill','.hello-pill','#plus',
    '.kicker span','.hero .lede',
    '.work-head h2','.work-head p',
    '.mani-l > .mono','.mani-l .origin','.mani-r > p','.mani-r > h3',
    '.contact > .mono','.contact .lede','#copy',
    '.foot-row > span','.foot-row nav a',
    '.ss-copy > .mono','.ss-stk','.ss-sub','.pn-snap',
    '#gut','#tidy'
  ];
  /* headlines: each word is its own piece (the h1's "nonsense." already is one) */
  const WORDS=['#h1','#mani-h','#say-h','#ss-h .ss-q'];
  WORDS.forEach(sel=>{const h=$(sel);if(!h)return;h.classList.add('loose-words');
    [...h.childNodes].forEach(n=>{if(n.nodeType!==3||!n.textContent.trim())return;
      const f=document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(w=>{if(!w)return;if(/^\s+$/.test(w)){f.append(w);return}
        const s=document.createElement('span');s.className='loose-w';s.textContent=w;f.append(s)});
      n.replaceWith(f)})});
  const all=[...$$(PIECES.join(',')),...$$(WORDS.map(s=>s+' .loose-w').join(','))];
  all.forEach(el=>{if(el.classList.contains('dragger'))return;
    el.classList.add('dragger','loose-p');
    if(!el.dataset.cursor)el.dataset.cursor='drag';
    if(el.tagName==='A')el.draggable=false;
    if(getComputedStyle(el).position==='static')el.style.position='relative';
    el.addEventListener('touchmove',holdScroll,{passive:false})});
}
