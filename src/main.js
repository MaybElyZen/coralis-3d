import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {ENERGY_NOTE,LABELS5,FOCUS_LAYERS,STAGES,HY} from './stage5.js';import {buildAnnex} from './annex.js';import {buildHybrid} from './hybrid.js';import {buildWater} from './watertreat.js';import {makeHud} from './hud.js';
import {makeScene} from './scene.js';import {buildBuilding} from './building.js';import {buildCanopy,V} from './canopy.js';import {buildSolar} from './solar.js';import {buildRain} from './rainwater.js';
import {buildHabitat,buildSeabed,buildLife} from './underwater.js';import {buildSensors} from './sensors.js';import {initUI,infoFor,RISK} from './interface.js';
import {P,frames} from './params.js';import {M} from './materials.js';import {makeExplode} from './explode.js';import {makeLabels} from './labels.js';import {makePresentation} from './presentation.js';import {runSelfTest} from './selftest.js';
const st=document.getElementById('st'),canvas=document.getElementById('c');
try{
 const gl=canvas.getContext('webgl2')||canvas.getContext('webgl');if(!gl)throw new Error('no webgl');
 const {r,s,cam,sea,sky,hemi}=makeScene(canvas),model=new T.Group();model.name='CORALIS';
 const b=buildBuilding(),c=buildCanopy(),so=buildSolar(),ra=buildRain(),hab=buildHabitat(),sb=buildSeabed(),life=buildLife(),sen=buildSensors(),an=buildAnnex(),hy=buildHybrid(),wt=buildWater();
 model.add(b.group,c.group,so.group,ra.group,hab.group,hab.coral,sen.group,life.group,sb,an.group,hy.group,wt.group);s.add(model);
 const ex=makeExplode({b,c,so,ra,hab,sb,life,sen,an,hy,wt});
 const plane=new T.Plane(new T.Vector3(0,0,-1),1e6);model.traverse(o=>{if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.clippingPlanes=[plane]);});sea.material.clippingPlanes=[plane];
 const ctl=new OrbitControls(cam,canvas);ctl.enableDamping=true;ctl.dampingFactor=.08;ctl.minDistance=2.5;ctl.maxDistance=300;
 let tw=null;const setCam=v=>{cam.position.copy(V(...v.p));ctl.target.copy(V(...v.t));ctl.update();};
 const go=(k,dur=1.3)=>{const v=P.views[k];if(dur===0){setCam(v);tw=null;return;}tw={t:0,d:dur,p0:cam.position.clone(),g0:ctl.target.clone(),p1:V(...v.p),g1:V(...v.t)};};
 ctl.addEventListener('start',()=>tw=null);setCam(P.views.overall);
 const L={Building:b.group,Canopy:c.group,Solar:so.group,Rainwater:ra.group,Habitat:hab.group,Coral:hab.coral,Sensors:sen.group,'Marine life':life.group,'Sea surface':sea,'Services annex':an.group,'Hybrid energy':hy.group,'Water treatment':wt.group};
 const labels=makeLabels(cam,ex.offset,n=>L[n]?L[n].visible:true,LABELS5);let ui;
 const layerMap=()=>Object.fromEntries(Object.keys(L).map(k=>[k,L[k].visible]));
 const setLayer=(n,v)=>{L[n].visible=v;ui&&ui.syncLayers(layerMap());};
 const setLayers=list=>{for(const k of Object.keys(L))L[k].visible=list.includes(k);ui.syncLayers(layerMap());};
 const setLabels=v=>{labels.set(v);ui.syncLabels(v);};
 const hud=makeHud();
 const setFocus=k=>{labels.setMode(k);hud.show(k);};
 const focusView=k=>{setLayers(FOCUS_LAYERS[k]);setLabels(true);setFocus(k);go(k);};
 const secOff=()=>plane.set(new T.Vector3(0,0,-1),1e6);
 const sec=(k,dur=1.3)=>{if(k==='off'){secOff();return;}if(ex.on){ex.set(false,dur===0?0:.6);setLabels(false);}
  if(k==='sectionLong')plane.set(new T.Vector3(0,0,-1),-P.cut.long);else plane.set(new T.Vector3(-1,0,0),P.cut.cross);go(k,dur);};
 const explode=(on,dur=1.4)=>{if(on){secOff();ex.set(true,dur);go('exploded',dur);setLabels(true);}else{ex.set(false,dur);setLabels(false);}};
 const led0=M.led.color.clone();
 const setRisk=k=>{if(k==='off'||!RISK[k]){M.led.color.copy(led0);M.led.emissive.set(0x39e07a);ui.showRisk('off');return;}const col=new T.Color(RISK[k][1]);M.led.color.copy(col);M.led.emissive.copy(col);ui.showRisk(k);};
 const sel=new T.BoxHelper(new T.Object3D(),0xffd54a);sel.visible=false;s.add(sel);
 const reset=()=>{setFocus(null);secOff();explode(false,0);setRisk('off');setLayers(Object.keys(L));ui.hide();sel.visible=false;go('overall',1.2);};
 const chainView=['restoration','sensors','building','building','building','underwater'];
 const pres=makePresentation({setLayers,explode:(o,d)=>explode(o,d),labels:setLabels,sectionOff:secOff,risk:setRisk,go,focus:setFocus,caption:(...a)=>ui.caption(...a)});
 let ctx;
 const test=()=>runSelfTest(ctx);
 ui=initUI({layers:Object.keys(L).map(k=>[k,k]),onView:k=>{if(FOCUS_LAYERS[k])focusView(k);else{setFocus(null);go(k);}},onSection:sec,onExplode:o=>explode(o),onLayer:setLayer,onLabels:setLabels,onRisk:setRisk,onClose:()=>sel.visible=false,onChain:i=>go(chainView[i]),
  onPresent:()=>{ui.openPanel(false);pres.start();},onTest:test,onPres:k=>pres[k]()});
 document.getElementById('reset').onclick=reset;
 addEventListener('keydown',e=>{const k=e.key;if(pres.isOn()){if(k==='ArrowRight'||k===' '){e.preventDefault();pres.next();}else if(k==='ArrowLeft')pres.prev();else if(k==='Escape')pres.stop();}else if(k==='p'||k==='P'){ui.openPanel(false);pres.start();}else if(k==='t'||k==='T')test();});
 const ray=new T.Raycaster(),pt=new T.Vector2();let down=null;canvas.addEventListener('pointerdown',e=>down=[e.clientX,e.clientY]);
 canvas.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>5)return;pt.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);ray.setFromCamera(pt,cam);
  const hits=ray.intersectObjects([...model.children,sea].filter(o=>o.visible),true).filter(h=>h.object.visible&&plane.distanceToPoint(h.point)>=0);
  for(const h of hits){const i=infoFor(h.object);if(i){ui.show(i);let t=h.object;while(t.parent&&t.parent!==model&&!/^(Frame_|Coral_|Node_|Buoy|Canopy tree)/.test(t.name))t=t.parent;sel.setFromObject(t.parent===model&&t.children.length>40?h.object:t);sel.visible=true;return;}}
  ui.hide();sel.visible=false;});
 const fit=()=>{r.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();};addEventListener('resize',fit);fit();
 const clk=new T.Clock(),uw=new T.Color(0x1b6074),fog=new T.FogExp2(0x1b6074,.03);
 r.setAnimationLoop(()=>{const dt=clk.getDelta(),t=clk.elapsedTime;
  if(tw){tw.t=Math.min(1,tw.t+dt/tw.d);const k=tw.t*tw.t*(3-2*tw.t);cam.position.lerpVectors(tw.p0,tw.p1,k);ctl.target.lerpVectors(tw.g0,tw.g1,k);if(tw.t>=1)tw=null;}
  const below=cam.position.y<0.05;s.fog=below?fog:null;s.background=below?uw:null;sky.visible=!below;hemi.intensity=below?1.5:.9;
  life.update(t);sen.update(t);hy.update(t);ex.update(dt);labels.update();ctl.update();r.render(s,cam);});
 const ids=hab.group.children.filter(o=>o.name.startsWith('Frame_')),ctrl=ids.filter(o=>o.name.endsWith('CONTROL')).map(o=>o.name.slice(6,-8)),cor=hab.coral.children.map(o=>o.name.slice(6));
 let nodes=0;sen.group.traverse(o=>{if(/^Node_/.test(o.name))nodes++;});
 const rep={canopyTrees:c.stat.trunks,leafStrips:c.stat.strips,pvPanels:so.count.pv,tanks:ra.stat.tanks,frames:ids.length,controlFrames:ctrl.length,treatmentFrames:ids.length-ctrl.length,
  framesWithCoral:cor.length,controlFramesWithCoral:cor.filter(i=>ctrl.includes(i)).length,sensorNodes:nodes,fish:life.count.fish,
  annexSolids:an.stat.solids,vawt:hy.stat.vawt,anemometers:hy.stat.anemometer,ems:hy.stat.ems,batteryCabinets:hy.stat.battery,distributionBoards:hy.stat.db,waterStages:wt.stat.stages,conditionalStages:STAGES.filter(s=>s.cond).length,pipeRuns:wt.stat.links,terminals:wt.stat.terminals};
 ctx={an,hy,wt,hud,focusView,setFocus,rep,L,go,sec,explode,setLayer,setRisk,reset,plane,ex,pres,labels,cam,ctl,model,sea,c,so,ra,hab,sb,sen,M,frame0:frames()[0]&&{x:frames()[0].x}};
 ctx.frame0={x:V(frames()[0].x,frames()[0].y,frames()[0].z).x};
 window.__CORALIS=rep;window.__CORALIS_TEST=test;console.log('CORALIS Stage 5 self-check',rep,'explode groups missing:',ex.missing);
 st.textContent=`Conceptual proposal. ${rep.frames} frames (${rep.treatmentFrames} treatment, ${rep.controlFrames} control), ${rep.sensorNodes} sensor nodes, Services Annex with hybrid energy and 13-stage water treatment (all conceptual). No ecological outcome, energy or water performance, or engineering validation is claimed. Hoi Ha Wan is a Marine Park and study reference only, not an approved construction site; phase 1 is desk research, non-intrusive baseline research and authority consultation. Tap a part for details. Keys: P tour, T self-test.`;
}catch(e){console.error(e);st.textContent='';document.getElementById('err').style.display='flex';}
// ---- Stage 5: PWA — register the service worker (offline support) and show
// an offline indicator. Registration failure never breaks the app itself.
if('serviceWorker' in navigator){
 const hadController=!!navigator.serviceWorker.controller;let reloaded=false;
 navigator.serviceWorker.addEventListener('controllerchange',()=>{if(hadController&&!reloaded){reloaded=true;location.reload();}});
 addEventListener('load',()=>{navigator.serviceWorker.register('./sw.js').catch(e=>console.warn('Service worker registration failed',e));});
}
const netEl=document.getElementById('net');
const syncNet=()=>{if(netEl)netEl.style.display=navigator.onLine?'none':'block';};
addEventListener('online',syncNet);addEventListener('offline',syncNet);syncNet();
