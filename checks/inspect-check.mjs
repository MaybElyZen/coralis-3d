// Every named component created by the Stage 2 and 3 modules must resolve to an inspection entry with quantity and status.
import {infoFor} from '../src/interface.js';import fs from 'fs';
const names=['Frame_T2_R1_C01_TREATMENT','Frame_T1_R2_C08_CONTROL','Coral_T2_R1_C02','Node_H1','Node_H3','Node_R','Buoy_reference','Mooring_anchor_block_conceptual','Mooring line','Wireless_link_buoy_to_building','Data_packet_illustrative',
'Cable_H1_to_junction','Cable junction (on pile)','Cable_data_riser_to_gateway','Gateway_control_room','Roof_antenna_mast','Fish (illustrative, not species-specific)','Sea urchins (illustrative)','Seabed boulders (illustrative)','Seabed (conceptual, not surveyed)',
'Sea surface','Suspension lines (conceptual)','PV panels (1.0 x 2.0 m, unconfirmed size)','Translucent non-PV panels','Leaf X6 dx-4.5','Hollow stack trunk X42','Trunk X6','Canopy tree X6','Rainwater tank (about 10 m3)','Tank link','Gutter','Downpipe',
'Collector main under deck','Riser','Manifold','Observation grating (spine)','Boardwalk','Shore promenade (placeholder)','Main pile','Boardwalk pile','Roof Zone A','Roof Zone C','Level 2 slab','Deck slab','Timber deck finish','Lift shaft','Stair','Furniture'];
let bad=0;const mk=n=>({name:n,parent:null});
for(const n of names){const e=infoFor(mk(n));const ok=!!e&&!!e[3]&&!!e[4];console.log((ok?'PASS ':'FAIL ')+n+(ok?'  -> '+e[1]+' ['+e[4]+']':''));if(!ok)bad++;}
// group-level names used by the model must resolve too
for(const n of['DECK','PILES','ENCLOSURE','LEVEL2','INTERIOR','ROOFS','GLASS','BUILDING']){const e=infoFor(mk(n));const ok=!!e;console.log((ok?'PASS ':'FAIL ')+'group '+n);if(!ok)bad++;}
// statuses must be from the allowed vocabulary
const allowed=new Set(['Proposed','Illustrative','Unverified','Assumption','Placeholder']);
const src=fs.readFileSync(new URL('../src/interface.js',import.meta.url),'utf8');const used=[...src.matchAll(/'(Proposed|Illustrative|Unverified|Assumption|Placeholder)[A-Za-z|]*'/g)].flatMap(m=>m[0].slice(1,-1).split('|'));
const okv=used.every(u=>allowed.has(u));console.log((okv?'PASS ':'FAIL ')+'status vocabulary');if(!okv)bad++;
// names promised in the code exist in source
const code=['building','canopy','solar','rainwater','underwater','sensors'].map(f=>fs.readFileSync(new URL('../src/'+f+'.js',import.meta.url),'utf8')).join('\n');
for(const k of['Hollow stack trunk','Buoy_reference','Wireless_link_buoy_to_building','Gateway_control_room','Roof_antenna_mast','Data_packet_illustrative','Frame_','Coral_','Node_']){const o=code.includes(k);console.log((o?'PASS ':'FAIL ')+'name exists in geometry code: '+k);if(!o)bad++;}
console.log(bad?`\n${bad} INSPECTION CHECK(S) FAILED`:'\nINSPECTION: ALL PASSED');process.exit(bad?1:0);
