(()=>{
 'use strict';
 const rail=document.querySelector('.flower-rail');if(!rail)return;
 const choices=[...rail.querySelectorAll('.flower-choice')],dots=[...document.querySelectorAll('[data-select]')],prev=document.querySelector('.garden-step.prev'),next=document.querySelector('.garden-step.next'),overlay=document.querySelector('.flower-transition'),plant=overlay.querySelector('canvas'),title=overlay.querySelector('.transition-title'),cancel=overlay.querySelector('.cancel-bloom');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let selected=1,busy=false,lastWheel=0,wheelAmount=0,touchX=null,timers=[],motion=null,returnFocus=null,run=0;
 let bloomFrame=0;
 const paint=(data,p)=>window.PetalBloom.render(plant,data,p);
 let angle=-Math.PI/2,targetAngle=angle,frame=0,lastTick=0;
 function draw(now){const dt=Math.min(40,now-lastTick||16);lastTick=now;angle+=(targetAngle-angle)*(1-Math.exp(-dt/145));const radius=Math.min(rail.clientWidth*.34,375);choices.forEach((el,j)=>{const t=j*Math.PI/2+angle;const depth=(Math.cos(t)+1)/2;el.style.transform=`translate3d(${Math.sin(t)*radius}px,${-105*(1-Math.cos(t))}px,0) scale(${.58+.5*depth})`;el.style.zIndex=String(Math.round(depth*100));el.querySelector('span').style.opacity=String(depth<.12?0:1);el.style.opacity=String(.58+.42*depth);});if(Math.abs(targetAngle-angle)>.0005)frame=requestAnimationFrame(draw);else frame=0;}
 function select(i){if(busy)return;selected=((i%choices.length)+choices.length)%choices.length;targetAngle=-i*Math.PI/2;if(!frame)frame=requestAnimationFrame(draw);choices.forEach((a,j)=>{a.classList.toggle('selected',j===selected);if(j===selected)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')});dots.forEach((b,j)=>b.setAttribute('aria-pressed',String(j===selected)));prev.disabled=false;next.disabled=false;window.PetalBloom.prepare(choices[selected].dataset.species).catch(()=>{});}
 window.addEventListener('resize',()=>{if(!frame)frame=requestAnimationFrame(draw)});
 function schedule(fn,ms){timers.push(setTimeout(fn,ms))}
 function reset(){run++;timers.forEach(clearTimeout);timers=[];motion?.cancel();motion=null;cancelAnimationFrame(bloomFrame);overlay.hidden=true;overlay.classList.remove('visible','leaving');document.body.classList.remove('bloom-active');busy=false;plant.getContext('2d').clearRect(0,0,plant.width,plant.height);choices.forEach(a=>a.removeAttribute('aria-busy'));returnFocus?.focus({preventScroll:true});}
 async function bloom(i,event){if(event&&(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button!==0))return;if(event)event.preventDefault();if(busy)return;select(i,false);busy=true;const thisRun=++run;returnFocus=choices[i];choices[i].setAttribute('aria-busy','true');const url=choices[i].href;title.textContent=choices[i].querySelector('span').textContent;
  let data;try{data=await window.PetalBloom.prepare(choices[i].dataset.species)}catch{location.assign(url);return}if(thisRun!==run)return;paint(data,0);

  if(thisRun!==run)return;
  const rect=choices[i].querySelector('img').getBoundingClientRect();overlay.hidden=false;document.body.classList.add('bloom-active');overlay.getBoundingClientRect();overlay.classList.add('visible');cancel.focus({preventScroll:true});
  if(!reduced.matches){const target=plant.getBoundingClientRect();const dx=rect.left+rect.width/2-target.left-target.width/2,dy=rect.top+rect.height/2-target.top-target.height/2;motion=plant.animate([{transform:`translate(${dx}px,${dy}px) scale(.65)`},{transform:'translate(0,0) scale(.97)',offset:.24},{transform:'translate(0,0) scale(1.015)'}],{duration:1250,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'});}
  const started=performance.now();const duration=reduced.matches?350:1650;
  function play(now){if(thisRun!==run)return;const p=Math.min(1,(now-started)/duration);paint(data,reduced.matches?1:p);if(p<1)bloomFrame=requestAnimationFrame(play);else schedule(()=>{overlay.classList.add('leaving');schedule(()=>location.assign(url),320)},500);}
  bloomFrame=requestAnimationFrame(play);
 }
 choices.forEach((a,i)=>{a.addEventListener('click',e=>bloom(i,e));});
 dots.forEach(b=>b.addEventListener('click',()=>select(Number(b.dataset.select))));prev.addEventListener('click',()=>select(Math.round(-targetAngle/(Math.PI/2))-1));next.addEventListener('click',()=>select(Math.round(-targetAngle/(Math.PI/2))+1));cancel.addEventListener('click',reset);
 rail.addEventListener('wheel',e=>{if(busy)return;e.preventDefault();const delta=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;if(performance.now()-lastWheel<650)return;wheelAmount+=delta;if(Math.abs(wheelAmount)<24)return;select(Math.round(-targetAngle/(Math.PI/2))+Math.sign(wheelAmount));wheelAmount=0;lastWheel=performance.now()},{passive:false});
 rail.addEventListener('touchstart',e=>{touchX=e.touches[0].clientX},{passive:true});rail.addEventListener('touchend',e=>{if(touchX===null)return;const d=touchX-e.changedTouches[0].clientX;if(Math.abs(d)>32)select(Math.round(-targetAngle/(Math.PI/2))+Math.sign(d));touchX=null},{passive:true});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&busy){reset();return}if(busy||!rail.contains(document.activeElement))return;if(e.key==='ArrowRight'){e.preventDefault();select(Math.round(-targetAngle/(Math.PI/2))+1);choices[selected].focus()}if(e.key==='ArrowLeft'){e.preventDefault();select(Math.round(-targetAngle/(Math.PI/2))-1);choices[selected].focus()}});
 window.addEventListener('pageshow',()=>{if(busy)reset()});select(1,true);
})();
