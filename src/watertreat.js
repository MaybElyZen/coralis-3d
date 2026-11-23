import * as T from 'three';
import {box,cyl} from './building.js';
import {STAGES,WT_LINKS,INLINE,TERMINALS,PIPE_R,PZ,UNIT_R,STORE_R,A5,DECK_SLEEVE,NP_SIGN} from './stage5.js';
import {M} from './materials.js';import {M5} from './mat5.js';
import {G,path,arrow,hcyl,plate,badge} from './s5util.js';
const nm=s=>`WT_S${s.n}_${s.id}`;
function edges(g,geo,x,y,z){const l=new T.LineSegments(new T.EdgesGeometry(geo),M5.condEdge);l.position.set(x,z,-y);g.add(l);}
function unit(s,g){const[x,y]=s.pos,c=s.cond,body=c?M5.cond:M5.tank,r=UNIT_R-.08;
 const bx=(w,d,z0,z1,mat=body)=>{const m=box(g,x-w/2,y-d/2,z0,x+w/2,y+d/2,z1,mat,nm(s));if(c)edges(g,new T.BoxGeometry(w,z1-z0,d),x,y,(z0+z1)/2);return m;};
 switch(s.kind){
  case 'floc':bx(.9,.9,6,7.2);cyl(g,x,y,7.2,7.8,.03,M.steel,nm(s));box(g,x-.25,y-.03,7.55,x+.25,y+.03,7.6,M.steel,nm(s));break;
  case 'sed':bx(.95,.95,6,7.0,M5.tankClear);for(let i=-2;i<=2;i++)box(g,x-.4,y+i*.16-.01,6.2,x+.4,y+i*.16+.01,6.9,M5.membrane,nm(s));break;
  case 'sand':cyl(g,x,y,6,7.5,r,M5.tank,nm(s));{const d=new T.Mesh(new T.SphereGeometry(r,16,8,0,Math.PI*2,0,Math.PI/2),M5.tank);d.position.set(x,7.5,-y);d.name=nm(s);g.add(d);}cyl(g,x,y,6.15,6.55,r+.01,M5.sand,nm(s));break;
  case 'gac':cyl(g,x,y,6,7.5,r,M5.carbon,nm(s));{const d=new T.Mesh(new T.SphereGeometry(r,16,8,0,Math.PI*2,0,Math.PI/2),M5.carbon);d.position.set(x,7.5,-y);d.name=nm(s);g.add(d);}break;
  case 'uf':box(g,x-.45,y-.4,6,x+.45,y+.4,6.15,M5.box,nm(s));for(const z of[6.35,6.7,7.05])hcyl(g,'x',x,y,z,.9,.13,M5.membrane,nm(s));break;
  case 'uv':box(g,x-.45,y-.3,6,x+.45,y+.3,6.45,M5.box,nm(s));hcyl(g,'x',x,y,PZ,1.0,.12,M5.membrane,nm(s));hcyl(g,'x',x,y,PZ,.5,.135,M5.uv,nm(s));break;
  case 'chlor':bx(.6,.6,6,6.9);box(g,x-.2,y-.5,6,x+.2,y-.3,6.5,M5.box,nm(s));break;
  case 'test':box(g,x-.5,y-.4,6,x+.5,y+.4,6.8,M5.box,nm(s));box(g,x-.35,y-.3,6.8,x+.1,y+.1,7.05,M5.membrane,nm(s));cyl(g,x+.3,y,6.8,7.1,.03,M.steel,nm(s));break;
  case 'store':cyl(g,x,y,6,7.6,STORE_R,M5.tank,nm(s));{const d=new T.Mesh(new T.SphereGeometry(STORE_R,18,8,0,Math.PI*2,0,Math.PI/2.5),M5.tank);d.position.set(x,7.6,-y);d.scale.y=.5;d.name=nm(s);g.add(d);}break;}
}
export function buildWater(){
 const root=G('WATER TREATMENT'),room=G('WT_ROOM'),under=G('WT_UNDER'),inline=G('WT_INLINE'),out=G('WT_OUTLETS'),s1=G('WT_STAGE1'),stat={stages:0,units:0,links:0,arrows:0,terminals:0,signs:0};
 const grp={room,under,rain:inline};
 // stages 5-13: equipment in the Water Treatment Room
 for(const s of STAGES){const g=G(nm(s));
  if(s.kind==='badge'){badge(g,s.n,s.pos[0],s.pos[1],s.pos[2],s.cond,nm(s));(s.n===1?s1:inline).add(g);}
  else if(s.kind==='inline'){const I=INLINE,d=s.n===2?I.diverter:I.screen;hcyl(g,'x',d.x,I.y,I.z,d.len,d.r,M5.tank,nm(s));hcyl(g,'x',d.x,I.y,I.z,d.len*.5,d.r+.02,M5.pipe.raw,nm(s));
   if(s.n===2){cyl(g,d.x,I.y,I.chamber.z1,I.z-d.r,.05,M5.pipe.raw,nm(s));cyl(g,d.x,I.y,I.chamber.z0,I.chamber.z1,I.chamber.r,M5.tank,nm(s));}
   badge(g,s.n,d.x,I.y,I.z-.55-(s.n===2?.5:0),false,nm(s));inline.add(g);}
  else{unit(s,g);badge(g,s.n,s.pos[0],s.pos[1],s.n===13?8.4:7.9,s.cond,nm(s));room.add(g);stat.units++;}
  stat.stages++;}
 // arrow collars on the existing collector main so flow direction reads there too
 for(const x of INLINE.collars)arrow(inline,[x,INLINE.y,INLINE.z],'+x',INLINE.collarR/1.9,M5.arrow.raw,'WT_arrow');
 // pipes: four distinct colours, arrows on every run
 for(const[id,med,gk,pts]of WT_LINKS){stat.arrows+=path(grp[gk],pts,PIPE_R,M5.pipe[med],'WT_pipe_'+med,M5.arrow[med],'WT_arrow');stat.links++;}
 // sleeves already built in annex.js. Deck core sleeve is there too.
 // outlets outside the east wall: terminals, brackets, signs
 const X=A5.x1;
 for(const t of TERMINALS){const mat=t.np?M5.termNP:M5.termPot,nmT='WT_terminal_'+t.id;
  box(out,X+.4,t.y-.2,PZ-.25,X+.85,t.y+.2,PZ+.25,mat,nmT);box(out,X,t.y-.15,PZ-.35,X+.85,t.y+.15,PZ-.25,M5.bracket,nmT);stat.terminals++;
  plate(out,t.np?NP_SIGN:'POTABLE USE CONDITIONAL',X+.02,t.y,PZ+.65,.9,.22,t.np?'#6b2fa3':'#1f7a4a','#ffffff',t.np?'WT_sign_nonpotable':'WT_sign_potable');stat.signs++;}
 root.add(room,under,inline,out,s1);
 return{group:root,room,under,inline,out,s1,stat};}
