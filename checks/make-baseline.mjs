// Snapshot of the approved Stage 3 design values and geometry-module hashes. Run once at Stage 3 state.
import {P,frames,strips} from '../src/params.js';import fs from 'fs';import crypto from 'crypto';
const keys=['deck','zone','L1','L2','lv','piles','boardwalk','canopy','pv','tanks','pipes','hab','nodes','seabed','life','cut'].filter(k=>P[k]);
const params=Object.fromEntries(keys.map(k=>[k,P[k]]));
const h=f=>crypto.createHash('sha256').update(fs.readFileSync(new URL('../src/'+f,import.meta.url))).digest('hex');
const mods=['building.js','canopy.js','solar.js','rainwater.js','underwater.js','sensors.js'];
fs.writeFileSync(new URL('./stage3-baseline.json',import.meta.url),JSON.stringify({params,frames:frames(),strips:strips(),hashes:Object.fromEntries(mods.map(m=>[m,h(m)]))},null,1));console.log('baseline written');
