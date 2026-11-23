import * as T from 'three';
import {box} from './building.js';
import {A5,HOLES,annexSolids,DECK_SLEEVE} from './stage5.js';
import {M5} from './mat5.js';
import {G} from './s5util.js';
const TT=.03;
// Square sleeve frame lining an opening of half-width w. ax 'z' = horizontal slab opening, 'x' = opening in a wall facing east.
function frame(g,ax,c1,c2,w,a0,a1,name){const b=(x0,y0,z0,x1,y1,z1)=>box(g,x0,y0,z0,x1,y1,z1,M5.sleeve,name);
 if(ax==='z'){const[x,y]=[c1,c2];b(x-w,y-w,a0,x-w+TT,y+w,a1);b(x+w-TT,y-w,a0,x+w,y+w,a1);b(x-w+TT,y-w,a0,x+w-TT,y-w+TT,a1);b(x-w+TT,y+w-TT,a0,x+w-TT,y+w,a1);}
 else{const[y,z]=[c1,c2];b(a0,y-w,z-w,a1,y-w+TT,z+w);b(a0,y+w-TT,z-w,a1,y+w,z+w);b(a0,y-w+TT,z-w,a1,y+w-TT,z-w+TT);b(a0,y-w+TT,z+w-TT,a1,y+w-TT,z+w);}}
export function buildAnnex(){
 const root=G('SERVICES ANNEX'),deck=G('ANNEX_DECK'),shell=G('ANNEX_SHELL'),stat={solids:0,sleeves:0};
 for(const s of annexSolids()){box(s.g==='deck'?deck:shell,s.x0,s.y0,s.z0,s.x1,s.y1,s.z1,s.name==='Annex_roof_slab'?M5.annexRoof:s.g==='deck'?M5.slab:M5.annexWall,s.name);stat.solids++;}
 for(const h of HOLES.slab){frame(deck,'z',h.x,h.y,h.w,A5.zSlab-.03,A5.zDeck+.03,'Annex_sleeve_floor_'+h.id);stat.sleeves++;}
 for(const h of HOLES.roof){frame(shell,'z',h.x,h.y,h.w,A5.zRoof-A5.roofT-.03,A5.zRoof+.03,'Annex_sleeve_roof_'+h.id);stat.sleeves++;}
 for(const h of HOLES.east){frame(shell,'x',h.y,h.z,h.w,A5.x1-A5.wallT-.03,A5.x1+.03,'Annex_sleeve_wall_'+h.id);stat.sleeves++;}
 const r=new T.Mesh(new T.CylinderGeometry(DECK_SLEEVE.r,DECK_SLEEVE.r,1.3,20,1,true),M5.sleeve);r.position.set(DECK_SLEEVE.x,5.57,-DECK_SLEEVE.y);r.name='Annex_sleeve_deck_core';deck.add(r);stat.sleeves++;
 root.add(deck,shell);return{group:root,deck,shell,stat};}
