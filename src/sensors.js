import * as T from 'three';
import {P} from './params.js';
import {M} from './materials.js';
import {tube,V} from './canopy.js';
const cy=(g,r,h,mat,x,y,z)=>{const m=new T.Mesh(new T.CylinderGeometry(r,r,h,12),mat);m.position.set(x,y,z);m.castShadow=true;g.add(m);return m;};
function node(id,x,y,z,ref){const n=new T.Group();n.name='Node_'+id;n.position.copy(V(x,y,z));const len=z+5.05;
 cy(n,.025,len,M.probe,0,-len/2,0);cy(n,.09,.4,M.nodeBody,0,0,0);
 const ring=new T.Mesh(new T.TorusGeometry(.095,.018,6,16),ref?M.nodeR:M.nodeH);ring.rotation.x=Math.PI/2;ring.position.y=.12;n.add(ring);
 cy(n,.05,.012,M.white,0,.21,0);cy(n,.008,.25,M.probe,.07,-.3,0);cy(n,.02,.08,M.probe,-.07,-.24,0);cy(n,.015,.2,M.probe,0,-.28,.07);
 const tip=new T.Mesh(new T.SphereGeometry(.02,8,6),M.marker);tip.position.set(0,-.39,.07);n.add(tip);return n;}
export function buildSensors(){
 const g=new T.Group();g.name='SENSORS';const N=P.nodes;
 const cab=(pts,name,r=.016)=>{const t=tube(pts.map(p=>V(...p)),r,r,M.cable,pts.length*8,6);t.name=name;g.add(t);return t;};
 for(const h of N.habitat)g.add(node(h.id,h.x,h.y,h.z,false));g.add(node('R',N.ref.x,N.ref.y,N.ref.z,true));
 const J=N.junction,jb=new T.Mesh(new T.BoxGeometry(.15,.25,.2),M.nodeBody);jb.position.copy(V(J.x+.07,J.y,J.z));jb.name='Cable junction (on pile)';g.add(jb);
 const toJ=[[[24,13,-2.0],[24,11,-2.2],[24,9.6,-2.6],[26.5,9.2,-2.6],[29.3,9,-2.3],[J.x,J.y,J.z]],
  [[24,5,-3.5],[24,7,-3.3],[24,8.4,-2.9],[26.5,8.8,-2.9],[29.3,9,-2.4],[J.x,J.y,J.z]],[[24,9,-3.0],[26,9,-2.7],[29.3,9,-1.5],[J.x,J.y,J.z]]];
 const names=['H1','H2','H3'];toJ.forEach((p,i)=>cab(p,`Cable_${names[i]}_to_junction`));
 const C=N.conduit,Gw=N.gateway,Ms=N.mast;
 const riser=[[J.x,J.y,J.z],[J.x,J.y,4.85],[J.x+.1,9.7,4.85],[C.x,9.7,4.85],[C.x,C.y,4.85],[C.x,C.y,C.zTop],[C.x-.1,C.y-.1,C.zTop+.3],[Gw.x+.25,Gw.y+.2,Gw.z+.9]];
 cab(riser,'Cable_data_riser_to_gateway',.03);
 const gw=new T.Mesh(new T.BoxGeometry(.5,1.2,.4),M.nodeBody);gw.position.copy(V(Gw.x,Gw.y,Gw.z+.6));gw.name='Gateway_control_room';g.add(gw);
 const led=new T.Mesh(new T.SphereGeometry(.03,8,6),M.led);led.position.copy(V(Gw.x+.26,Gw.y,Gw.z+1.0));g.add(led);
 cab([[Gw.x,Gw.y,Gw.z+1.2],[Gw.x,Gw.y-.6,12.4],[Ms.x,Ms.y,Ms.z0]],'Cable_gateway_to_roof_mast',.02);
 const mast=cy(g,.03,Ms.z1-Ms.z0,M.steel,0,0,0);mast.position.copy(V(Ms.x,Ms.y,(Ms.z0+Ms.z1)/2));mast.name='Roof_antenna_mast';
 const B=N.buoy,R=N.ref;
 const buoy=new T.Group();buoy.name='Buoy_reference';buoy.position.copy(V(B.x,B.y,B.z));
 const fl=new T.Mesh(new T.SphereGeometry(.45,16,10),M.buoy);fl.scale.y=.8;buoy.add(fl);cy(buoy,.03,1.6,M.steel,0,.9,0);
 const sp=new T.Mesh(new T.BoxGeometry(.5,.02,.4),M.pv);sp.position.set(0,1.45,0);sp.rotation.x=-.4;buoy.add(sp);cy(buoy,.01,.6,M.probe,0,1.9,0);
 const bl=new T.Mesh(new T.SphereGeometry(.04,8,6),M.led);bl.position.y=2.2;buoy.add(bl);g.add(buoy);
 const anc=new T.Mesh(new T.BoxGeometry(.6,.3,.6),M.rock);anc.position.copy(V(R.x+1.2,R.y,-4.85));anc.name='Mooring_anchor_block_conceptual';g.add(anc);
 const moor=new T.Line(new T.BufferGeometry().setFromPoints([V(B.x,B.y,B.z-.3),V(R.x+1.2,R.y,-4.7)]),new T.LineBasicMaterial({color:0x888888}));moor.name='Mooring line';g.add(moor);
 cab([[R.x,R.y,R.z+.2],[R.x+.3,R.y+.2,-1.6],[B.x,B.y,B.z-.35]],'Cable_R_to_buoy');
 const wp=[[B.x,B.y,B.antennaZ],[70,7,9],[55,6,13],[Ms.x,Ms.y,Ms.z1]].map(p=>V(...p)),wc=new T.CatmullRomCurve3(wp);
 const wl=new T.Line(new T.BufferGeometry().setFromPoints(wc.getPoints(60)),new T.LineDashedMaterial({color:0xffc857,dashSize:1.2,gapSize:.8}));wl.computeLineDistances();wl.name='Wireless_link_buoy_to_building';g.add(wl);
 const paths=toJ.map(p=>[...p,...riser.slice(1)]).map(p=>new T.CatmullRomCurve3(p.map(q=>V(...q))));
 paths.push(new T.CatmullRomCurve3([...wp,V(Ms.x,Ms.y,Ms.z0),V(Gw.x,Gw.y,Gw.z+1.2)]));
 const pk=[],pg=new T.SphereGeometry(.07,8,6);paths.forEach((c,i)=>{for(let k=0;k<3;k++){const m=new T.Mesh(pg,M.packet);m.name='Data_packet_illustrative';g.add(m);pk.push({m,c,o:k/3+i*.13});}});
 return{group:g,update:t=>pk.forEach(p=>p.m.position.copy(p.c.getPointAt((t*.06+p.o)%1)))};}
