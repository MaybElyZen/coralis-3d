import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {P,frames,sbz,seabedH} from './params.js';
import {M} from './materials.js';
import {V} from './canopy.js';
const rnd=(s=>()=>(s=(s*16807)%2147483647)/2147483647)(11);
function frameGeo(){const {w,h}=P.hab.frame,b=.04,p=[];const bx=(a,c,d,x,y,z)=>{const g=new T.BoxGeometry(a,c,d);g.translate(x,y,z);p.push(g);};
 for(const sx of[-1,1])for(const sz of[-1,1])bx(b,h,b,sx*(w/2-b/2),0,sz*(w/2-b/2));
 for(const yy of[-1,0,1]){const y=yy*(h/2-b/2);for(const s of[-1,1]){bx(b,b,w,s*(w/2-b/2),y,0);bx(w,b,b,0,y,s*(w/2-b/2));}}
 return mergeGeometries(p);}
const tileTop={0:.225,1:.27,2:.385};
export function buildHabitat(){
 const g=new T.Group();g.name='HABITAT';const cg=new T.Group();cg.name='CORAL';const H=P.hab,fg=frameGeo(),tg=new T.BoxGeometry(H.frame.tile,.05,H.frame.tile);
 const cs=[],mk=(a,c)=>{const q=new T.ConeGeometry(.012,.12,5);q.translate(0,.06,0);q.rotateZ(a);q.rotateY(c);return q;};
 const branching=mergeGeometries([mk(0,0),mk(.5,0),mk(-.5,1.6),mk(.45,3.2),mk(-.4,4.6)]),plate=new T.CylinderGeometry(.07,.05,.025,10);plate.translate(0,.0125,0);
 const mass=new T.SphereGeometry(.05,10,6,0,Math.PI*2,0,Math.PI/2);const kinds=[[branching,M.coralA],[plate,M.coralB],[mass,M.coralC]];
 const spots=[[-.4,-.4],[0,.4],[.4,0]],hang=[],stat={frames:0,control:0,treatment:0,coralFrames:0,coralOnControl:0};
 for(const f of frames()){
  const fr=new T.Group();fr.name=`Frame_${f.id}_${f.control?'CONTROL':'TREATMENT'}`;fr.position.copy(V(f.x,f.y,f.z));
  const fm=new T.Mesh(fg,f.control?M.frameC:M.frameT);fm.castShadow=true;fr.add(fm);
  const tiles=new T.InstancedMesh(tg,M.tile,18),m=new T.Matrix4(),o=new T.Object3D();let i=0;
  for(const ly of[-.2,.2])for(const a of[-.4,0,.4])for(const c of[-.4,0,.4]){o.position.set(a,ly,c);o.rotation.set(0,0,0);
   if(f.v===1)o.rotation.z=((i+f.ci)%2?.45:-.45);if(f.v===2)o.rotation.x=Math.PI/2;o.updateMatrix();tiles.setMatrixAt(i++,o.matrix);}
  tiles.name='Tiles';fr.add(tiles);
  if(f.control){const r=new T.Mesh(new T.CylinderGeometry(.01,.01,.5,6),M.marker),s=new T.Mesh(new T.SphereGeometry(.06,10,8),M.marker);r.position.y=.65;s.position.y=.93;fr.add(r,s);stat.control++;}
  else{stat.treatment++;const c=new T.Group();c.name=`Coral_${f.id}`;c.position.copy(fr.position);
   for(let k=0;k<H.coralPerFrame;k++){const [geo,mat]=kinds[(k+f.ci)%3],cm=new T.Mesh(geo,mat);cm.position.set(spots[k][0],tileTop[f.v],spots[k][1]);cm.scale.setScalar(.8+rnd()*.5);cm.rotation.y=rnd()*6;cm.castShadow=true;c.add(cm);}cg.add(c);stat.coralFrames++;}
  g.add(fr);stat.frames++;
  for(const s of[-.5,.5])hang.push(V(f.x+s,f.y,f.z+.4),V(f.x+s,f.y,5.0));}
 const lg=new T.BufferGeometry().setFromPoints(hang);const ln=new T.LineSegments(lg,new T.LineBasicMaterial({color:0x9fb3bd,transparent:true,opacity:.6}));ln.name='Suspension lines (conceptual)';g.add(ln);
 return{group:g,coral:cg,stat};}
export function buildSeabed(){
 const S=P.seabed,[sx,sy]=S.seg,pos=[],col=[],ix=[];
 for(let j=0;j<=sy;j++)for(let i=0;i<=sx;i++){const X=S.x0+(S.x1-S.x0)*i/sx,Y=S.y0+(S.y1-S.y0)*j/sy,z=seabedH(X,Y);pos.push(X,z,-Y);
  const land=X<-36?1:0,k=.5+.5*Math.sin(X*.37+Y*.23);col.push(.62+.12*k+land*.05,.58+.1*k-land*.04,.46+.08*k-land*.1);}
 for(let j=0;j<sy;j++)for(let i=0;i<sx;i++){const a=j*(sx+1)+i,b=a+1,c=a+sx+1,d=c+1;ix.push(a,c,b,b,c,d);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('color',new T.Float32BufferAttribute(col,3));g.setIndex(ix);g.computeVertexNormals();
 const m=new T.Mesh(g,M.seabed);m.name='Seabed (conceptual, not surveyed)';m.receiveShadow=true;return m;}
export function buildLife(){
 const g=new T.Group();g.name='LIFE';const L=P.life,n=L.orbits.length*L.fishPerOrbit;
 const body=new T.SphereGeometry(1,10,6);body.scale(.5,.18,.12);const tail=new T.ConeGeometry(.14,.3,4);tail.rotateZ(Math.PI/2);tail.translate(-.55,0,0);tail.scale(1,1,.3);
 const fg=mergeGeometries([body,tail]),fish=new T.InstancedMesh(fg,M.fish,n);fish.name='Fish (illustrative, not species-specific)';
 const cols=[0xb9c4ca,0x8a98a0,0x3a4650,0xc9b27a].map(c=>new T.Color(c)),F=[];
 L.orbits.forEach((o,oi)=>{for(let k=0;k<L.fishPerOrbit;k++){const idx=F.length;F.push({o,ph:rnd()*6.28,sp:(.12+rnd()*.1)*(k%2?1:-1),r:o[3]*(.75+.12*k),s:.2+rnd()*.12,dz:rnd()*6});fish.setColorAt(idx,cols[(oi+k)%4]);}});
 const d=new T.Object3D(),upd=t=>{F.forEach((f,i)=>{const a=f.ph+t*f.sp,X=f.o[0]+f.r*Math.cos(a),Y=f.o[1]+f.r*Math.sin(a),dir=Math.sign(f.sp);
  d.position.set(X,f.o[2]+.25*Math.sin(a*2+f.dz),-Y);d.rotation.set(0,Math.atan2(dir*Math.cos(a),-dir*Math.sin(a)),0);d.scale.setScalar(f.s);d.updateMatrix();fish.setMatrixAt(i,d.matrix);});fish.instanceMatrix.needsUpdate=true;};
 upd(0);g.add(fish);
 const ug=new T.IcosahedronGeometry(.09,0),ur=new T.InstancedMesh(ug,M.urchin,L.urchins.length);ur.name='Sea urchins (illustrative)';
 L.urchins.forEach((p,i)=>{d.position.set(p[0],seabedH(p[0],p[1])+.05,-p[1]);d.rotation.set(0,0,0);d.scale.setScalar(1);d.updateMatrix();ur.setMatrixAt(i,d.matrix);});g.add(ur);
 const rk=new T.InstancedMesh(new T.DodecahedronGeometry(1,0),M.rock,L.rocks);rk.name='Seabed boulders (illustrative)';let n2=0;
 while(n2<L.rocks){const X=2+rnd()*68,Y=-25+rnd()*65,F0=P.hab.field;if(X>F0.x0-1.5&&X<F0.x1+1.5&&Y>F0.y0-1.5&&Y<F0.y1+1.5)continue;
  if(P.piles.xs.some(x=>P.piles.ys.some(y=>Math.hypot(x-X,y-Y)<1.8)))continue;const s=.25+rnd()*.45;d.position.set(X,seabedH(X,Y)+s*.3,-Y);d.rotation.set(rnd(),rnd()*6,rnd());d.scale.set(s,s*.6,s*.9);d.updateMatrix();rk.setMatrixAt(n2++,d.matrix);}
 g.add(rk);return{group:g,update:upd,count:{fish:n}};}
