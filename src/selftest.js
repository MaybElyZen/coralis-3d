import {P} from './params.js';
import {V} from './canopy.js';
import {infoFor,RISK} from './interface.js';
import {STEPS} from './presentation.js';import {STAGES,ENERGY_NOTE,POTABLE_NOTE,NP_SIGN,LABELS5,FOCUS_LAYERS,PIPE_MEDIA} from './stage5.js';
// In-browser self-test. Press T (or use the Presentation menu). It only calls the same functions the buttons use.
export function runSelfTest(x){
 const R=[],t=(n,f)=>{try{const v=f();R.push([n,Array.isArray(v)?v[0]:v!==false,Array.isArray(v)?v[1]:'']);}catch(e){R.push([n,false,String(e.message||e)]);}};
 const near=(a,b)=>a.distanceTo(b)<1e-6,names=Object.keys(x.L),find=re=>{let o=null;x.model.traverse(q=>{if(!o&&re.test(q.name))o=q;});if(!o&&x.sea&&re.test(x.sea.name))o=x.sea;return o;};
 const r=x.rep;
 t('Counts: 32 frames, 28 treatment, 4 control',()=>[r.frames===32&&r.treatmentFrames===28&&r.controlFrames===4,JSON.stringify([r.frames,r.treatmentFrames,r.controlFrames])]);
 t('Counts: 28 frames with coral, 0 controls with coral',()=>[r.framesWithCoral===28&&r.controlFramesWithCoral===0,r.framesWithCoral+'/'+r.controlFramesWithCoral]);
 t('Counts: 4 sensor nodes, 4 trees, 12 strips, 228 PV, 4 tanks',()=>[r.sensorNodes===4&&r.canopyTrees===4&&r.leafStrips===12&&r.pvPanels===228&&r.tanks===4,JSON.stringify(r)]);
 for(const k of Object.keys(P.views))t('Camera preset: '+k,()=>{x.go(k,0);return near(x.cam.position,V(...P.views[k].p))&&near(x.ctl.target,V(...P.views[k].t));});
 for(const n of names)t('Layer toggle: '+n,()=>{x.setLayer(n,false);const a=x.L[n].visible===false;x.setLayer(n,true);return a&&x.L[n].visible===true;});
 t('Section long (Y = 9)',()=>{x.sec('sectionLong',0);return x.plane.constant===-P.cut.long&&x.plane.normal.z===-1;});
 t('Section cross (X = 24)',()=>{x.sec('sectionCross',0);return x.plane.constant===P.cut.cross&&x.plane.normal.x===-1;});
 t('Section off',()=>{x.sec('off',0);return x.plane.constant===1e6;});
 t('Exploded: layer offsets applied, geometry untouched',()=>{x.explode(true,0);const E=P.explode,f0=find(/^Frame_/),ok=x.c.group.position.y===E.canopy&&x.so.group.position.y===E.solar&&x.hab.group.position.y===E.hab&&x.sb.position.y===E.seabed&&x.ex.missing===0;
  const fr=x.hab.group.children.filter(o=>o.name.startsWith('Frame_')).length;return [ok&&fr===32&&f0.position.x===x.frame0.x,'missing groups: '+x.ex.missing];});
 t('Assemble returns every layer to 0',()=>{x.explode(false,0);return x.ex.groups.length>0&&[x.c.group,x.so.group,x.hab.group,x.sb,x.ra.group,x.sen.group].every(o=>o.position.y===0)&&x.hab.coral.position.y===0;});
 t('Inspection: all sample components resolve',()=>{const miss=[];for(const re of[/^Frame_.*TREATMENT/,/^Frame_.*CONTROL/,/^Coral_/,/^Node_H1/,/^Node_R/,/^Buoy/,/^Leaf/,/^PV panels/,/^Rainwater tank/,/^Deck slab/,/^Main pile/,/^Seabed \(/,/^Sea surface/,/^Fish/,/^Wireless/]){const o=find(re),e=o&&infoFor(o);if(!e||!e[4])miss.push(String(re));}return [miss.length===0,miss.join(' ')];});
 t('Risk states change the status light',()=>{const seen=new Set();for(const k of Object.keys(RISK)){x.setRisk(k);seen.add(x.M.led.color.getHex());if(x.M.led.color.getHex()!==parseInt(RISK[k][1].slice(1),16))return false;}x.setRisk('off');return seen.size===4;});
 t('Presentation: 9 steps (original 7 in order, 2 inserted after step 3) apply without error',()=>{const orig=['Overall project','Architecture','Green building systems','Underwater habitat','Coral treatment and control experiment','Sensor network','Data and risk-management workflow'],ti=STEPS.map(s=>s.title);
  const ord=ti.length===9&&ti[3]==='Hybrid Renewable Energy System'&&ti[4]==='Rainwater Treatment and Water Reuse'&&JSON.stringify([...ti.slice(0,3),...ti.slice(5)])===JSON.stringify(orig);if(!ord)return [false,ti.join(' | ')];
  for(let i=0;i<9;i++){x.pres.apply(i,true);if(!near(x.cam.position,V(...P.views[STEPS[i].view].p)))return [false,'step '+(i+1)];}return true;});
 t('Presentation exit restores all layers',()=>{x.pres.stop();return names.every(n=>x.L[n].visible)&&!x.ex.on&&!document.body.classList.contains('pres');});
 t('Labels: 12 original anchors',()=>x.labels.count===12);
 t('Stage 5 counts: 228 PV, 4 tanks, 3 VAWT, 1 anemometer, 13 stages (2 conditional)',()=>[r.pvPanels===228&&r.tanks===4&&r.vawt===3&&r.anemometers===1&&r.waterStages===13&&r.conditionalStages===2&&r.ems===1&&r.distributionBoards===1&&r.batteryCabinets>=1,JSON.stringify(r)]);
 t('Stage 5: 13 stage meshes/badges resolve to inspection entries',()=>{const miss=[];for(const s of STAGES){const o=find(new RegExp('^WT_S'+s.n+'_')),e=o&&infoFor(o);if(!e||!/^Stage /.test(e[1]))miss.push(s.n);}return [miss.length===0,miss.join()];});
 t('Stage 5: new components resolve to inspection entries',()=>{const miss=[];for(const re of[/^Hyb_vawt_1/,/^Hyb_anemometer/,/^Hyb_ems/,/^Hyb_battery/,/^Hyb_db/,/^Hyb_cable/,/^WT_pipe_raw/,/^WT_pipe_process/,/^WT_pipe_treated/,/^WT_pipe_np/,/^WT_terminal_irrigation/,/^WT_terminal_potable/,/^WT_sign_nonpotable/,/^Annex_floor_slab/,/^Annex_roof_slab/,/^Annex_sleeve/]){const o=find(re),e=o&&infoFor(o);if(!e||!e[4])miss.push(String(re));}return [miss.length===0,miss.join(' ')];});
 t('Stage 5: new layers toggle',()=>['Services annex','Hybrid energy','Water treatment'].every(n=>names.includes(n)));
 t('Stage 5: Hybrid and Water views set layers, labels and HUD',()=>{let ok=true;for(const k of['hybrid','water']){x.focusView(k);ok=ok&&FOCUS_LAYERS[k].every(n=>x.L[n].visible)&&x.labels.isOn()&&x.labels.mode()===k&&x.hud.mode()===k;}
  const h=document.getElementById('hud').textContent;x.focusView('hybrid');const he=document.getElementById('hud').textContent.includes(ENERGY_NOTE);x.focusView('water');const wa=document.getElementById('hud').textContent.includes(POTABLE_NOTE)&&document.getElementById('hud').textContent.includes(NP_SIGN);x.setFocus(null);return [ok&&he&&wa,'notes shown'];});
 t('Stage 5: original 12 label anchors kept; new anchors added separately',()=>[x.labels.count===12&&x.labels.countExtra===LABELS5.length&&LABELS5.length>=30,x.labels.count+'+'+x.labels.countExtra]);
 t('Stage 5: exploded view moves new groups and returns to 0',()=>{x.explode(true,0);const E=P.explode,ok=x.an.shell.position.y===E.annexShell&&x.hy.roof.position.y===E.hybRoof&&x.wt.room.position.y===E.wtRoom&&x.wt.inline.position.y===E.rain&&x.ex.missing===0;x.explode(false,0);
  return [ok&&[x.an.shell,x.an.deck,x.hy.roof,x.hy.room,x.wt.room,x.wt.inline,x.wt.under,x.wt.out].every(o=>o.position.y===0),'missing '+x.ex.missing];});
 t('Stage 5: four distinct pipe colours',()=>new Set(PIPE_MEDIA.map(m=>m.hex)).size===4);
 x.reset();x.go('overall',0);
 const bad=R.filter(q=>!q[1]).length;console.table(R.map(q=>({test:q[0],result:q[1]?'PASS':'FAIL',detail:q[2]})));
 const d=document.createElement('div');d.className='p';d.style.cssText='left:50%;top:50%;transform:translate(-50%,-50%);max-width:min(560px,92vw);max-height:80vh;overflow:auto;z-index:9';
 d.innerHTML=`<b>Self-test: ${R.length-bad}/${R.length} passed</b><br>${R.map(q=>`<div style="color:${q[1]?'#6fd3c9':'#ff8a8a'}">${q[1]?'PASS':'FAIL'} ${q[0]}${q[2]&&!q[1]?' ('+q[2]+')':''}</div>`).join('')}<small>These calls test the same functions the buttons use. They do not check how it looks.</small><br><button id="stx">close</button>`;
 document.body.append(d);d.querySelector('#stx').onclick=()=>d.remove();return R;}
