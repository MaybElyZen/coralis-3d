import * as T from 'three';
import {P} from './params.js';
import {M} from './materials.js';
const G=n=>{const g=new T.Group();g.name=n;return g;};
export function box(g,x0,y0,z0,x1,y1,z1,mat,name){const m=new T.Mesh(new T.BoxGeometry(x1-x0,z1-z0,y1-y0),mat);
 m.position.set((x0+x1)/2,(z0+z1)/2,-(y0+y1)/2);m.castShadow=mat.opacity>.9;m.receiveShadow=true;if(name)m.name=name;g.add(m);return m;}
export function cyl(g,x,y,z0,z1,r,mat,name){const m=new T.Mesh(new T.CylinderGeometry(r,r,z1-z0,20),mat);m.position.set(x,(z0+z1)/2,-y);m.castShadow=true;if(name)m.name=name;g.add(m);return m;}
export function wall(g,ax,ay,bx,by,z0,z1,mat,th=.1,gaps=[]){const L=Math.hypot(bx-ax,by-ay),ux=(bx-ax)/L,uy=(by-ay)/L,c=[0,...gaps.flat(),L];
 for(let i=0;i<c.length;i+=2){const a=c[i],b=c[i+1];if(b-a<.01)continue;const X=[ax+ux*a,ax+ux*b],Y=[ay+uy*a,ay+uy*b];
  box(g,Math.min(...X)-(uy?th/2:0),Math.min(...Y)-(ux?th/2:0),z0,Math.max(...X)+(uy?th/2:0),Math.max(...Y)+(ux?th/2:0),z1,mat);}}
function rail(g,ax,ay,bx,by,z){wall(g,ax,ay,bx,by,z+1.0,z+1.06,M.steel,.06);wall(g,ax,ay,bx,by,z+.5,z+.52,M.steel,.03);
 const L=Math.hypot(bx-ax,by-ay),n=Math.ceil(L/2);for(let i=0;i<=n;i++){const x=ax+(bx-ax)*i/n,y=ay+(by-ay)*i/n;box(g,x-.03,y-.03,z,x+.03,y+.03,z+1.06,M.steel);}}
export const seabedZ=x=>x<0?-1-4*(x+36)/36:-5;
export function buildBuilding(){
 const root=G('BUILDING'),A=P.piles;
 const deck=G('DECK');box(deck,0,0,5,48,18,5.9,M.concrete,'Deck slab');box(deck,0,0,5.9,48,18,6,M.timber,'Timber deck finish');
 box(deck,16,6,5.92,32,12,6.02,M.grating,'Observation grating (spine)');
 box(deck,-36,7.5,5,0,10.5,5.9,M.concrete,'Boardwalk');box(deck,-36,7.5,5.9,0,10.5,6,M.timber);
 box(deck,-46,3,5.5,-36,15,6,M.land,'Shore promenade (placeholder)');
 rail(deck,-36,7.5,0,7.5,6);rail(deck,-36,10.5,0,10.5,6);rail(deck,16,0,32,0,6);rail(deck,16,18,32,18,6);
 root.add(deck);
 const piles=G('PILES');
 for(const x of A.xs)for(const y of A.ys)cyl(piles,x,y,-5,5,.5,M.pile,'Main pile');
 for(const x of A.bw.xs)for(const y of A.bw.ys)cyl(piles,x,y,seabedZ(x),5,.25,M.pile,'Boardwalk pile');
 root.add(piles);
 const encl=G('ENCLOSURE'),glass=G('GLASS'),roofs=G('ROOFS'),l2=G('LEVEL2'),inter=G('INTERIOR');
 const door=[[7.5,10.5]];
 wall(glass,0,0,16,0,6,10,M.glass);wall(glass,0,18,16,18,6,10,M.glass);wall(glass,0,0,0,18,6,10,M.glass,.1,door);wall(glass,16,0,16,18,6,10,M.glass,.1,door);
 box(roofs,-.2,-.2,9.7,16.2,18.2,10,M.white,'Roof Zone A');
 wall(glass,32,0,48,0,6,9.6,M.glass);wall(glass,32,18,48,18,6,9.6,M.glass);wall(glass,48,0,48,18,6,9.6,M.glass);wall(glass,32,0,32,18,6,9.6,M.glass,.1,[[7,9]]);
 for(const b of[[32,0,48,10.3],[32,11.7,48,18],[32,10.3,40.5,11.7],[45.3,10.3,48,11.7]])box(l2,b[0],b[1],9.6,b[2],b[3],10,M.concrete,'Level 2 slab');
 wall(glass,32,0,48,0,10,13.7,M.glass);wall(glass,32,18,48,18,10,13.7,M.glass);wall(glass,48,0,48,18,10,13.7,M.glass);wall(glass,32,0,32,18,10,13.7,M.glass);
 box(roofs,31.8,-.2,13.7,48.2,18.2,14,M.white,'Roof Zone C');
 const seen=new Set(),zp={A:[0,16],C:[32,48]};
 const part=(x0,y0,x1,y1,z0,z1,zone)=>{const E=[[x0,y0,x1,y0],[x1,y0,x1,y1],[x1,y1,x0,y1],[x0,y1,x0,y0]];
  for(const[a,b,c,d]of E){const k=[a,b,c,d].map(v=>Math.round(v*10)).sort((p,q)=>p-q).join()+z0;if(seen.has(k))continue;seen.add(k);
   const per=(a===c&&(a===zp[zone][0]||a===zp[zone][1]))||(b===d&&(b===0||b===18));if(per)continue;wall(inter,a,b,c,d,z0,z1,M.white,.12);}};
 for(const r of P.L1)if(r[5]!=='B')part(r[1],r[2],r[3],r[4],6,9.6,r[5]);
 for(const r of P.L2)part(r[1],r[2],r[3],r[4],10,13.7,'C');
 box(inter,44.5,6.5,6,46.5,8.5,14,M.steel,'Lift shaft');
 for(let i=0;i<16;i++)box(inter,40.6+i*.28,10.4,6,40.6+(i+1)*.28,11.6,6.25+i*.25,M.concrete,'Stair');
 const F=(x,y,w,d,h,m=M.furn,z=6)=>box(inter,x-w/2,y-d/2,z,x+w/2,y+d/2,z+h,m,'Furniture');
 [[3,12],[10,12],[13,15],[3,16],[10,16],[13,9]].forEach(p=>F(p[0],p[1],1.2,1.2,.9));F(6,2.5,3,.8,1);
 [[34,2],[34,5],[37.5,2],[37.5,5]].forEach(p=>F(p[0],p[1],3,1,.9,M.bench));[[34,12],[37.5,12],[34,16],[37.5,16]].forEach(p=>F(p[0],p[1],3,1,.75));
 [[34,2],[34,5],[37.5,2]].forEach(p=>F(p[0],p[1],2.6,.9,.75,M.furn,10));F(44,3,4,1.2,.75,M.furn,10);[[34,12],[37.5,12],[34,16]].forEach(p=>F(p[0],p[1],3,1,.75,M.furn,10));F(44,15,3,1.2,.75,M.furn,10);
 [[19,15],[23,15],[27,15],[30,16.5]].forEach(p=>F(p[0],p[1],3,.5,.45,M.timber));
 encl.add(glass,roofs);root.add(encl,l2,inter);
 return{group:root};
}
