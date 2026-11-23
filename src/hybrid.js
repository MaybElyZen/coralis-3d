import * as T from 'three';
import {box,cyl} from './building.js';
import {HY,A5,POWER_CABLES,ENERGY_FLOWS} from './stage5.js';
import {M} from './materials.js';import {M5} from './mat5.js';
import {G,path,arrow,dirOf} from './s5util.js';
const P3=p=>new T.Vector3(p[0],p[2],-p[1]);
export function buildHybrid(){
 const root=G('HYBRID ENERGY'),room=G('HYB_ROOM'),roof=G('HYB_ROOF'),under=G('HYB_UNDER'),stat={vawt:0,anemometer:0,ems:0,battery:0,db:0,cables:0,flows:0},spin=[];
 // --- roof: 3 vertical-axis turbines + 1 anemometer mast (outside the canopy footprint) ---
 HY.vawt.forEach((v,i)=>{const g=G('Hyb_vawt_'+(i+1));cyl(g,v.x,v.y,A5.zRoof,A5.zRoof+HY.plinthH,.3,M.steel,'Hyb_vawt_plinth');
  const rot=new T.Group();rot.name='Hyb_vawt_'+(i+1)+'_rotor';rot.position.set(v.x,A5.zRoof+HY.plinthH,-v.y);
  const sh=new T.Mesh(new T.CylinderGeometry(.05,.05,2.5,12),M5.mast);sh.position.y=1.25;rot.add(sh);
  for(let k=0;k<3;k++){const a=k*2*Math.PI/3,R=HY.vawtR;
   const bl=new T.Mesh(new T.BoxGeometry(.05,2.1,.24),M5.blade);bl.position.set(R*Math.cos(a),1.25,R*Math.sin(a));bl.rotation.y=-a;bl.castShadow=true;rot.add(bl);
   for(const yy of[.35,2.15]){const ar=new T.Mesh(new T.BoxGeometry(R,.04,.04),M5.mast);ar.position.set(R/2*Math.cos(a),yy,R/2*Math.sin(a));ar.rotation.y=-a;rot.add(ar);}}
  g.add(rot);spin.push([rot,1.6+i*.35]);roof.add(g);stat.vawt++;});
 {const A=HY.anemo,g=G('Hyb_anemometer_mast');cyl(g,A.x,A.y,A5.zRoof,A5.zRoof+A.h,.03,M5.mast,'Hyb_anemometer_mast');
  const top=new T.Group();top.name='Hyb_anemometer_cups';top.position.set(A.x,A5.zRoof+A.h,-A.y);
  for(let k=0;k<3;k++){const a=k*2*Math.PI/3,ar=new T.Mesh(new T.BoxGeometry(.24,.02,.02),M5.mast);ar.position.set(.12*Math.cos(a),0,.12*Math.sin(a));ar.rotation.y=-a;top.add(ar);
   const c=new T.Mesh(new T.SphereGeometry(.06,10,8),M5.cup);c.position.set(.24*Math.cos(a),0,.24*Math.sin(a));top.add(c);}
  g.add(top);spin.push([top,4]);roof.add(g);stat.anemometer++;}
 // --- Energy Room equipment ---
 {const e=HY.ems;box(room,e.x0,e.y0,e.z0,e.x1,e.y1,e.z1,M5.ems,'Hyb_ems_cabinet');stat.ems++;
  const led=new T.Mesh(new T.SphereGeometry(.04,8,6),M.led);led.position.set((e.x0+e.x1)/2,(e.z0+e.z1)/2+.3,-(e.y0-.02));led.name='Hyb_ems_status_light';room.add(led);}
 HY.batt.forEach((b,i)=>{box(room,b.x-HY.battW/2,b.y-HY.battD/2,6,b.x+HY.battW/2,b.y+HY.battD/2,6+HY.battH,M5.battery,'Hyb_battery_cabinet_'+(i+1));stat.battery++;});
 {const d=HY.db;box(room,d.x0,d.y0,d.z0,d.x1,d.y1,d.z1,M5.db,'Hyb_db_distribution_board');stat.db++;}
 box(room,HY.bus.x-.05,HY.bus.y0,HY.bus.z-.05,HY.bus.x+.05,HY.bus.y1,HY.bus.z+.05,M5.bus,'Hyb_bus_battery');
 box(room,HY.tray.x0,HY.tray.y-.08,HY.tray.z-.07,HY.tray.x1,HY.tray.y+.08,HY.tray.z-.03,M5.tray,'Hyb_tray_ceiling');
 // --- cables (power colour) and static direction arrows ---
 const grp={roof,room,under};
 for(const[id,gk,pts]of POWER_CABLES){stat.cables+=1;path(grp[gk],pts,HY.cableR,M5.power,'Hyb_cable_'+id,['ems_to_bus','battery_to_db','feeder_building','feeder_marine','pv_dc_trunk'].includes(id)?M5.flow:null,'Hyb_flow_arrow');}
 // PV collector box under the canopy east strip, and conduit marker
 box(roof,HY.pv.box.x-.2,HY.pv.box.y-.15,HY.pv.box.z-.12,HY.pv.box.x+.2,HY.pv.box.y+.15,HY.pv.box.z+.12,M5.box,'Hyb_pv_collector_box');
 // load boxes under the deck
 const L=HY.loads;for(const[k,n]of[['building','Hyb_load_building_connection'],['marine','Hyb_load_marine_monitoring_supply']])box(under,L[k].x-.25,L[k].y-.2,L.boxZ0,L[k].x+.25,L[k].y+.2,L.boxZ1,M5.box,n);
 // --- animated flow arrows: Solar PV + Wind -> EMS -> Battery -> Building Loads + Marine Monitoring ---
 const flows=[];const cone=new T.ConeGeometry(.07,.2,10),up=new T.Vector3(0,1,0);
 for(const f of ENERGY_FLOWS){const pts=f.pts.map(P3),cum=[0];for(let i=1;i<pts.length;i++)cum.push(cum[i-1]+pts[i].distanceTo(pts[i-1]));
  for(let k=0;k<2;k++){const m=new T.Mesh(cone,M5.flow);m.name='Hyb_flow_pulse';root.add(m);flows.push({m,pts,cum,L:cum[cum.length-1],o:k/2+(f.id.length%5)*.07});stat.flows++;}}
 const place=(f,t)=>{const s=((t*.12+f.o)%1)*f.L;let i=1;while(i<f.cum.length-1&&f.cum[i]<s)i++;const a=f.pts[i-1],b=f.pts[i],k=(s-f.cum[i-1])/Math.max(1e-9,f.cum[i]-f.cum[i-1]);
  f.m.position.lerpVectors(a,b,k);f.m.quaternion.setFromUnitVectors(up,b.clone().sub(a).normalize());};
 root.add(roof,room,under);
 return{group:root,room,roof,under,stat,flows,update:t=>{spin.forEach(([o,s])=>o.rotation.y=t*s);flows.forEach(f=>place(f,t));},setFlows:v=>flows.forEach(f=>f.m.visible=v)};}
