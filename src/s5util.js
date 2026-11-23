import * as T from 'three';
import {cyl} from './building.js';
const ROT={'+x':[0,0,-Math.PI/2],'-x':[0,0,Math.PI/2],'+z':[0,0,0],'-z':[Math.PI,0,0],'+y':[-Math.PI/2,0,0],'-y':[Math.PI/2,0,0]};
export const dirOf=(a,b)=>{const d=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],n=d.filter(v=>Math.abs(v)>1e-9).length;if(n!==1)throw new Error('segment not axis-aligned '+JSON.stringify([a,b]));const i=d.findIndex(v=>Math.abs(v)>1e-9);return(d[i]>0?'+':'-')+'xyz'[i];};
export function hcyl(g,ax,x,y,z,len,r,mat,name){const m=new T.Mesh(new T.CylinderGeometry(r,r,len,16),mat);m.position.set(x,z,-y);if(ax==='x')m.rotation.z=Math.PI/2;else m.rotation.x=Math.PI/2;m.castShadow=true;if(name)m.name=name;g.add(m);return m;}
export function seg(g,a,b,r,mat,name){const d=dirOf(a,b),L=Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]);
 return d[1]==='z'?cyl(g,a[0],a[1],Math.min(a[2],b[2]),Math.max(a[2],b[2]),r,mat,name):hcyl(g,d[1],(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2,L,r,mat,name);}
export function arrow(g,p,d,r,mat,name){const m=new T.Mesh(new T.ConeGeometry(r*1.9,r*4.5,12),mat),e=ROT[d];m.rotation.set(e[0],e[1],e[2]);m.position.set(p[0],p[2],-p[1]);if(name)m.name=name;g.add(m);return m;}
// Pipe/cable polyline with elbow spheres and direction arrows (arrows point from first to last point).
export function path(g,pts,r,mat,name,arrowMat,arrowName){let n=0;
 for(let i=0;i<pts.length-1;i++){seg(g,pts[i],pts[i+1],r,mat,name);
  if(i>0){const j=new T.Mesh(new T.SphereGeometry(r*1.15,10,8),mat);j.position.set(pts[i][0],pts[i][2],-pts[i][1]);j.name=name;g.add(j);}
  if(arrowMat){const a=pts[i],b=pts[i+1],L=Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]);if(L<.45)continue;const k=Math.max(1,Math.round(L/2.5)),d=dirOf(a,b);
   for(let q=0;q<k;q++){const t=(q+.5)/k;arrow(g,[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t],d,r,arrowMat,arrowName);n++;}}}
 return n;}
export function plate(g,text,x,y,z,w,h,bg,fg,name){const c=document.createElement('canvas');c.width=1024;c.height=Math.round(1024*h/w);const x2=c.getContext('2d');x2.fillStyle=bg;x2.fillRect(0,0,c.width,c.height);
 x2.strokeStyle=fg;x2.lineWidth=8;x2.strokeRect(8,8,c.width-16,c.height-16);x2.fillStyle=fg;x2.textAlign='center';x2.textBaseline='middle';x2.font='bold 100px sans-serif';
 const k=Math.min(1,(c.width-80)/x2.measureText(text).width);x2.font=`bold ${Math.floor(100*k)}px sans-serif`;x2.fillText(text,c.width/2,c.height/2);
 const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:t}));m.rotation.y=Math.PI/2;m.position.set(x,z,-y);m.name=name;g.add(m);return m;}
export function badge(g,n,x,y,z,cond,name){const c=document.createElement('canvas');c.width=c.height=128;const q=c.getContext('2d');q.fillStyle='#0d3b4a';q.beginPath();q.arc(64,64,56,0,7);q.fill();
 q.strokeStyle=cond?'#ffc857':'#ffffff';q.lineWidth=7;if(cond)q.setLineDash([12,9]);q.beginPath();q.arc(64,64,56,0,7);q.stroke();q.fillStyle='#fff';q.font='bold 64px sans-serif';q.textAlign='center';q.textBaseline='middle';q.fillText(String(n),64,68);
 const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;const s=new T.Sprite(new T.SpriteMaterial({map:t}));s.scale.set(.55,.55,1);s.position.set(x,z,-y);s.name=name;g.add(s);return s;}
export const G=n=>{const g=new T.Group();g.name=n;return g;};
