/* Small things: toast, copy email, menu, footer TRUST YOUR GUT letters (and the hidden OUR TRUSTY TUG code), highlighter marks, custom cursor. */
/* ================= small things ================= */
const toastEl=$('#toast');let tt;function toast(m){toastEl.textContent=m;toastEl.hidden=false;clearTimeout(tt);if(!reduce)toastEl.animate([{transform:'translateY(-12px) scale(.9)',opacity:0},{transform:'none',opacity:1}],{duration:380,easing:SPRING.easing});tt=setTimeout(()=>toastEl.hidden=true,2200)}
$('#copy').addEventListener('click',async()=>{GFS.fx('copy');const b=$('#copy');try{await navigator.clipboard.writeText('hello@gutfeeling.agency');b.textContent='Copied';toast('Copied. Now go say hi.')}catch(_){const r=document.createRange();r.selectNodeContents($('#email'));const s=getSelection();s.removeAllRanges();s.addRange(r);toast('Selected — hit Ctrl/⌘ + C')}setTimeout(()=>b.textContent='Copy email',2400)});
function toggleMenu(open){const b=$('#plus'),m=$('#menu');open=open??m.hidden;m.hidden=!open;GFS.fx(open?'open':'close');b.setAttribute('aria-expanded',open);b.setAttribute('aria-label',open?'Close menu':'Open menu')}
$('#plus').addEventListener('click',()=>toggleMenu());$$('#menu a').forEach(a=>a.addEventListener('click',()=>toggleMenu(false)));
/* the menu fills the screen, so a tap on its empty yellow closes it too (the + may have been dragged off and scrolled away) */
$('#menu').addEventListener('click',e=>{if(!e.target.closest('a'))toggleMenu(false)});
// A #section left in the address sends a refresh back to that section, even from the top of the page (iPhone jumps to it before
// it puts you back where you were). So once the jump is done, drop it. /work and the other redirects still land on their section.
const dropHash=()=>{if(location.hash&&!/^#hint-/.test(location.hash))history.replaceState(history.state,'',location.pathname+location.search)};
addEventListener('hashchange',dropHash);if(document.readyState==='complete')dropHash();else addEventListener('load',dropHash);
// footer letters
const fw=$('#footword'),cols=[C.cobalt,C.tang,C.bubble,C.mint,C.lemon];fw.innerHTML=[...fw.textContent].map((ch,i)=>ch===' '?' ':`<span class="dragger" data-cursor="drag" aria-hidden="true" data-note="${i}" style="--c:${cols[i%5]};--rr:${((i%3)-1)*8}deg">${ch}</span>`).join('');
function fitWord(){fw.style.fontSize='';fw.style.display='inline-block';const sw=fw.offsetWidth;fw.style.display='';const cw=fw.clientWidth;if(sw>0&&cw>0){const fs=parseFloat(getComputedStyle(fw).fontSize);fw.style.fontSize=(fs*cw/sw*.995)+'px'}}
let fwW=innerWidth;fitWord();addEventListener('resize',()=>{if(innerWidth!==fwW){fwW=innerWidth;fitWord()}});
$$('.dragger').forEach(d=>d.addEventListener('touchmove',holdScroll,{passive:false}));
GFS.strip(fw,'span[data-note]',(el,d)=>{setTimeout(()=>{el.classList.add('on');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on'),reduce?0:450)},d*1000)});document.fonts&&document.fonts.ready.then(fitWord);
/* hidden code: hover the T of TRUST, the U of YOUR and the G of GUT in that order, touching no other letter,
   and the letters slide into OUR TRUSTY TUG for a moment. A held letter is never swapped out from under the cursor. */
{const A='TRUST YOUR GUT',B='OUR TRUSTY TUG',KEY=['0','8','11'];let step=0,last=0,busy=false;
  const held=()=>new Promise(r=>{const w=()=>fw.querySelector('.dragging')?setTimeout(w,100):r();w()});
  const swap=(target,{dur,stagger,hop,sing})=>new Promise(res=>{
    const spans=$$('span[data-note]',fw),first=new Map(spans.map(el=>[el,el.getBoundingClientRect()]));
    const pool=[...spans],order=[...target].map(ch=>ch===' '?null:pool.splice(pool.findIndex(el=>el.textContent===ch),1)[0]);
    spans.forEach(el=>{el.style.transition='none';setOff(el,0,0)});
    fw.replaceChildren(...order.map(el=>el||document.createTextNode(' ')));fw.setAttribute('aria-label',target===B?'Our Trusty Tug':'Trust Your Gut');
    let done=0;const moving=order.filter(Boolean);
    moving.forEach((el,k)=>{const a=first.get(el),b=el.getBoundingClientRect(),dx=a.left-b.left,dy=a.top-b.top,up=k%2?1:-1,d=reduce?0:k*stagger;
      const land=()=>{el.style.transition='';if(sing){GFS.note(k%10,.55);el.classList.add('on');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on'),450)}if(++done===moving.length)res()};
      if(reduce||(!dx&&!dy)){setTimeout(land,d);return}
      el.animate([{transform:`translate(${dx}px,${dy}px)`},{transform:`translate(${dx/2}px,${dy/2+b.height*hop*up}px) rotate(${up*14*hop}deg)`,offset:.5},{transform:'none'}],{duration:dur,delay:d,easing:'cubic-bezier(.45,0,.2,1)',fill:'backwards'}).finished.then(land)})});
  fw.addEventListener('pointerover',async e=>{const t=e.target.closest&&e.target.closest('span[data-note]');if(!t||busy)return;const n=t.dataset.note,now=performance.now();
    if(now-last>8000)step=0;
    if(n===KEY[step]){step++;last=now}else if(n===KEY[0]){step=1;last=now}else step=0;
    if(step<KEY.length)return;step=0;busy=true;
    await held();await swap(B,{dur:900,stagger:45,hop:.9,sing:true});
    await sleep(2200);
    await held();await swap(A,{dur:380,stagger:12,hop:.3,sing:false});busy=false})}
// highlighter marks
const marks=$$('mark');if(!reduce&&'IntersectionObserver'in window){const mo=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('pre');mo.unobserve(e.target)}}),{rootMargin:'0px 0px -15% 0px'});
  marks.forEach(m=>{const r=m.getBoundingClientRect();if(r.top>innerHeight){m.classList.add('pre');mo.observe(m)}})}
/* ================= custom cursor (fine pointers only) ================= */
const cur=$('#cursor'),curL=$('span',cur);let setCursorWord=()=>{};
if(FINE){const root=document.documentElement;let word='',seen=false;
  setCursorWord=(w,cls)=>{if(w===word)return;word=w;cur.className='cursor on'+(w?' word w-'+cls:'');curL.textContent=w};
  const MAP={'play':'hi','open':'open','drag':'drag','trust it':'trust','say hi':'hi','hi':'hi','close':'close','tidy':'drag','pull':'drag','meet':'hi'};
  /* only touch the class and the word when they change: rewriting the word on every move made the page lay out again each time */
  const show=(cls,w)=>{if(cur.className!==cls)cur.className=cls;if(curL.textContent!==w)curL.textContent=w};
  const track=e=>{if(e.pointerType!=='mouse')return;cur.style.translate=`${e.clientX}px ${e.clientY}px`;if(!seen){seen=true;root.classList.add('has-cursor')}if(drag&&drag.moved)return;
    if(root.classList.contains('cur-hold')){if(word||cur.classList.contains('link')){word='';show('cursor on','')}return}
    const t=e.target.closest&&e.target.closest('[data-cursor],a,button');
    if(t&&t.dataset.cursor){show('cursor on word w-'+(MAP[t.dataset.cursor]||'x'),t.dataset.cursor==='hi'?'say hi':t.dataset.cursor);word=t.dataset.cursor}
    else{word='';show('cursor on'+(t?' link':''),'')}};
  addEventListener('pointermove',track,{passive:true});addEventListener('pointerover',track,{passive:true});
  addEventListener('pointerdown',()=>cur.classList.add('down'));addEventListener('pointerup',()=>cur.classList.remove('down'));
  const away=()=>{seen=false;cur.classList.remove('on');root.classList.remove('has-cursor')};
  document.addEventListener('pointerleave',away);root.addEventListener('mouseleave',away);
}
/* the dock ring's words are drawn once onto a canvas, which then spins. Spinning SVG text made Chrome lay the text out
   and repaint the page every couple of frames, which cost smoothness when scrolling on a computer. Same layout as the
   SVG: text along a circle of radius 80 (of 200), starting at the left and running over the top, 500 units long. */
{const svg=$('.ring svg'),txt=svg&&svg.querySelector('text');
  if(txt&&document.fonts&&'letterSpacing' in CanvasRenderingContext2D.prototype)document.fonts.ready.then(()=>{
    const cs=getComputedStyle(txt),S=156,dpr=Math.min(devicePixelRatio||1,3),k=S/200,cv=document.createElement('canvas');
    cv.width=cv.height=Math.round(S*dpr);cv.setAttribute('aria-hidden','true');cv.style.cssText='display:block;width:100%;height:100%';
    const c=cv.getContext('2d');c.scale(dpr*k,dpr*k);c.font=`${cs.fontWeight} ${parseFloat(cs.fontSize)}px ${cs.fontFamily}`;c.letterSpacing=cs.letterSpacing;
    c.fillStyle=cs.fill;c.textBaseline='alphabetic';
    const chars=[...txt.textContent.toUpperCase()],w=chars.map(ch=>c.measureText(ch).width),extra=(500-w.reduce((a,b)=>a+b,0))/chars.length;
    let L=0;chars.forEach((ch,i)=>{const a=Math.PI+(L+w[i]/2)/80;c.save();c.translate(100+80*Math.cos(a),100+80*Math.sin(a));c.rotate(a+Math.PI/2);
      c.fillText(ch,-w[i]/2,0);c.restore();L+=w[i]+extra});
    svg.replaceWith(cv)})}
