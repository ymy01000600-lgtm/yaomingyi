(()=>{
 const home=document.querySelector('#view-home.hr-home');if(!home)return;
 if(home.classList.contains('active'))document.querySelector('.main-nav [data-target=home]')?.classList.add('active');
 const contacts=document.getElementById('aboutContact'),bio=document.querySelector('#view-about .about-bio-column');if(contacts&&bio)bio.append(contacts);
 home.querySelectorAll('.highlight-grid article').forEach((card,index)=>{const targetIndex=card.dataset.workIndex!==undefined?Number(card.dataset.workIndex):index;card.tabIndex=0;card.setAttribute('role','link');const title=card.querySelector('h3').textContent.replace('↗','').trim();card.setAttribute('aria-label','查看'+title+'完整详情');card.onclick=()=>{activeFilter='all';openDetail(targetIndex);};card.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activeFilter='all';openDetail(targetIndex);}};const img=card.querySelector('img');if(img)img.alt=title+'代表作品图';});
 let busy=false;
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 home.querySelectorAll('.gateway').forEach((group,index)=>{
   const piece=group.querySelector('.gateway-piece'),slot=group.querySelector('.gateway-slot'),arrow=group.querySelector('.gateway-arrow');
   const config={view:index===0?'works':'about',name:index===0?'全部作品':'关于与联系',color:index===0?'橙色':'蓝色'};
   let placed=false,drag=null,suppressUntil=0,snapVersion=0;
   piece.tabIndex=0;piece.setAttribute('role','button');piece.setAttribute('draggable','false');piece.setAttribute('aria-label','拖动拼图或点击进入'+config.name);
   piece.addEventListener('dragstart',e=>e.preventDefault());
   function snap(animate){
     const previous=piece.style.transform;
     piece.style.transition='none';piece.style.transform='none';
     const source=piece.getBoundingClientRect(),target=slot.getBoundingClientRect();
     const transform='translate('+(target.left-source.left)+'px,'+(target.top-source.top)+'px) rotate(0deg)';
     if(animate&&!reduced()){piece.style.transform=previous||'none';void piece.getBoundingClientRect();piece.style.transition='transform 420ms cubic-bezier(.16,1,.3,1)';}
     piece.style.transform=transform;
   }
   async function enter(){
     if(busy)return;busy=true;
     try{
       if(!placed){placed=true;piece.classList.add('is-placed');snap(true);if(arrow)arrow.style.visibility='hidden';await new Promise(r=>setTimeout(r,reduced()?0:650));}
       await enterPuzzlePage(piece,config);
     }finally{busy=false;}
   }
   piece.addEventListener('click',()=>{if(performance.now()>=suppressUntil)enter();});
   piece.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();enter();}});
   piece.addEventListener('pointerdown',e=>{
     if(placed||busy||e.button!==0)return;e.preventDefault();
     drag={x:e.clientX,y:e.clientY,moved:false};piece.setPointerCapture(e.pointerId);
     piece.style.transition='none';piece.style.transform='none';piece.classList.add('is-dragging');document.body.classList.add('puzzle-grabbing');
   });
   piece.addEventListener('pointermove',e=>{if(!drag)return;e.preventDefault();const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>4)drag.moved=true;piece.style.transform='translate('+dx+'px,'+dy+'px) rotate(0deg)';});
   function end(e){
     if(!drag)return;const moved=drag.moved;drag=null;piece.classList.remove('is-dragging');document.body.classList.remove('puzzle-grabbing');
     if(piece.hasPointerCapture(e.pointerId))piece.releasePointerCapture(e.pointerId);
     if(!moved){piece.style.transform='';return;}
     suppressUntil=performance.now()+800;
     const r=piece.getBoundingClientRect(),t=slot.getBoundingClientRect(),distance=Math.hypot(r.left+r.width/2-t.left-t.width/2,r.top+r.height/2-t.top-t.height/2);
     if(e.type!=='pointercancel'&&distance<t.width*.48){enter();}
     else{piece.style.transition=reduced()?'none':'transform 350ms cubic-bezier(.16,1,.3,1)';piece.style.transform='';}
   }
   piece.addEventListener('pointerup',end);piece.addEventListener('pointercancel',end);
   function realign(){if(placed&&!busy&&home.classList.contains('active')){const version=++snapVersion;requestAnimationFrame(()=>{if(version===snapVersion)snap(false);});}}
   new ResizeObserver(realign).observe(group);
   new MutationObserver(realign).observe(home,{attributes:true,attributeFilter:['class']});
 });
})();
