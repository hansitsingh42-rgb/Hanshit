// ProfileCard-inspired pointer interaction. Original lightweight implementation.
(() => {
  const shell=document.querySelector('[data-profile-card]'), card=shell?.querySelector('.profile-card');
  if(!shell||!card||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const update=e=>{const r=card.getBoundingClientRect(),x=Math.max(0,Math.min(100,((e.clientX-r.left)/r.width)*100)),y=Math.max(0,Math.min(100,((e.clientY-r.top)/r.height)*100));shell.style.setProperty('--pc-x',x+'%');shell.style.setProperty('--pc-y',y+'%');shell.style.setProperty('--pc-rx',((x-50)/12)+'deg');shell.style.setProperty('--pc-ry',((50-y)/16)+'deg')};
  const reset=()=>{shell.style.setProperty('--pc-rx','0deg');shell.style.setProperty('--pc-ry','0deg');shell.style.setProperty('--pc-x','50%');shell.style.setProperty('--pc-y','50%')};
  card.addEventListener('pointermove',update,{passive:true});card.addEventListener('pointerleave',reset);card.addEventListener('pointercancel',reset);reset();
})();
