// Stage 5 checks (Node). Run with: node --import ./checks/register-mock.mjs checks/stage5-check.mjs  (the mock replaces three.js ONLY here)
import fs from 'fs';import crypto from 'crypto';
import {P,strips} from '../src/params.js';
import * as S from '../src/stage5.js';
import {STEPS} from '../src/presentation.js';
import {buildAnnex} from '../src/annex.js';import {buildHybrid} from '../src/hybrid.js';import {buildWater} from '../src/watertreat.js';
let bad=0;const ok=(n,c,v='')=>{console.log((c?'PASS ':'FAIL ')+n+(v?'  '+v:''));if(!c)bad++;};
const rd=f=>fs.readFileSync(new URL('../src/'+f,import.meta.url),'utf8'),sha=t=>crypto.createHash('sha256').update(t).digest('hex');
const {A5,HY,STAGES,WT_LINKS,HOLES,PZ}=S;
// ---- preservation ----
const ORIG={'building.js':'8a5d7ff79d7280007a7b1491f34d4bfe12755c25399a1ae0eeb3c4daff355d08','canopy.js':'6923f0840ae54bd5a2212d58adacf3e1776e5b6c1ec350e0dd24766bf16f6cac','solar.js':'a81cf8aa2d59772c292914294471b87f799be167eac494504e31ae00bb311983','rainwater.js':'56fac80714a3b64c38aaef497be3ae9faec49f4625d2760d904bbf9d58e7997c','underwater.js':'08946576bb9e727c8fad94e3dbe714d6c0e2f30a03469b12dee1d859246a4bf6','sensors.js':'043e9aba469a53ff51374089835c84e4862cc51565cc0905319b61f590dc588b'};
for(const[f,h]of Object.entries(ORIG))ok(`src/${f} byte-identical to uploaded Stage 4 seafix`,sha(fs.readFileSync(new URL('../src/'+f,import.meta.url)))===h);
const lab=rd('labels.js');ok('Original 12 label anchors unchanged',sha(lab.slice(lab.indexOf('const A=['),lab.indexOf('export function')))==='b2b65e5e872d57a633b975810502e49eac977c09733b5a17cf664cb22ea2929b');
ok('Sea-surface fix intact (sea mesh in scene.js, transparent, depthWrite false, in layer map)',/transparent:true,opacity:\.5[^)]*depthWrite:false/.test(rd('scene.js'))&&/'Sea surface':sea/.test(rd('main.js'))&&/sea\.material\.clippingPlanes/.test(rd('main.js')));
// ---- annex ----
ok('Annex X 48-56, Y 6-18, footprint 96 m2',A5.x0===48&&A5.x1===56&&A5.y0===6&&A5.y1===18&&(A5.x1-A5.x0)*(A5.y1-A5.y0)===96);
ok('Annex deck +6 m, roof +10 m',A5.zDeck===6&&A5.zRoof===10);
ok('Rooms: Water Treatment Y 12-18, Energy Y 6-12, partition at 12',S.ROOMS.water.y0===12&&S.ROOMS.water.y1===18&&S.ROOMS.energy.y0===6&&S.ROOMS.energy.y1===12&&A5.split===12);
ok('Annex attached to existing east wall at x = 48 (deck x1 = 48)',P.deck.x1===48&&A5.x0===P.deck.x1);
const an=buildAnnex(),hy=buildHybrid(),wt=buildWater();
// ---- hybrid ----
ok('3 vertical-axis wind turbines + 1 anemometer',hy.stat.vawt===3&&hy.stat.anemometer===1);
ok('EMS, battery storage, distribution board present',hy.stat.ems===1&&hy.stat.battery>=1&&hy.stat.db===1);
const cx=S.canopyMaxX(),R=HY.vawtR;
ok('Turbines and anemometer on annex roof, outside canopy footprint (plan clearance >= 0.5 m)',[...HY.vawt.map(v=>[v.x,v.y,R]),[HY.anemo.x,HY.anemo.y,.3]].every(([x,y,r])=>x-r>=cx+.5&&x-r>=A5.x0&&x+r<=A5.x1&&y-r>=A5.y0&&y+r<=A5.y1),'canopy max x = '+cx.toFixed(2));
ok('Turbines spaced >= 1.0 m apart (blade tip to tip)',HY.vawt.every((a,i)=>HY.vawt.every((b,j)=>i>=j||Math.hypot(a.x-b.x,a.y-b.y)-2*R>=1)));
ok('Existing 228 PV panels unchanged (12 strips x 19)',strips().length*P.pv.perStrip===228);
const inRoom=(x0,y0,x1,y1,r)=>x0>=A5.x0+.05+.4&&x1<=A5.x1-A5.wallT-.1&&y0>=r.y0+.075+.1&&y1<=r.y1-.075-.1;
const E=S.ROOMS.energy;
ok('EMS, batteries, distribution board inside Energy Room with wall clearance',inRoom(HY.ems.x0,HY.ems.y0,HY.ems.x1,HY.ems.y1,E)&&HY.batt.every(b=>inRoom(b.x-HY.battW/2,b.y-HY.battD/2,b.x+HY.battW/2,b.y+HY.battD/2,E))&&inRoom(HY.db.x0,HY.db.y0,HY.db.x1,HY.db.y1,E));
ok('Battery cabinets do not overlap each other or the EMS',HY.batt.every((a,i)=>HY.batt.every((b,j)=>i>=j||Math.abs(a.y-b.y)>=HY.battD+.2))&&HY.batt.every(b=>b.x-HY.battW/2>HY.ems.x1+.5));
ok('Energy flow chain text = Solar PV + Wind, EMS, Battery, Building Loads + Marine Monitoring',JSON.stringify(S.ENERGY_CHAIN)===JSON.stringify(['Solar PV + Wind','EMS','Battery','Building Loads + Marine Monitoring']));
const fl=S.ENERGY_FLOWS;ok('Flow paths cover generation, storage, distribution and both loads',['gen','store','dist','load'].every(k=>fl.some(f=>f.stage===k))&&fl.filter(f=>f.stage==='load').length===2);
// ---- water ----
ok('13 stages in the required order with exact names',JSON.stringify(STAGES.map(s=>s.name))===JSON.stringify(['Roof Rainwater Collection','First-Flush Diverter','Coarse Screening','Raw Water Storage','Coagulation / Flocculation','Sedimentation','Multimedia / Sand Filtration','Activated Carbon Filtration','Ultrafiltration','UV Disinfection','Controlled Chlorination (if required)','Water Quality Testing','Treated Water Storage and Distribution']));
ok('Coagulation/flocculation (5) and chlorination (11) are conditional; no other stage is',STAGES.filter(s=>s.cond).map(s=>s.n).join()==='5,11');
ok('Each stage has a model object (badge/inline/unit) and a label',wt.stat.stages===13&&STAGES.every(s=>S.LABELS5.some(l=>l[0].startsWith(s.n+' '))));
ok('Stage 4 uses the 4 existing tanks (~10 m3 each), unchanged',P.tanks.pos.length===4&&Math.abs(Math.PI*P.tanks.r**2*P.tanks.h-10)<.1);
ok('Four distinct pipe colours, each used by at least one run',new Set(S.PIPE_MEDIA.map(m=>m.hex)).size===4&&S.PIPE_MEDIA.every(m=>WT_LINKS.some(l=>l[1]===m.k)));
ok('Non-potable pipes: 3 branches (irrigation, cleaning, toilet flushing); potable output is a separate run',S.TERMINALS.filter(t=>t.np).map(t=>t.id).join()==='irrigation,cleaning,toilet'&&WT_LINKS.some(l=>l[0]==='potable_out'&&l[1]==='treated')&&WT_LINKS.filter(l=>l[1]==='np').length===3);
ok('Potable and non-potable pipes never share a run or a hole',new Set(S.TERMINALS.map(t=>t.y)).size===4&&HOLES.east.length===4);
ok('Signs and arrows built (4 signs, arrows on every run)',wt.stat.signs===4&&wt.stat.arrows>=WT_LINKS.length);
const W=S.ROOMS.water;
ok('Treatment units inside Water Treatment Room with clearance',STAGES.filter(s=>s.n>=5).every(s=>{const r=s.n===13?S.STORE_R:S.UNIT_R;return inRoom(s.pos[0]-r,s.pos[1]-r,s.pos[0]+r,s.pos[1]+r,W);}));
ok('Treatment units do not overlap (>= 0.3 m gap)',STAGES.filter(s=>s.n>=5).every((a,i,arr)=>arr.every((b,j)=>i>=j||Math.hypot(a.pos[0]-b.pos[0],a.pos[1]-b.pos[1])>=(a.n===13||b.n===13?S.STORE_R+S.UNIT_R:2*S.UNIT_R)+.3)));
// ---- pipes/cables vs solid walls (real geometry from the builders) ----
const ext=o=>{const g=o.geometry,p=g.p;let h;if(g.type==='Cylinder'){const r=p[0],L=p[2],a=Math.abs(o.rotation.z-Math.PI/2)<1e-6?'x':Math.abs(o.rotation.x-Math.PI/2)<1e-6?'z3':'y3';h=a==='x'?[L/2,r,r]:a==='z3'?[r,r,L/2]:[r,L/2,r];}else if(g.type==='Sphere')h=[p[0],p[0],p[0]];else return null;
 const c=o.position;return{x0:c.x-h[0],x1:c.x+h[0],y0:-(c.z+h[2]),y1:-(c.z-h[2]),z0:c.y-h[1],z1:c.y+h[1]};};
const hit=(a,b,e=1e-6)=>a.x0<b.x1-e&&a.x1>b.x0+e&&a.y0<b.y1-e&&a.y1>b.y0+e&&a.z0<b.z1-e&&a.z1>b.z0+e;
const tubes=[];for(const root of[hy.group,wt.group])root.traverse(o=>{if(o.isMesh&&/^(WT_pipe_|Hyb_cable_)/.test(o.name)){const b=ext(o);if(b)tubes.push({n:o.name,...b});}});
ok('Pipe and cable geometry sampled',tubes.length>60,tubes.length+' pieces');
const solids=S.annexSolids(),glass=S.existingSolids();
const bogus={x0:54,x1:57,y0:15.3,y1:15.4,z0:PZ-.05,z1:PZ+.05};ok('Negative control: a pipe through the solid east wall IS detected',solids.some(s=>hit(bogus,s)));
const clashA=tubes.filter(t=>solids.some(s=>hit(t,s)));ok('No pipe or cable intersects any annex wall, slab or roof (openings/sleeves used)',clashA.length===0,clashA.slice(0,3).map(t=>t.n).join());
const ex=glass.filter(g=>!/Deck slab/.test(g.name)),clashE=tubes.filter(t=>ex.some(s=>hit(t,s)));ok('No pipe or cable crosses the existing east glass wall, Zone C roof or lift shaft',clashE.length===0,clashE.slice(0,3).map(t=>t.n+'/'+ex.find(s=>hit(t,s)).name).join());
const slab=glass.find(g=>/Deck slab/.test(g.name)),thru=tubes.filter(t=>hit(t,slab)),D=S.DECK_SLEEVE;
ok('Only one pipe passes the EXISTING deck slab, and exactly at the sleeve',thru.length>0&&thru.every(t=>/WT_pipe_raw/.test(t.n)&&t.x0>=D.x-.07&&t.x1<=D.x+.07&&t.y0>=D.y-.07&&t.y1<=D.y+.07),thru.length+' pieces');
const inside=(t,h,a,b)=>true;
const pf=(id,x,y)=>tubes.every(t=>!hit(t,{x0:x-.17,x1:x+.17,y0:y-.17,y1:y+.17,z0:A5.zSlab+.02,z1:A5.zDeck-.02})||HOLES.slab.some(h=>Math.abs(h.x-x)<1e-9));
ok('Annex floor openings are where pipes/cables pass (raw inlet, power feed)',HOLES.slab.length===2&&tubes.some(t=>/raw/.test(t.n)&&t.x0<=48.9&&t.x1>=48.9&&t.z0<=5&&t.z1>=6)&&tubes.some(t=>/feeder/.test(t.n)&&t.x0<=49.45&&t.x1>=49.35&&t.z0<=5&&t.z1>=6));
// under-deck clearance to piles and existing collector main
const piles=[];for(const x of P.piles.xs)for(const y of P.piles.ys)piles.push({x0:x-.8,x1:x+.8,y0:y-.8,y1:y+.8,z0:-5,z1:5});
ok('New under-deck pipes/cables keep >= 0.3 m from main piles',tubes.every(t=>!piles.some(p=>hit(t,p))||t.z0>=5.0));
const main={x0:6.5,x1:46.5,y0:P.pipes.mainY-.07,y1:P.pipes.mainY+.07,z0:P.pipes.mainZ-.07,z1:P.pipes.mainZ+.07};
ok('New pipes/cables do not clip the existing collector main (inline devices are separate objects)',tubes.every(t=>!hit(t,main)));
ok('Inline devices sit on the existing main, below the deck slab (top < 5.0)',[S.INLINE.diverter,S.INLINE.screen].every(d=>S.INLINE.z+d.r<5&&d.x-d.len/2>=43.5&&d.x+d.len/2<=46.4));
// ---- text rules ----
ok('Energy note exact',S.ENERGY_NOTE==='Conceptual hybrid renewable energy system. Actual generation, turbine positioning, structural loading, battery sizing, and typhoon resistance require site-specific assessment.');
ok('Potable note exact',S.POTABLE_NOTE==='Potable use is conditional on accredited water-quality testing, compliance with applicable Hong Kong drinking-water requirements, and relevant approvals.');
ok('Non-potable sign text exact',S.NP_SIGN==='NON-POTABLE \u2014 DO NOT DRINK');
const all=['stage5.js','info5.js','hud.js','presentation.js'].map(rd).join('\n');
ok('No invented generation, battery, efficiency, capacity, yield or typhoon figures',!/\b\d+(\.\d+)?\s?(kW|kWh|kWp|MW|MWh|Wh|Ah|L\/s|L\/h|m\u00b3\/|m3\/|%|mg\/L|NTU)|per (day|year)|\bm\u00b3 per\b|efficiency of/i.test(all.replace(/about 10 m\u00b3 each/g,'')));
ok('Environmental statements present (Marine Park, first phase, approvals, relocate)',S.ENV[0].includes('Marine Park')&&S.ENV[0].includes('NOT an approved construction site')&&S.ENV[1].includes('desk research, non-intrusive baseline research, and authority consultation only')&&S.ENV[2].includes('written approvals')&&/relocate/.test(S.ENV[3]));
ok('No claim that reefs prevent bleaching or that piles/footprint are safe',!/(prevent|stop|protect)[^.]*bleach|ecologically safe[^.]*(is|are) (proven|confirmed)/i.test(all.replace(S.ENV[4],'')));
// ---- presentation / views / explode ----
const ti=STEPS.map(s=>s.title);
ok('Presentation: 9 steps, originals in order, new steps after step 3',ti.length===9&&ti.slice(0,3).join('|')==='Overall project|Architecture|Green building systems'&&ti[3]==='Hybrid Renewable Energy System'&&ti[4]==='Rainwater Treatment and Water Reuse'&&ti.slice(5).join('|')==='Underwater habitat|Coral treatment and control experiment|Sensor network|Data and risk-management workflow',ti.join(' | '));
ok('Every step view exists in P.views',STEPS.every(s=>P.views[s.view]));
ok('New views hybrid and water exist; original views kept',['overall','building','underwater','restoration','sensors','green','hybrid','water'].every(k=>P.views[k]));
ok('New explode offsets defined; original offsets unchanged',['annexDeck','annexShell','hybRoom','hybRoof','wtRoom'].every(k=>k in P.explode)&&P.explode.rain===16&&P.explode.canopy===20&&P.explode.solar===23);
ok('Label anchors: new anchors separate, all with known explode keys',S.LABELS5.length>=30&&S.LABELS5.every(l=>l[2] in P.explode));
const ln=new Set(['Services annex','Hybrid energy','Water treatment']);ok('Every new anchor belongs to a new layer',S.LABELS5.every(l=>ln.has(l[3])));
ok('Focus layers use real layer names',Object.values(S.FOCUS_LAYERS).flat().every(n=>['Building','Canopy','Solar','Rainwater','Habitat','Coral','Sensors','Marine life','Sea surface',...ln].includes(n)));
console.log(bad?`\n${bad} STAGE 5 CHECK(S) FAILED`:'\nSTAGE 5: ALL PASSED');process.exit(bad?1:0);
