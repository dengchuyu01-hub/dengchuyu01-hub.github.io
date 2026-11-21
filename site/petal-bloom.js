/* Bloom poses are reverse-designed from the section's original watercolor.
   64 motion-compensated frames preserve texture instead of stretching a photo.
   Source keyframes and production notes: animation-sources/ and animation-research.md. */
(()=>{
'use strict';
const cache=new Map(),W=240,H=360;
async function prepare(name){if(!cache.has(name))cache.set(name,new Promise((resolve,reject)=>{const atlas=new Image();atlas.onload=()=>{if(atlas.naturalWidth!==W*8||atlas.naturalHeight!==H*8){cache.delete(name);reject(Error('Invalid bloom atlas'));return}resolve({name,atlas})};atlas.onerror=()=>{cache.delete(name);reject(Error('Bloom unavailable'))};atlas.src=`decor/bloom/${name}-reverse-atlas.webp`;}));return cache.get(name)}
function render(canvas,data,progress){const p=Math.max(0,Math.min(1,progress)),frame=Math.min(63,Math.floor(p*63)),ctx=canvas.getContext('2d');ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(data.atlas,(frame%8)*W,Math.floor(frame/8)*H,W,H,0,0,canvas.width,canvas.height);canvas.dataset.progress=p.toFixed(3);canvas.dataset.frame=String(frame);}
window.PetalBloom={prepare,render};
})();
