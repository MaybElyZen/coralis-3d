// Regression: Stage 3 design values, counts and geometry modules must be unchanged in Stage 4.
import {P,frames,strips} from '../src/params.js';import fs from 'fs';import crypto from 'crypto';
const B=JSON.parse(fs.readFileSync(new URL('./stage3-baseline.json',import.meta.url)));let bad=0;
const ok=(n,c,v='')=>{console.log((c?'PASS ':'FAIL ')+n+(v?'  '+v:''));if(!c)bad++;};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
for(const k of Object.keys(B.params))ok('params.'+k+' unchanged',same(P[k],B.params[k]));
ok('frames() identical to Stage 3 (ids, positions, control flags)',same(frames(),B.frames));ok('strips() identical',same(strips(),B.strips));
const F=frames();ok('Counts: 32 frames / 28 treatment / 4 control',F.length===32&&F.filter(f=>!f.control).length===28&&F.filter(f=>f.control).length===4);
ok('Counts: 3 habitat nodes + 1 reference node',P.nodes.habitat.length===3&&!!P.nodes.ref);
ok('Counts: 4 canopy trees, 12 leaf strips',P.canopy.xs.length===4&&strips().length===12);
ok('Dimensions: deck 48 x 18 at +6.0, peak +19.0',P.deck.x1===48&&P.deck.y1===18&&P.deck.z===6&&Math.max(...Object.values(P.canopy.peak))===19);
for(const[m,h]of Object.entries(B.hashes)){const c=crypto.createHash('sha256').update(fs.readFileSync(new URL('../src/'+m,import.meta.url))).digest('hex');ok(`src/${m} geometry module byte-identical to Stage 3`,c===h);}
console.log(bad?`\n${bad} REGRESSION CHECK(S) FAILED`:'\nREGRESSION: ALL PASSED');process.exit(bad?1:0);
