(()=>{
 const pane=document.getElementById('detailPhotoStream');
 if(!pane)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let content=null, pauseUntil=0, finished=false, wheelAt=-Infinity, bounceAt=-Infinity, last=0, position=0, animation=null, touchY=null, dragStart=0;
 const pause=()=>{pauseUntil=performance.now()+5500;position=pane.scrollTop;};
 function bounce(offset){
   if(!content||reduced.matches||performance.now()-bounceAt<900)return;
   bounceAt=performance.now();
   if(animation)animation.cancel();
   const amount=Math.sign(offset)*Math.max(110,Math.min(160,Math.abs(offset)));
   animation=content.animate([{transform:'translateY(0)',easing:'cubic-bezier(.2,.7,.3,1)'},{transform:'translateY('+amount+'px)',offset:.38,easing:'cubic-bezier(.2,.8,.3,1)'},{transform:'translateY(0)'}],{duration:900});
 }
 function setup(){
   if(pane.firstElementChild&&pane.firstElementChild.classList.contains('gallery-motion-content'))return;
   content=null;finished=false;wheelAt=-Infinity;bounceAt=-Infinity;position=0;pauseUntil=performance.now()+2200;
   if(animation)animation.cancel();
   if(pane.classList.contains('photo-stream-pane--video')||!pane.querySelector('.plate-image'))return;
   const wrapper=document.createElement('div');wrapper.className='gallery-motion-content';
   while(pane.firstChild)wrapper.appendChild(pane.firstChild);
   pane.appendChild(wrapper);content=wrapper;pane.scrollTop=0;
 }
 new MutationObserver(setup).observe(pane,{childList:true});setup();
 pane.addEventListener('wheel',e=>{
   const now=performance.now(),newGesture=now-wheelAt>220;wheelAt=now;
   pause();const max=pane.scrollHeight-pane.clientHeight;
   if(content&&max>0&&((pane.scrollTop<=1&&e.deltaY<0)||(pane.scrollTop>=max-1&&e.deltaY>0))){e.preventDefault();if(newGesture)bounce(-e.deltaY*1.2);}
 },{passive:false});
 pane.addEventListener('pointerdown',pause);
 pane.addEventListener('keydown',pause);
 pane.addEventListener('touchstart',e=>{pause();touchY=e.touches[0].clientY;dragStart=pane.scrollTop;},{passive:true});
 pane.addEventListener('touchmove',e=>{
   pause();if(touchY===null||!content)return;
   const delta=e.touches[0].clientY-touchY,max=pane.scrollHeight-pane.clientHeight;
   if(max>0&&((dragStart<=1&&delta>0)||(dragStart>=max-1&&delta<0))){if(e.cancelable)e.preventDefault();if(animation)animation.cancel();content.style.transform='translateY('+Math.max(-170,Math.min(170,delta*.6))+'px)';}
 },{passive:false});
 pane.addEventListener('touchend',()=>{if(content){const start=content.style.transform;content.style.transform='';if(start&&!reduced.matches)animation=content.animate([{transform:start},{transform:'translateY(0)'}],{duration:550,easing:'cubic-bezier(.16,1,.3,1)'});}touchY=null;pause();},{passive:true});
 function frame(time){
   const dt=Math.min((time-last)/1000,.05);last=time;
   if(pane.dataset.galleryMode!=='process'&&content&&!finished&&!reduced.matches&&!document.hidden&&document.getElementById('view-detail').classList.contains('active')&&time>=pauseUntil){
     const max=pane.scrollHeight-pane.clientHeight;
     if(max>2){
       if(Math.abs(pane.scrollTop-position)>3)position=pane.scrollTop;
       position=Math.max(0,Math.min(max,position+110*dt));pane.scrollTop=position;
       if(position>=max){finished=true;}
     }
   }
   requestAnimationFrame(frame);
 }
 requestAnimationFrame(frame);
})();
