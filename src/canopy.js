import * as T from 'three';
import {P,strips,leafZ,leafX} from './params.js';
import {M} from './materials.js';
export const V=(x,y,z)=>new T.Vector3(x,z,-y);
export function tube(pts,r0,r1,mat,seg=20,rad=10){
 const c=new T.CatmullRomCurve3(pts,false,'catmullrom',.5),p=c.getPoints(seg),f=c.computeFrenetFrames(seg,false),pos=[],idx=[];
 for(let i=0;i<=seg;i++){const r=r0+(r1-r0)*i/seg;for(let j=0;j<rad;j++){const a=j/rad*Math.PI*2,n=f.normals[i].clone().multiplyScalar(Math.cos(a)).add(f.binormals[i].clone().multiplyScalar(Math.sin(a)));pos.push(p[i].x+n.x*r,p[i].y+n.y*r,p[i].z+n.z*r);}}
 for(let i=0;i<seg;i++)for(let j=0;j<rad;j++){const a=i*rad+j,b=i*rad+(j+1)%rad;idx.push(a,a+rad,b,b,a+rad,b+rad);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();
 const m=new T.Mesh(g,mat);m.castShadow=true;return m;}
function leafMesh(s){const L=P.canopy.leaf,ys=[];for(let y=L.y0;y<=L.y1+1e-9;y+=.5)ys.push(y);const v=[],ix=[];
 for(const y of ys){const cx=leafX(s,y),z=leafZ(s,y),h=L.w/2;v.push(cx-h,z,-y,cx+h,z,-y,cx-h,z-L.t,-y,cx+h,z-L.t,-y);}
 const q=(a,b,c,d)=>ix.push(a,b,c,b,d,c);
 for(let i=0;i<ys.length-1;i++){const a=i*4,b=a+4;q(a,a+1,b,b+1);q(a+2,b+2,a+3,b+3);q(a,b,a+2,b+2);q(a+1,a+3,b+1,b+3);}
 const e=(a)=>{q(a,a+2,a+1,a+3)};e(0);const l=(ys.length-1)*4;ix.push(l,l+1,l+2,l+1,l+3,l+2);
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(v,3));g.setIndex(ix);g.computeVertexNormals();
 const m=new T.Mesh(g,M.leaf);m.castShadow=true;m.receiveShadow=true;return m;}
export function buildCanopy(){
 const root=new T.Group();root.name='CANOPY';const C=P.canopy,st=strips(),stat={trunks:0,strips:0,branches:0,joints:0};const jointG=new T.SphereGeometry(1,12,8);
 const joint=(g,p,r)=>{const m=new T.Mesh(jointG,M.steel);m.scale.setScalar(r);m.position.copy(p);m.castShadow=true;g.add(m);stat.joints++;};
 
 for(const xc of C.xs){const g=new T.Group();g.name='Canopy tree X'+xc;const mine=st.filter(s=>s.xc===xc),zt=C.peak[xc]-3.5,stack=xc===C.trunk.stackX;
  const r0=stack?C.trunk.stackR0:C.trunk.r0,r1=stack?C.trunk.stackR1:C.trunk.r1;
  const tr=tube([V(xc,9,6),V(xc+.1,8.95,6+(zt-6)*.35),V(xc-.08,9.05,6+(zt-6)*.7),V(xc,9,zt)],r0,r1,stack?M.stack:M.branch,24,16);tr.name=stack?'Hollow stack trunk X'+xc:'Trunk X'+xc;g.add(tr);stat.trunks++;
  const T0=V(xc,9,zt);joint(g,T0,.42);
  for(const s of mine){const zb=y=>leafZ(s,y)-C.leaf.t-.02,X=y=>leafX(s,y),pt=(y,dz=0)=>V(X(y),y,zb(y)+dz);
   const A=pt(9),mid=V((xc+X(9))/2+Math.sign(s.dx||1)*.25,9,(zt+zb(9))/2+.35);
   g.add(tube([T0,mid,A],.26,.17,M.branch,12,8));stat.branches++;joint(g,A,.22);
   for(const yk of[3,15]){const B=pt(yk);g.add(tube([A,V((X(9)+X(yk))/2,(9+yk)/2,(zb(9)+zb(yk))/2-.35),B],.17,.12,M.branch,10,8));stat.branches++;joint(g,B,.16);
}
   for(const[yk,ye]of[[3,-3],[15,20.5]]){const B=pt(yk),E=pt(ye);g.add(tube([B,V((X(yk)+X(ye))/2,(yk+ye)/2,(zb(yk)+zb(ye))/2-.25),E],.12,.07,M.branch,8,6));stat.branches++;joint(g,E,.1);}
   const lm=leafMesh(s);lm.name=`Leaf X${xc} dx${s.dx}`;g.add(lm);stat.strips++;}
  root.add(g);}
 return{group:root,stat};}
