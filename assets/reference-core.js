/* Shared helpers every site script uses: $ / $$, reduce (prefers-reduced-motion), FINE (mouse), colours C, fonts, sleep, seeded rng. */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const RMQ=matchMedia('(prefers-reduced-motion: reduce)');
let reduce=RMQ.matches; RMQ.addEventListener&&RMQ.addEventListener('change',e=>{reduce=e.matches});
const FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;
const C={ink:'#0E0E0E',cobalt:'#2F4BFF',tang:'#FF7A1A',bubble:'#FF8FCF',mint:'#3DDC97',lemon:'#FFE14D',blood:'#D0102C'};
const DISP='"Bowlby One","Arial Black",Impact,sans-serif', MONO='"DM Mono",ui-monospace,Menlo,monospace';
const TAU=Math.PI*2, sleep=ms=>new Promise(r=>setTimeout(r,ms));
const rng=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const hash=i=>{const r=rng(i*7919+13);return r()};
