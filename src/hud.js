import {ENERGY_CHAIN,ENERGY_NOTE,POTABLE_NOTE,NP_SIGN,PIPE_MEDIA,STAGES,ENV} from './stage5.js';
const hex=h=>'#'+h.toString(16).padStart(6,'0');
export function makeHud(){
 const st=document.createElement('style');st.textContent=`#hud,#env{position:fixed;background:rgba(13,26,34,.92);border:1px solid #3b6275;border-radius:8px;color:#e8eef1;font:12px system-ui;padding:8px 10px}
 #hud{display:none;left:12px;bottom:calc(40px + env(safe-area-inset-bottom,0px));width:min(330px,62vw);max-height:42vh;overflow:auto}#hud b{color:#8fd3dd}#hud p{margin:5px 0}#hud ol{margin:4px 0;padding-left:20px}#hud li{margin:1px 0}
 .fl{display:flex;flex-wrap:wrap;gap:3px;align-items:center}.fl span{background:#16303d;border:1px solid #3b6275;border-radius:6px;padding:2px 6px}.sw{display:inline-block;width:12px;height:12px;border-radius:3px;vertical-align:-2px;margin-right:5px}
 .np{background:#6b2fa3;color:#fff;border-radius:4px;padding:1px 6px;font-weight:700}#env{right:12px;top:calc(48px + env(safe-area-inset-top,0px));width:min(340px,80vw);cursor:pointer}#env summary{color:#ffc857;font-weight:600}#env p{margin:4px 0}
 body.pres #hud{display:block;left:12px;top:12px;bottom:auto;max-height:50vh;font-size:clamp(12px,1.5vw,18px)}body.pres #hud.off{display:none}body.pres #env{top:12px}`;document.head.append(st);
 const h=document.createElement('div');h.id='hud';document.body.append(h);
 const env=document.createElement('details');env.id='env';env.className='p';env.innerHTML=`<summary>Environmental integrity</summary>${ENV.map(t=>`<p>${t}</p>`).join('')}`;document.body.append(env);
 const energy=`<b>Hybrid energy flow</b><p class="fl">${ENERGY_CHAIN.map(c=>`<span>${c}</span>`).join(' \u2192 ')}</p><p>Arrows show direction only. Existing 228 solar panels, plus 3 wind turbines and 1 anemometer.</p><p><b>${ENERGY_NOTE}</b></p>`;
 const water=`<b>Rainwater treatment (13 stages)</b><p>${PIPE_MEDIA.map(m=>`<span class="sw" style="background:${hex(m.hex)}"></span>${m.name}`).join('<br>')}</p>
  <ol>${STAGES.map(s=>`<li>${s.name}${s.cond?' <i>(conditional)</i>':''}</li>`).join('')}</ol><p>Potable and non-potable outputs are separate. <span class="np">${NP_SIGN}</span></p><p><b>${POTABLE_NOTE}</b></p>`;
 return{el:h,env,show(k){h.classList.toggle('off',!k);h.style.display=k?'block':'none';h.innerHTML=k==='hybrid'?energy:k==='water'?water:'';if(!k)h.style.display='';if(!k)h.classList.add('off');},mode:()=>h.classList.contains('off')?null:(h.innerHTML.includes('Hybrid energy flow')?'hybrid':'water')};}
