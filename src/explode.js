import * as T from 'three';
import {P} from './params.js';
import {M} from './materials.js';
// Exploded view: moves whole layer groups vertically. No geometry is edited.
export function makeExplode(c){
 const E=P.explode,B=c.b.group,find=n=>B.children.find(o=>o.name===n);
 const surf=new T.Group(),under=new T.Group();surf.name='SENS_SURFACE';under.name='SENS_UNDERWATER';
 for(const o of[...c.sen.group.children])((/^(Buoy_reference|Wireless_link|Roof_antenna_mast|Gateway_control_room|Cable_gateway_to_roof_mast)/.test(o.name)||(o.isMesh&&o.material===M.led))?surf:under).add(o);
 c.sen.group.add(surf,under);
 const L=[[find('DECK'),'DECK'],[find('INTERIOR'),'INTERIOR'],[find('LEVEL2'),'LEVEL2'],[find('ENCLOSURE'),'ENCLOSURE'],[find('PILES'),'PILES'],[c.ra.group,'rain'],[c.c.group,'canopy'],[c.so.group,'solar'],[surf,'surface'],
  [c.an.deck,'annexDeck'],[c.an.shell,'annexShell'],[c.hy.room,'hybRoom'],[c.hy.roof,'hybRoof'],[c.hy.under,'annexDeck'],[c.wt.room,'wtRoom'],[c.wt.under,'annexDeck'],[c.wt.inline,'rain'],[c.wt.out,'annexShell'],[c.wt.s1,'canopy'],
  [c.hab.group,'hab'],[c.hab.coral,'hab'],[c.life.group,'hab'],[under,'under'],[c.sb,'seabed']];
 let k=0,target=0,speed=1;const ease=()=>k*k*(3-2*k),apply=()=>{for(const[o,key]of L)o.position.y=(E[key]||0)*ease();};
 const api={on:false,groups:L.map(l=>l[1]),
  set(on,dur=1.4){api.on=on;target=on?1:0;if(dur===0){k=target;apply();}else speed=1/dur;under.traverse(o=>{if(o.name==='Data_packet_illustrative')o.visible=!on;});c.hy.setFlows(!on);},
  update(dt){if(k!==target){k=target>k?Math.min(target,k+dt*speed):Math.max(target,k-dt*speed);apply();}},
  offset:key=>(E[key]||0)*ease(),missing:L.filter(l=>!l[0]).length};
 return api;}
