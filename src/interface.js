const D='Conceptual proposal, not an approved construction work.';
// [regex, name, purpose, quantity, status chips (Proposed | Illustrative | Unverified | Assumption | Placeholder), note]
const INFO=[
[/^Frame_.*CONTROL/,'Control frame (unseeded)','Identical frame and tiles left WITHOUT coral so natural settlement and fouling can be compared with treatment frames.','4 of 32 (2 per depth tier)','Proposed','Experimental baseline. '+D],
[/^Frame_.*TREATMENT/,'Treatment frame','Modular frame with 18 porous tiles. Small coral fragments would be attached only under a permitted, assessed experiment.','28 of 32 (14 per depth tier)','Proposed|Unverified','Coral survival and benefit are NOT demonstrated. '+D],
[/^Coral_/,'Coral fragments','Procedural shapes (branching, plate, massive) showing where fragments would go. Not species-accurate.','84 (3 per treatment frame)','Illustrative','Fragment size only. Not a recovered reef.'],
[/^Node_R/,'External reference node','Measures temperature, light, salinity, water quality and local conditions outside the building and canopy influence.','1','Proposed|Unverified','Position needs current and canopy-shadow survey. No data is simulated.'],
[/^Node_H/,'Habitat sensor node','Housing with temperature, light, salinity and water-quality probes. Cable runs to the pile junction and up to the building.','3 (H1, H2, H3)','Proposed|Unverified','Mounting is not engineered. Readings are not simulated.'],
[/^Buoy/,'Reference buoy','Surface float with a small solar cell and antenna. It takes the reference node cable and relays data wirelessly to the roof mast.','1','Proposed|Unverified','Path: node R, buoy, wireless link, roof mast, gateway.'],
[/^Mooring/,'Mooring anchor and line','Holds the buoy near the reference node.','1 block, 1 line','Proposed|Unverified','Not an authorised installation. '+D],
[/^Wireless/,'Wireless link','Dashed line: buoy to roof mast radio link.','1 link','Unverified','Range and reliability are untested.'],
[/^Data_packet/,'Data flow dots','Show the direction of data only.','12 dots','Illustrative','Not measurements.'],
[/^(Cable|Gateway|Roof_antenna)/,'Data cabling and gateway','Cables from nodes to a pile junction, under the deck, up a riser to the gateway in the Level 2 control room, and on to the roof mast.','3 node cables, 1 riser, 1 buoy cable, 1 gateway','Proposed|Unverified','Starts the chain: sensors, data, research building, risk assessment, management action, monitoring.'],
[/^Fish/,'Fish','A few generic fish for scale and life.','28','Illustrative','Not species-specific or survey data. Not a recovered natural reef.'],
[/^Sea urchins|^Seabed boulders/,'Seabed life and rocks','Sparse generic elements for context.','7 urchins, 14 boulders','Illustrative','Not survey data.'],
[/^Seabed/,'Seabed','Sloping seabed from -1 m at the shore to -5 m at the deck.','1','Assumption|Unverified','Not surveyed. Hoi Ha Wan is a study reference area only, not an approved site.'],
[/^Sea surface/,'Sea surface','Semi-transparent water so above and below can be seen together.','1','Illustrative','Mean sea level = 0.'],
[/^Suspension/,'Suspension lines','Show that each frame can be lifted out on its own. Simplifies the masterplan guide-rail idea.','64 lines (2 per frame)','Assumption','Fixings and loads are not engineered.'],
[/^PV panels/,'Solar PV panels','Dark panels on the leaf strips, with the ends of each strip left translucent.','228 panels, 456 m²','Assumption|Unverified','Panel size 1.0 x 2.0 m is an unconfirmed visual assumption. Energy output is not calculated.'],
[/^Translucent/,'Translucent canopy panels','Non-PV leaf portions that pass some light.','72','Proposed','Part of the shading and daylight idea.'],
[/^Leaf/,'Canopy leaf strip','Carries panels and gutters, gives shade and rain catchment. 2.4 m wide, about 750 m² in total plan area.','12 (3 per tree)','Proposed','Rain yield is not calculated.'],
[/^Hollow stack/,'Hollow stack trunk','Hollow tree at X = 42 acting as a ventilation shaft above the core.','1','Proposed|Unverified','Ventilation performance is not calculated.'],
[/^(Trunk|Canopy tree)/,'Branching canopy tree','Procedural branching tree that carries the leaf strips.','4 trees, 12 m apart','Proposed','Peak +19.0 m at one tree; the others are lower to keep clearances.'],
[/^(Rainwater tank|Tank link)/,'Rainwater tanks','Store collected rain in the plant room, linked in series.','4 x about 10 m³ (40 m³)','Proposed|Unverified','Tank weight on the deck needs a structural check.'],
[/^(Gutter|Downpipe|Collector|Riser|Manifold)/,'Rainwater pipes','Gutters, trunk downpipes and a collector under the deck lead to the tanks.','12 gutters, 4 downpipes, 1 collector','Proposed|Unverified','Yield not calculated.'],
[/^Observation grating/,'Observation grating','Open grating over the maintenance spine to look at the habitat.','96 m²','Proposed','Also gives light and access to the frames.'],
[/^Boardwalk|^Shore/,'Access boardwalk','Level 3 m wide walkway from shore to deck. The shore promenade is a placeholder.','36 m long','Proposed|Placeholder','Foundations are shown to the seabed only.'],
[/^(Main pile|Boardwalk pile|PILES)/,'Support piles','Hold the deck above the water.','12 main (1.0 m) + 6 boardwalk (0.5 m)','Proposed|Unverified','About 10.6 m² of seabed footprint. Not engineered. '+D],
[/^(Roof|ROOFS)/,'Roof','Insulated roof slabs over Zones A and C.','2 roofs','Proposed','Canopy sits above with a ventilation gap.'],
[/^(Level 2|LEVEL2)/,'Level 2 research level','Control room, study, seminar and meeting rooms over Zone C.','288 m²','Proposed','Gateway and monitoring sit here.'],
[/^(Deck|Timber)/,'Main deck','48 x 18 m deck at +6.0 m carrying the zones.','864 m²','Proposed','Piles, loads and typhoon behaviour are not engineered.'],
[/^(GLASS|ENCLOSURE)/,'Glass walls and enclosure','Glazed enclosure of Zones A and C.','Enclosed 864 m² + 288 m² covered terrace','Proposed',''],
[/^(INTERIOR|Furniture|Stair|Lift)/,'Interior','Rooms, stair, lift core and simple furniture.','1 stair, 1 lift','Proposed|Illustrative','Furniture is visual only. The core also holds the stack trunk.'],
[/^BUILDING|^DECK/,'Research building','Raised marine research and education pavilion: the upper layer of the dual-layer design.','1','Proposed','']];
export const infoFor=o=>{for(let p=o;p;p=p.parent)if(p.name)for(const e of INFO)if(e[0].test(p.name))return e;return null;};
export const infoCount=INFO.length;
export const RISK={normal:['Normal','#39e07a','Routine monitoring. Habitat node readings stay within the range expected from baseline data and the reference node.','Possible response: continue scheduled data review, sensor cleaning and frame inspection.'],
 alert:['Alert','#ffc857','A reading differs from the reference node or baseline range, or a sensor looks faulty.','Possible response: check the sensor, confirm by hand, sample more often, tell the project supervisor.'],
 action:['Action required','#ff8a3d','A problem is confirmed, for example stress signs, heavy sediment or fouling on frames.','Possible response: clean, move or lift the affected frames, adjust grating light, limit activity, record and report.'],
 stop:['Stop-work','#ff4d4d','A serious or unsafe situation, for example a storm warning, damage to natural coral, or permit conditions at risk.','Possible response: stop work and visits, secure or remove frames only if safe, notify the responsible authorities.']};
const NOTE='Illustrative workflow scenario, not live monitoring. No sensor readings or validated thresholds exist; any thresholds would come from baseline data, literature and permit conditions.';
const chain=['Sensors','Data','Research building','Risk assessment','Management action','Monitoring'];
const chainTxt=['Nodes H1 to H3 and R would measure temperature, light, salinity, water quality and local conditions.','Cables and the buoy link bring readings to the gateway.','Staff in the Level 2 control room review them against the reference node.','Readings are compared with thresholds that are not yet defined.','Possible actions: clean, move or lift a frame, adjust grating, pause visits.','Monitoring continues to check whether the action helped. Nothing here is a measured result.'];
export function initUI(a){
 const st=document.createElement('style');st.textContent=`
 .p{position:fixed;background:rgba(13,26,34,.9);border:1px solid #3b6275;border-radius:8px;color:#e8eef1;font:12px system-ui;padding:8px 10px}
 #ui button,.p button{min-height:34px;touch-action:manipulation}#pn{left:12px;top:calc(56px + env(safe-area-inset-top,0px));display:none;width:min(230px,70vw);max-height:calc(100vh - 110px);overflow:auto}
 #pn summary{cursor:pointer;color:#8fd3dd;font-weight:600;padding:5px 0}#pn button{margin:2px 2px 2px 0;padding:5px 8px;font-size:12px}#pn label{display:block;margin:4px 0}
 #ct{display:none;right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));width:min(290px,60vw);max-height:36vh;overflow:auto}#ct b{color:#8fd3dd;font-size:13px}#ct p{margin:4px 0}#ct small{display:block;margin-top:4px;opacity:.8}
 .chip{display:inline-block;border-radius:10px;padding:1px 7px;margin:3px 3px 3px 0;font-size:11px;color:#071820}.Proposed{background:#6fd3c9}.Illustrative{background:#9db7ff}.Unverified{background:#ffc857}.Assumption{background:#d9a6ff}.Placeholder{background:#cfcfcf}
 #rb{display:none;right:12px;top:calc(12px + env(safe-area-inset-top,0px));font-size:12px}#lb{position:fixed;inset:0;pointer-events:none;overflow:hidden}.lb{position:absolute;transform:translate(-50%,-130%);background:rgba(8,20,28,.72);color:#fff;border-radius:4px;padding:1px 6px;font:11px system-ui;white-space:nowrap}
 #cp{display:none;left:50%;transform:translateX(-50%);bottom:calc(14px + env(safe-area-inset-bottom,0px));width:min(900px,94vw);background:rgba(255,255,255,.95);color:#10222c;border:2px solid #0d3b4a;font-size:clamp(15px,2.3vw,26px);padding:12px 18px}
 #cp h2{margin:0 0 4px;font:700 clamp(17px,2.8vw,32px) system-ui}#cp p{margin:0 0 8px;line-height:1.35}#cp button{font-size:clamp(14px,2vw,22px);margin-right:6px;padding:4px 12px;background:#0d3b4a;color:#fff;border:0;border-radius:6px}
 body.pres #cp{display:block}body.pres #ui,body.pres #pn,body.pres #st,body.pres #ct,body.pres #rb{display:none!important}body.pres .lb{font-size:clamp(12px,1.6vw,20px)}
 #st{max-width:min(520px,60vw)}@media(max-width:900px){#st{display:none}}`;document.head.append(st);
 const el=(h,id)=>{const d=document.createElement('div');d.className='p';d.id=id;d.innerHTML=h;document.body.append(d);return d;};
 const tg=document.createElement('button');tg.textContent='Controls';tg.onclick=()=>pn.style.display=pn.style.display==='block'?'none':'block';document.getElementById('ui').append(tg);
 const Vw=[['overall','Overall'],['building','Building'],['underwater','Underwater'],['restoration','Restoration'],['sensors','Sensor network'],['green','Green systems']];
 const S=[['off','Off'],['sectionLong','Long cut (Y = 9)'],['sectionCross','Cross cut (X = 24)']];
 const pn=el(`<details open><summary>Views</summary>${Vw.map(v=>`<button data-v="${v[0]}">${v[1]}</button>`).join('')}</details>
 <details><summary>Section / cutaway</summary>${S.map(v=>`<button data-s="${v[0]}">${v[1]}</button>`).join('')}</details>
 <details><summary>Exploded view</summary><button data-x="1">Explode</button><button data-x="0">Assemble</button></details>
 <details><summary>Layers</summary>${a.layers.map(l=>`<label><input type="checkbox" checked data-l="${l[0]}"> ${l[1]}</label>`).join('')}<label><input type="checkbox" data-lab="1"> Component labels</label></details>
 <details><summary>Risk scenarios</summary>${Object.entries(RISK).map(([k,v])=>`<button data-r="${k}" style="border-color:${v[1]}">${v[0]}</button>`).join('')}<button data-r="off">Clear</button><small>Illustrative scenarios, not live monitoring.</small></details>
 <details><summary>Workflow chain</summary>${chain.map((c,i)=>`<button data-c="${i}">${i+1}. ${c}</button>`).join('')}</details>
 <details><summary>Presentation</summary><button data-p="start">Start guided tour</button><button data-p="test">Run self-test</button></details>`,'pn');
 const ct=el('','ct'),rb=el('','rb'),cp=el('','cp');
 pn.onclick=e=>{const t=e.target.dataset;if(t.v)a.onView(t.v);if(t.s)a.onSection(t.s);if(t.x)a.onExplode(t.x==='1');if(t.r)a.onRisk(t.r);if(t.c!==undefined)a.onChain(+t.c);if(t.p==='start')a.onPresent();if(t.p==='test')a.onTest();};
 pn.onchange=e=>{const d=e.target.dataset;if(d.l)a.onLayer(d.l,e.target.checked);if(d.lab)a.onLabels(e.target.checked);};
 const show=(e,extra)=>{const[,t,pu,q,s,n]=e;ct.innerHTML=`<b>${t}</b><br>${s.split('|').map(x=>`<span class="chip ${x}">${x}</span>`).join('')}<p><b>Purpose:</b> ${pu}</p><p><b>Quantity:</b> ${q}</p>${n?`<p>${n}</p>`:''}<small>${D}</small><small style="cursor:pointer" id="x">close</small>`;
  ct.style.display='block';ct.querySelector('#x').onclick=()=>{ct.style.display='none';a.onClose();};};
 const showRisk=k=>{if(k==='off'){rb.style.display='none';ct.style.display='none';return;}const r=RISK[k];rb.innerHTML=`<b style="color:${r[1]}">${r[0]}</b> · illustrative scenario, not live monitoring`;rb.style.display='block';
  ct.innerHTML=`<b style="color:${r[1]}">${r[0]}</b><p>${r[2]}</p><p>${r[3]}</p><small>${NOTE}</small><small style="cursor:pointer" id="x">close</small>`;ct.style.display='block';ct.querySelector('#x').onclick=()=>ct.style.display='none';};
 const caption=(i,n,t,tx,play)=>{if(i<0){cp.innerHTML='';return;}cp.innerHTML=`<h2>${i+1}/${n}  ${t}</h2><p>${tx}</p><button data-k="prev">◀ Back</button><button data-k="play">${play?'❚❚ Pause':'▶ Auto-play'}</button><button data-k="next">Next ▶</button><button data-k="stop">✕ Exit</button>`;};
 cp.onclick=e=>{const k=e.target.dataset.k;if(k)a.onPres(k);};
 return{show,showRisk,caption,hide:()=>{ct.style.display='none';},syncLayers:m=>pn.querySelectorAll('[data-l]').forEach(c=>c.checked=!!m[c.dataset.l]),syncLabels:v=>{const c=pn.querySelector('[data-lab]');if(c)c.checked=v;},openPanel:v=>pn.style.display=v?'block':'none'};}
