/* Quiet hints that things on the page can be moved. html[data-hint] holds the active styles (peel, note, nudge);
   #hint-note-nudge or ?hint= picks them, and the preview adds a switcher.
   Hints come in two places: the hero ("nonsense." and its neighbours) and the work wall. Moving something in the hero
   ends the hero hints; moving something on the wall ends all of them, since the wall is what we want people to find. */
(()=>{
const root=document.documentElement,q=new URLSearchParams(location.search).get('hint'),hh=/^#hint-([a-z-]*)$/.exec(location.hash);
if(q!==null)root.dataset.hint=q; else if(hh)root.dataset.hint=hh[1].replace(/-/g,' ').replace('none',''); else if(!root.dataset.hint)root.dataset.hint='peel note';
const on=k=>(' '+root.dataset.hint+' ').includes(' '+k+' ');
let heroDone=false,wallDone=false;
const hero=document.querySelector('.peel'),wallEl=document.querySelector('#wall'),head=document.querySelector('.work-head');

/* peel: the hero word and two stickers on the wall start out with a lifted corner */
const unstick=()=>{hero&&hero.classList.add('unstuck');
[...document.querySelectorAll('.press')].slice(0,1).concat([...document.querySelectorAll('.svc,.svc2')].slice(0,2)).forEach(d=>d.classList.add('unstuck'))};unstick();
/* a piece carries the fold's clip-path only while its corner is up or moving (see hints.css). .curl goes on before the corner
   can move (the cursor arrives, a lifted corner is let go) and comes off once the corner lies flat again. */
const PIECES='.press,.svc,.svc2,.tag,.peel,.tile,.block,.sh-circle,.sh-pill',curl=d=>d&&d.classList.add('curl');
/* .peeled stands in for :hover. The fold clips the corner away, and a clipped corner no longer counts as the piece, so with
   :hover a cursor resting on the lifted corner dropped it flat, which put the corner back under the cursor, and it flickered.
   A piece stays peeled while the cursor is anywhere inside its box. */
let peeled=null,px=-1,py=-1;
const inBox=(d,x,y)=>{const r=d.getBoundingClientRect();return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom};
function peelAt(t){if(!t&&peeled&&peeled.isConnected&&inBox(peeled,px,py))t=peeled;
  if(t===peeled)return;peeled&&peeled.classList.remove('peeled');peeled=t;if(t){curl(t);t.classList.add('peeled')}}
document.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;px=e.clientX;py=e.clientY;peelAt(e.target.closest&&e.target.closest(PIECES))},{passive:true});
addEventListener('scroll',()=>{if(peeled){const t=document.elementFromPoint(px,py);peelAt(t&&t.closest(PIECES))}},{passive:true});
document.documentElement.addEventListener('pointerleave',()=>{px=py=-1;peelAt(null)});
addEventListener('transitionstart',e=>{if(e.propertyName==='--pc')curl(e.target)});
addEventListener('transitionend',e=>{if(e.propertyName==='--pc'&&getComputedStyle(e.target).getPropertyValue('--pc')==='0px')e.target.classList.remove('curl')});
const restick=d=>{curl(d);d.classList.remove('unstuck')};

/* note: marker scribbles with a hand-drawn arrow. One points at "nonsense.", one points from the wall heading down into the wall. */
function makeNote(host,text){const n=document.createElement('span');n.className='hint-note dragger';n.setAttribute('aria-hidden','true');n.dataset.cursor='drag';
  n.innerHTML='<svg><path/></svg><span class="t"></span>';n.querySelector('.t').textContent=text;n.dataset.text=text;host&&host.appendChild(n);return n}
function arrow(n,sx,sy,d){const svg=n.querySelector('svg'),path=n.querySelector('path');svg.setAttribute('style','left:'+sx+'px;top:'+sy+'px;width:1px;height:1px');path.setAttribute('d',d);
  try{n.style.setProperty('--len',Math.ceil(path.getTotalLength()))}catch(_){}}
const h1=document.querySelector('.h1'),heroNote=makeNote(h1,'psst. it moves.'),wallNote=makeNote(head,'the whole wall moves too.');
head&&head.insertBefore(wallNote,head.querySelector('p'));
function placeHero(){if(!hero||!h1)return;const n=heroNote,H=h1.getBoundingClientRect(),P=hero.getBoundingClientRect(),w=n.offsetWidth;
  if(innerWidth-P.right>w+60){/* beside the word: text up and to the right, arrow curls down-left into it */
    n.style.left=(P.right-H.left+28)+'px';n.style.top=(P.top-H.top-10)+'px';
    /* starts just under the words and lands on the right edge of the word at mid-height */
    const th=n.querySelector('.t').offsetHeight,y0=th+12,y1=Math.max(y0+22,P.height*.5+10);
    arrow(n,0,0,`M 34 ${y0} C 30 ${y0+(y1-y0)*.6}, 8 ${y1}, -18 ${y1} M -18 ${y1} l 11 -9 M -18 ${y1} l 11 9`);
  }else{/* phones: under the word's right end, arrow curls up into it, room for it is kept below the headline in hints.css */
    n.style.left=Math.max(0,P.right-H.left-w-44)+'px';n.style.top=(P.bottom-H.top+8)+'px';
    arrow(n,0,0,`M ${w+6} 14 C ${w+26} 14, ${w+34} 4, ${w+30} -14 M ${w+30} -14 l -9 9 M ${w+30} -14 l 10 7`)}}
function placeWall(){if(!head)return;const n=wallNote,w=n.offsetWidth;
  /* it sits in the heading row itself, so it takes its own space and can't land on other text; the arrow drops into the wall */
  arrow(n,0,0,`M ${w+4} 10 C ${w+34} 10, ${w+50} 34, ${w+44} 66 M ${w+44} 66 l -9 -11 M ${w+44} 66 l 12 -8`)}
const draw=(n,place)=>{if(!on('note')||n.classList.contains('drawn'))return;place();requestAnimationFrame(()=>n.classList.add('drawn'))};
addEventListener('resize',()=>{if(on('note')){placeHero();placeWall()}});
const ready=document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve();
ready.then(()=>setTimeout(()=>{if(!heroDone&&!wallDone)draw(heroNote,placeHero)},900));
/* the wall note draws in when the wall heading comes into view */
if(head&&'IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&!wallDone)setTimeout(()=>draw(wallNote,placeWall),350)}),{rootMargin:'0px 0px -35% 0px'});io.observe(head)}
function retire(n,text){if(n.classList.contains('drawn')&&!n.classList.contains('done')){n.querySelector('.t').textContent=text;n.classList.add('done')}}

/* nudge: once the page has been still for a moment (no scrolling, tapping or keys; moving the mouse doesn't count), a wall sticker on screen
   gets restless: it hops up, wiggles and settles, and a neighbour answers a beat later. "nonsense." takes a turn only when no wall is in view.
   Up to six times, until something on the wall has been moved. */
const MAX=6;let idle=0,count=0;
function wake(){clearTimeout(idle);if(wallDone||count>=MAX||!on('nudge'))return;idle=setTimeout(nudge,count?6000:3000)}
function visible(el){const r=el.getBoundingClientRect();return r.width&&r.top>80&&r.bottom<innerHeight-30&&r.left>=0&&r.right<=innerWidth}
function hop(el,big){if(reduce)return;const s=Math.random()<.5?-1:1,k=big?1:.6,sh=v=>`drop-shadow(0 ${v}px ${v*1.2}px rgba(14,14,14,${(.05+v/80).toFixed(2)}))`;
  el.animate([{transform:'none',filter:sh(0)},{transform:`translateY(${-20*k}px) rotate(${-10*s*k}deg) scale(${1+.14*k})`,filter:sh(16*k),offset:.2},{transform:`translateY(0) rotate(${6*s*k}deg) scale(1)`,filter:sh(2),offset:.38},{transform:`translateY(${-8*k}px) rotate(${-4*s*k}deg) scale(${1+.04*k})`,filter:sh(8*k),offset:.54},{transform:`rotate(${2*s*k}deg)`,filter:sh(1),offset:.7},{transform:`rotate(${-1*s*k}deg)`,filter:sh(0),offset:.84},{transform:'none',filter:sh(0)}],{duration:1150,easing:'cubic-bezier(.3,.7,.3,1)'});
  if(big&&window.GFS)GFS.fx('peel')}
function nudge(){
  if(wallDone||document.hidden||drag||(typeof caseOpen!=='undefined'&&caseOpen)||(typeof rolling!=='undefined'&&rolling))return wake();
  let pool=[...wallEl.querySelectorAll('.sticker')].filter(visible);
  if(!pool.length&&!heroDone&&hero&&visible(hero))pool=[hero];
  if(!pool.length)return wake();
  count++;const a=pool.splice(Math.floor(Math.random()*pool.length),1)[0];hop(a,true);
  if(pool.length){const ar=a.getBoundingClientRect(),near=pool.sort((x,y)=>{const d=e=>{const r=e.getBoundingClientRect();return Math.hypot(r.x-ar.x,r.y-ar.y)};return d(x)-d(y)})[0];setTimeout(()=>hop(near,false),180)}
  wake();
}
['pointerdown','scroll','keydown','wheel','touchstart'].forEach(t=>addEventListener(t,wake,{passive:true}));
wake();

/* watch what gets moved */
const moved=sel=>[...document.querySelectorAll(sel)].some(d=>+(d.dataset.dx||0)||+(d.dataset.dy||0));
document.addEventListener('pointerup',()=>setTimeout(()=>{
  if(!heroDone&&moved('.hero .dragger')){heroDone=true;hero&&restick(hero);retire(heroNote,'see? told you.')}
  if(!wallDone&&moved('#wall .dragger,.work-head .hint-note')){wallDone=true;clearTimeout(idle);document.querySelectorAll('.unstuck').forEach(restick);
    retire(wallNote,'look at you go.');if(!heroDone){heroDone=true;retire(heroNote,'see? told you.')}}
},0));

/* preview switcher */
if(root.hasAttribute('data-hint-preview')){
  const opts=[['peel note','Peel + note'],['note nudge','Note + nudge'],['note','Note'],['nudge','Nudge'],['peel','Peel'],['peel nudge','Peel + nudge'],['','None']];
  const bar=document.createElement('div');bar.className='hint-pick';bar.innerHTML='<span>Hint</span>'+opts.map(([k,l])=>`<button type="button" data-k="${k}" data-sfx="none">${l}</button>`).join('');
  document.body.appendChild(bar);
  const sync=()=>bar.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.k===root.dataset.hint));
  bar.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    root.dataset.hint=b.dataset.k;heroDone=wallDone=false;count=0;unstick();sync();
    [heroNote,wallNote].forEach(n=>{n.classList.remove('drawn','done');n.querySelector('.t').textContent=n.dataset.text});
    setTimeout(()=>{draw(heroNote,placeHero);const r=head.getBoundingClientRect();if(r.top<innerHeight*.65&&r.bottom>0)draw(wallNote,placeWall)},60);wake()});
  sync();
}
})();
