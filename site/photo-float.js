(()=>{
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const pointer=matchMedia('(hover: hover) and (pointer: fine)');
  document.querySelectorAll('.home .cards .card').forEach(card=>{
    const crop=card.querySelector('.crop');
    if(!crop)return;
    card.addEventListener('pointermove',event=>{
      if(motion.matches||!pointer.matches||event.pointerType==='touch')return;
      const rect=crop.getBoundingClientRect();
      const position=Math.max(0,Math.min(1,(event.clientY-rect.top)/rect.height));
      crop.style.setProperty('--photo-y',((position-.5)*10).toFixed(2)+'px');
    });
    card.addEventListener('pointerleave',()=>crop.style.setProperty('--photo-y','0px'));
    card.addEventListener('blur',()=>crop.style.setProperty('--photo-y','0px'));
  });
})();
