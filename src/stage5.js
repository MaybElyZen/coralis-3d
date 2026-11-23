// Stage 5 design data: Services Annex, hybrid energy, water treatment. PURE DATA (no three.js) so Node checks can import it.
// Metres. Drawing axes as params.js: X seaward, Y north, Z up. All values are provisional conceptual placements, not engineering data.
// Deliberately NO generation, capacity, efficiency, yield, water-quality or typhoon figures anywhere in this file.
import {P,strips,leafX} from './params.js';

export const ENERGY_NOTE='Conceptual hybrid renewable energy system. Actual generation, turbine positioning, structural loading, battery sizing, and typhoon resistance require site-specific assessment.';
export const POTABLE_NOTE='Potable use is conditional on accredited water-quality testing, compliance with applicable Hong Kong drinking-water requirements, and relevant approvals.';
export const NP_SIGN='NON-POTABLE \u2014 DO NOT DRINK';
export const ENERGY_CHAIN=['Solar PV + Wind','EMS','Battery','Building Loads + Marine Monitoring'];
export const ENV=[
 'Hoi Ha Wan is a Marine Park and a study reference, NOT an approved construction site.',
 'First phase: desk research, non-intrusive baseline research, and authority consultation only.',
 'Physical works require relevant ecological, engineering, environmental and regulatory reviews, plus written approvals.',
 'If the location is unsuitable, relocate or use a land-based / non-intrusive alternative.',
 'Nothing here claims that artificial reefs prevent coral bleaching, or that the proposed piles or seabed footprint are ecologically safe.'];

// ---- Services Annex (Option A): attached to the east end of the building (east glass wall at x = 48) ----
export const A5={x0:48,x1:56,y0:6,y1:18,split:12,zSlab:5,zDeck:6,zRoof:10,roofT:.25,wallT:.15};
export const PZ=6.9; // common pipe centre height inside the water room (and hole centre height in the east wall)
export const ROOMS={energy:{name:'Energy Room',y0:6,y1:12},water:{name:'Water Treatment Room',y0:12,y1:18}};
export const HOLES={ // openings left in OUR solids (existing building files are protected; they are never cut)
 slab:[{id:'raw_inlet',x:48.9,y:16.8,w:.15},{id:'power_feed',x:49.4,y:7.4,w:.15}],
 roof:[{id:'pv_trunk',x:48.6,y:11,w:.15},{id:'vawt1',x:50.4,y:9,w:.15},{id:'vawt2',x:52.6,y:9,w:.15},{id:'vawt3',x:54.8,y:9,w:.15},{id:'anemometer',x:51.5,y:7,w:.15}],
 east:[{id:'potable',y:12.55,z:PZ,w:.15},{id:'np_irrigation',y:14.2,z:PZ,w:.15},{id:'np_cleaning',y:15.5,z:PZ,w:.15},{id:'np_toilet',y:16.8,z:PZ,w:.15}]};
export const DECK_SLEEVE={x:46.3,y:15.0,r:.14}; // sleeve marking the core opening through the EXISTING deck slab (existing geometry is not edited)

const rm=(u0,v0,u1,v1,hs)=>{const us=[...new Set([u0,u1,...hs.flatMap(h=>[h[0],h[2]])])].sort((a,b)=>a-b),out=[];
 for(let i=0;i<us.length-1;i++){const a=us[i],b=us[i+1];if(b-a<1e-9)continue;const col=hs.filter(h=>h[0]<=a+1e-9&&h[2]>=b-1e-9).sort((p,q)=>p[1]-q[1]);let v=v0;
  for(const h of col){if(h[1]-v>1e-9)out.push([a,v,b,h[1]]);v=h[3];}if(v1-v>1e-9)out.push([a,v,b,v1]);}return out;};
// Every solid piece of the annex. Used by BOTH the geometry builder and the Node checks, so openings are real.
export function annexSolids(){const a=A5,t=a.wallT,o=[],add=(g,n,x0,y0,z0,x1,y1,z1)=>o.push({g,name:n,x0,y0,z0,x1,y1,z1}),sq=h=>[h.x-h.w,h.y-h.w,h.x+h.w,h.y+h.w],zt=a.zRoof-a.roofT,xs=a.x0+.05;
 for(const r of rm(a.x0,a.y0,a.x1,a.y1,HOLES.slab.map(sq)))add('deck','Annex_floor_slab',r[0],r[1],a.zSlab,r[2],r[3],a.zDeck);
 for(const r of rm(a.x0,a.y0,a.x1,a.y1,HOLES.roof.map(sq)))add('shell','Annex_roof_slab',r[0],r[1],zt,r[2],r[3],a.zRoof);
 add('shell','Annex_wall_south',xs,a.y0,a.zDeck,a.x1-t,a.y0+t,zt);add('shell','Annex_wall_north',xs,a.y1-t,a.zDeck,a.x1-t,a.y1,zt);
 add('shell','Annex_wall_partition',xs,a.split-t/2,a.zDeck,a.x1-t,a.split+t/2,zt);
 for(const r of rm(a.y0,a.zDeck,a.y1,zt,HOLES.east.map(h=>[h.y-h.w,h.z-h.w,h.y+h.w,h.z+h.w])))add('shell','Annex_wall_east',a.x1-t,r[0],r[1],a.x1,r[2],r[3]);
 return o;}
// Existing solids that new services must not clip (read from the protected design values, never edited).
export const existingSolids=()=>[{name:'East glass wall (existing)',x0:47.95,y0:0,z0:6,x1:48.05,y1:18,z1:13.7},{name:'Roof Zone C (existing)',x0:31.8,y0:-.2,z0:13.7,x1:48.2,y1:18.2,z1:14},
 {name:'Deck slab (existing)',x0:0,y0:0,z0:5,x1:48,y1:18,z1:6},{name:'Lift shaft (existing)',x0:44.5,y0:6.5,z0:6,x1:46.5,y1:8.5,z1:14}];

// ---- Hybrid energy ----
export const HY={
 vawt:[{x:50.4,y:9},{x:52.6,y:9},{x:54.8,y:9}],vawtR:.5,vawtH:2.7,plinthH:.2,
 anemo:{x:51.5,y:7,h:3.2},
 pv:{x:48.6,y:11,zTop:15.55,box:{x:47.4,y:11,z:15.55}},
 ems:{x0:51,y0:8.5,x1:52.2,y1:9.5,z0:6,z1:8},
 batt:[{x:54.6,y:7.4},{x:54.6,y:9},{x:54.6,y:10.6}],battW:.9,battD:1.0,battH:1.8,
 bus:{x:53.4,y0:7.4,y1:10.6,z:7.0},
 db:{x0:48.95,y0:7.15,x1:49.85,y1:7.65,z0:6,z1:7.8},
 tray:{y:9,x0:48.6,x1:54.8,z:9.4},
 loads:{building:{x:44.4,y:7.6},marine:{x:39.8,y:7.6},boxZ0:3.95,boxZ1:4.45,cableZ:4.2,existingConduitPt:[39.8,8.6,4.85]},
 cableR:.02};
const emsX=(HY.ems.x0+HY.ems.x1)/2;
export const POWER_CABLES=[ // [id, group, points]  (all axis-aligned)
 ['pv_dc_trunk','roof',[[HY.pv.box.x,11,15.55],[48.6,11,15.55],[48.6,11,10.0]]],
 ['pv_dc_trunk_in','room',[[48.6,11,10.0],[48.6,11,9.4],[48.6,9,9.4],[emsX,9,9.4],[emsX,9,HY.ems.z1]]],
 ...HY.vawt.map((v,i)=>['vawt'+(i+1)+'_cable','room',[[v.x,9,10.1],[v.x,9,9.4]]]),
 ['anemometer_signal','room',[[HY.anemo.x,HY.anemo.y,10.1],[HY.anemo.x,HY.anemo.y,9.4],[HY.anemo.x,9,9.4]]],
 ['ems_to_bus','room',[[HY.ems.x1,9,7.0],[HY.bus.x,9,7.0]]],
 ...HY.batt.map((b,i)=>['bus_to_battery'+(i+1),'room',[[HY.bus.x,b.y,7.0],[b.x-HY.battW/2,b.y,7.0]]]),
 ['battery_to_db','room',[[HY.bus.x,HY.bus.y0,7.0],[HY.db.x1,HY.bus.y0,7.0]]],
 ['feeder_building','under',[[49.45,7.4,6.2],[49.45,7.4,4.2],[49.45,7.6,4.2],[HY.loads.building.x,7.6,4.2]]],
 ['feeder_marine','under',[[49.35,7.4,6.2],[49.35,7.4,4.2],[49.35,7.2,4.2],[HY.loads.marine.x,7.2,4.2],[HY.loads.marine.x,HY.loads.marine.y,4.2]]],
 ['marine_to_gateway_riser','under',[[39.8,7.6,4.45],[39.8,7.6,4.85],[39.8,8.6,4.85]]],
 ['building_riser_stub','under',[[44.4,7.6,4.45],[44.4,7.6,4.95]]]];
// Animated flow paths: Solar PV + Wind -> EMS -> Battery -> Building Loads + Marine Monitoring
const T9=x=>[[x,9,10.1],[x,9,9.4],[emsX,9,9.4],[emsX,9,HY.ems.z1]];
export const ENERGY_FLOWS=[
 {id:'pv',stage:'gen',pts:[[HY.pv.box.x,11,15.55],[48.6,11,15.55],[48.6,11,9.4],[48.6,9,9.4],[emsX,9,9.4],[emsX,9,HY.ems.z1]]},
 ...HY.vawt.map((v,i)=>({id:'vawt'+(i+1),stage:'gen',pts:T9(v.x)})),
 {id:'ems_b1',stage:'store',pts:[[HY.ems.x1,9,7.0],[HY.bus.x,9,7.0],[HY.bus.x,HY.batt[0].y,7.0],[HY.batt[0].x-HY.battW/2,HY.batt[0].y,7.0]]},
 {id:'ems_b2',stage:'store',pts:[[HY.ems.x1,9,7.0],[HY.batt[1].x-HY.battW/2,9,7.0]]},
 {id:'ems_b3',stage:'store',pts:[[HY.ems.x1,9,7.0],[HY.bus.x,9,7.0],[HY.bus.x,HY.batt[2].y,7.0],[HY.batt[2].x-HY.battW/2,HY.batt[2].y,7.0]]},
 {id:'batt_db',stage:'dist',pts:[[HY.bus.x,9,7.0],[HY.bus.x,HY.bus.y0,7.0],[HY.db.x1,HY.bus.y0,7.0]]},
 {id:'db_building',stage:'load',pts:POWER_CABLES.find(c=>c[0]==='feeder_building')[2].concat([[44.4,7.6,4.45],[44.4,7.6,4.95]])},
 {id:'db_marine',stage:'load',pts:POWER_CABLES.find(c=>c[0]==='feeder_marine')[2].concat([[39.8,7.6,4.45],[39.8,7.6,4.85],[39.8,8.6,4.85]])}];

// ---- Water treatment (13 stages, exact names) ----
export const PIPE_MEDIA=[{k:'raw',name:'Raw rainwater',hex:0x3b7fbf},{k:'process',name:'Treatment process water',hex:0xe0a030},{k:'treated',name:'Treated water',hex:0x2fbf71},{k:'np',name:'Non-potable distribution',hex:0x9a5fd0}];
export const STAGES=[
 {n:1,id:'Roof_Rainwater_Collection',name:'Roof Rainwater Collection',cond:false,where:'existing canopy leaf strips, gutters, downpipes and collector main',pos:[46.5,9,17.3],key:'canopy',kind:'badge'},
 {n:2,id:'First_Flush_Diverter',name:'First-Flush Diverter',cond:false,where:'inline on the existing collector main under the deck',pos:[44.2,10.2,4.6],key:'rain',kind:'inline'},
 {n:3,id:'Coarse_Screening',name:'Coarse Screening',cond:false,where:'inline on the existing collector main under the deck',pos:[45.6,10.2,4.6],key:'rain',kind:'inline'},
 {n:4,id:'Raw_Water_Storage',name:'Raw Water Storage',cond:false,where:'the 4 existing tanks (about 10 m\u00b3 each)',pos:[43,15,9.9],key:'rain',kind:'badge'},
 {n:5,id:'Coagulation_Flocculation',name:'Coagulation / Flocculation',cond:true,where:'Water Treatment Room',pos:[49.9,16.8],kind:'floc'},
 {n:6,id:'Sedimentation',name:'Sedimentation',cond:false,where:'Water Treatment Room',pos:[51.7,16.8],kind:'sed'},
 {n:7,id:'Multimedia_Sand_Filtration',name:'Multimedia / Sand Filtration',cond:false,where:'Water Treatment Room',pos:[53.5,16.8],kind:'sand'},
 {n:8,id:'Activated_Carbon_Filtration',name:'Activated Carbon Filtration',cond:false,where:'Water Treatment Room',pos:[53.5,14.8],kind:'gac'},
 {n:9,id:'Ultrafiltration',name:'Ultrafiltration',cond:false,where:'Water Treatment Room',pos:[51.7,14.8],kind:'uf'},
 {n:10,id:'UV_Disinfection',name:'UV Disinfection',cond:false,where:'Water Treatment Room',pos:[49.9,14.8],kind:'uv'},
 {n:11,id:'Controlled_Chlorination',name:'Controlled Chlorination (if required)',cond:true,where:'Water Treatment Room',pos:[49.9,12.9],kind:'chlor'},
 {n:12,id:'Water_Quality_Testing',name:'Water Quality Testing',cond:false,where:'Water Treatment Room',pos:[51.7,12.9],kind:'test'},
 {n:13,id:'Treated_Water_Storage_Distribution',name:'Treated Water Storage and Distribution',cond:false,where:'Water Treatment Room',pos:[53.5,12.9],kind:'store'}];
export const UNIT_R=.5,STORE_R=.6;
const f=(n)=>STAGES[n-1].pos,u=n=>n===13?STORE_R:UNIT_R;
export const WT_LINKS=[ // id, medium, group, polyline
 ['raw_header_a','raw','rain',[[45.45,13.5,6.55],[46.3,13.5,6.55],[46.3,15.0,6.55]]],
 ['raw_header_b','raw','rain',[[45.45,16.5,6.55],[46.3,16.5,6.55],[46.3,15.0,6.55]]],
 ['raw_feed_under','raw','under',[[46.3,15.0,6.55],[46.3,15.0,4.2],[46.3,16.8,4.2],[48.9,16.8,4.2],[48.9,16.8,6.0]]],
 ['raw_feed_riser','raw','room',[[48.9,16.8,6.0],[48.9,16.8,PZ],[f(5)[0]-UNIT_R,16.8,PZ]]],
 ['s5_s6','process','room',[[f(5)[0]+UNIT_R,16.8,PZ],[f(6)[0]-UNIT_R,16.8,PZ]]],
 ['s6_s7','process','room',[[f(6)[0]+UNIT_R,16.8,PZ],[f(7)[0]-UNIT_R,16.8,PZ]]],
 ['s7_s8','process','room',[[53.5,16.8-UNIT_R,PZ],[53.5,14.8+UNIT_R,PZ]]],
 ['s8_s9','process','room',[[f(8)[0]-UNIT_R,14.8,PZ],[f(9)[0]+UNIT_R,14.8,PZ]]],
 ['s9_s10','process','room',[[f(9)[0]-UNIT_R,14.8,PZ],[f(10)[0]+UNIT_R,14.8,PZ]]],
 ['s10_s11','treated','room',[[f(10)[0]-UNIT_R,14.8,PZ],[49.1,14.8,PZ],[49.1,12.9,PZ],[f(11)[0]-UNIT_R,12.9,PZ]]],
 ['s11_s12','treated','room',[[f(11)[0]+UNIT_R,12.9,PZ],[f(12)[0]-UNIT_R,12.9,PZ]]],
 ['s12_s13','treated','room',[[f(12)[0]+UNIT_R,12.9,PZ],[f(13)[0]-STORE_R,12.9,PZ]]],
 ['potable_out','treated','room',[[53.95,12.55,PZ],[56.45,12.55,PZ]]],
 ['np_header','np','room',[[53.95,13.25,PZ],[55.1,13.25,PZ],[55.1,16.8,PZ],[56.45,16.8,PZ]]],
 ['np_irrigation','np','room',[[55.1,14.2,PZ],[56.45,14.2,PZ]]],
 ['np_cleaning','np','room',[[55.1,15.5,PZ],[56.45,15.5,PZ]]]];
export const INLINE={y:10.2,z:4.6,diverter:{x:44.2,len:1.0,r:.22},screen:{x:45.6,len:.9,r:.2},chamber:{r:.22,z0:3.3,z1:3.95},collars:[43.35,44.925,46.28],collarR:.1};
export const TERMINALS=[{id:'potable',y:12.55,label:'Potable outlet (conditional)',np:false},{id:'irrigation',y:14.2,label:'Irrigation',np:true},{id:'cleaning',y:15.5,label:'Cleaning',np:true},{id:'toilet',y:16.8,label:'Toilet flushing',np:true}];
export const PIPE_R=.055;

// ---- label anchors (NEW; the original 12 in labels.js are untouched). [text, [x,y,z], explode key, layer, tag] ----
export const LABELS5=[
 ['Services Annex (about 96 m\u00b2)',[52,6,10.3],'annexShell','Services annex','annex'],['Energy Room',[50,9,7.9],'hybRoom','Services annex','annex'],['Water Treatment Room',[52,14.8,7.7],'wtRoom','Services annex','annex'],
 ...HY.vawt.map((v,i)=>['Wind turbine '+(i+1)+' (VAWT)',[v.x,v.y,13.0],'hybRoof','Hybrid energy','hybrid']),
 ['Anemometer mast',[HY.anemo.x,HY.anemo.y,13.5],'hybRoof','Hybrid energy','hybrid'],['PV DC trunk from 228 panels',[48.6,11,15.9],'hybRoof','Hybrid energy','hybrid'],
 ['EMS',[51.6,9,8.3],'hybRoom','Hybrid energy','hybrid'],['Battery storage (conceptual)',[54.6,9,8.1],'hybRoom','Hybrid energy','hybrid'],['Electrical distribution',[49.4,7.4,8.1],'hybRoom','Hybrid energy','hybrid'],
 ['To building loads',[44.4,7.6,3.7],'annexDeck','Hybrid energy','hybrid'],['To marine monitoring',[39.8,7.6,3.7],'annexDeck','Hybrid energy','hybrid'],
 ...STAGES.map(s=>[s.n+' '+s.name+(s.cond?' (conditional)':''),s.kind==='badge'||s.kind==='inline'?[s.pos[0],s.pos[1],s.n===4?10.4:s.n===1?17.9:s.pos[2]+(s.n===2||s.n===3?-.6:0)]:[s.pos[0],s.pos[1],8.2],s.key||'wtRoom','Water treatment','water']),
 ['Irrigation (non-potable)',[56.6,14.2,7.6],'annexShell','Water treatment','water'],['Cleaning (non-potable)',[56.6,15.5,7.6],'annexShell','Water treatment','water'],['Toilet flushing (non-potable)',[56.6,16.8,7.6],'annexShell','Water treatment','water'],['Potable outlet (conditional)',[56.6,12.55,7.6],'annexShell','Water treatment','water']];

// ---- views, explode offsets, presentation focus (additive only; original keys untouched) ----
Object.assign(P.views,{hybrid:{p:[76,-12,24],t:[52,9,10]},water:{p:[72,2,27],t:[51,14.5,6.5]}});
Object.assign(P.explode,{annexDeck:2,annexShell:12,hybRoom:6,hybRoof:15,wtRoom:6});
export const FOCUS_LAYERS={hybrid:['Building','Canopy','Solar','Sensors','Services annex','Hybrid energy','Sea surface'],water:['Building','Canopy','Rainwater','Services annex','Water treatment','Sea surface']};
export const canopyMaxX=()=>{let m=0;for(const s of strips())for(let y=-4;y<=22;y+=.25)m=Math.max(m,leafX(s,y)+P.canopy.leaf.w/2);return m;};
