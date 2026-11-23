import * as T from 'three';
import {V} from './canopy.js';
const A=[['Canopy: 4 trees, 12 strips',[30,9,19],'canopy','Canopy'],['Solar PV: 228 panels (size assumed)',[30,-3,17.6],'solar','Solar'],['Rainwater: 4 tanks',[44,15,9.8],'rain','Rainwater'],
['Deck 48 × 18 m',[6,0,6],'DECK','Building'],['Level 2 research',[40,9,11],'LEVEL2','Building'],['Piles',[30,16.5,0],'PILES','Building'],['Habitat: 32 frames',[24,9,-2.8],'hab','Habitat'],
['Sensor nodes H1–H3',[24,9,-3.0],'under','Sensors'],['Reference node R',[88,9,-3.0],'under','Sensors'],['Buoy',[88,9,2.6],'surface','Sensors'],['Gateway and mast',[39,7,15.2],'surface','Sensors'],['Seabed',[60,-15,-5],'seabed','Seabed']];
export function makeLabels(cam,offsetOf,vis,extra=[]){
 const box=document.createElement('div');box.id='lb';box.style.display='none';document.body.append(box);
 const ALL=A.concat(extra),els=ALL.map(a=>{const d=document.createElement('div');d.className='lb';d.textContent=a[0];box.append(d);return d;}),v=new T.Vector3();let on=false,mode=null;
 return{set(x){on=x;box.style.display=x?'block':'none';},isOn:()=>on,count:A.length,countExtra:extra.length,setMode(m){mode=m;},mode:()=>mode,
  update(){if(!on)return;ALL.forEach((a,i)=>{const e=els[i];if(!vis(a[3])||(a[4]&&a[4]!=='annex'&&a[4]!==mode)){e.style.display='none';return;}v.copy(V(a[1][0],a[1][1],a[1][2]+offsetOf(a[2]))).project(cam);
   if(v.z>1){e.style.display='none';return;}e.style.display='block';e.style.left=(v.x*.5+.5)*innerWidth+'px';e.style.top=(-v.y*.5+.5)*innerHeight+'px';});}};}
