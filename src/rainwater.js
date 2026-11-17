import * as T from 'three';
import {P,strips,leafZ,leafX} from './params.js';
import {M} from './materials.js';
import {tube,V} from './canopy.js';
import {box,cyl} from './building.js';
export function buildRain(){
 const g=new T.Group();g.name='RAINWATER';const C=P.canopy,L=C.leaf,st=strips(),stat={gutters:0,downpipes:0,tanks:0};
 for(const s of st){const zb=y=>leafZ(s,y)-L.t-.14,y0=L.y0;
  const gm=new T.Mesh(new T.BoxGeometry(L.w,.16,.16),M.gutter);gm.position.set(leafX(s,y0),leafZ(s,y0)-L.t/2,-y0+.08);gm.name='Gutter';g.add(gm);stat.gutters++;
  if(s.dx===0){const zt=C.peak[s.xc]-3.5;g.add(tube([V(leafX(s,y0),y0,zb(y0)),V(leafX(s,-1),-1,zb(-1)),V(leafX(s,3),3,zb(3)),V(leafX(s,9),9,zb(9)),V(s.xc+.3,9.2,zt+.05)],.05,.05,M.pipe,16,6));}
  else g.add(tube([V(leafX(s,y0),y0,zb(y0)),V(leafX(s,3),3,zb(3)),V(leafX(s,9),9,zb(9)),V(s.xc+.3,9.2,C.peak[s.xc]-3.4)],.04,.04,M.pipe,14,6));}
 const my=P.pipes.mainY,mz=P.pipes.mainZ;
 for(const xc of C.xs){const px=xc+(xc===C.trunk.stackX?.9:.62);cyl(g,px,9,mz,C.peak[xc]-3.4,.06,M.pipe,'Downpipe');stat.downpipes++;box(g,px-.06,9,mz-.06,px+.06,my,mz+.06,M.pipe);}
 box(g,6.5,my-.07,mz-.07,46.5,my+.07,mz+.07,M.pipe,'Collector main under deck');box(g,46.43,my,mz-.07,46.57,12.25,mz+.07,M.pipe);cyl(g,46.5,12.25,mz,6.5,.07,M.pipe,'Riser');
 box(g,41.5,12.18,6.43,46.57,12.32,6.57,M.pipe,'Manifold');
 for(const[x,y]of P.tanks.pos){const t=P.tanks,m=new T.Mesh(new T.CylinderGeometry(t.r,t.r,t.h,32),M.tank);m.position.set(x,6+t.h/2,-y);m.name='Rainwater tank (about 10 m3)';m.castShadow=true;g.add(m);stat.tanks++;
  const lid=new T.Mesh(new T.SphereGeometry(t.r,24,8,0,Math.PI*2,0,Math.PI/6),M.tank);lid.position.set(x,6+t.h,-y);lid.scale.y=.5;g.add(lid);
  for(const dz of[.4,t.h-.4]){const r=new T.Mesh(new T.TorusGeometry(t.r+.01,.03,6,32),M.steel);r.rotation.x=Math.PI/2;r.position.set(x,6+dz,-y);g.add(r);}}
 for(const x of[41.5,44.5])box(g,x-.04,13.5,6.43,x+.04,16.5,6.57,M.pipe,'Tank link');
 return{group:g,stat};}
