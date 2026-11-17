import * as T from 'three';
import {P,strips,leafZ,leafX,tilt} from './params.js';
import {M} from './materials.js';
export function buildSolar(){
 const g=new T.Group();g.name='SOLAR';const p=P.pv;const st=strips(),nPV=st.length*p.perStrip,nG=st.length*p.glassPerStrip;
 const geo=new T.BoxGeometry(p.w,.05,p.l),pv=new T.InstancedMesh(geo,M.pv,nPV),gl=new T.InstancedMesh(geo,M.frit,nG);pv.name='PV panels (1.0 x 2.0 m, unconfirmed size)';gl.name='Translucent non-PV panels';
 const m=new T.Matrix4(),q=new T.Quaternion().setFromEuler(new T.Euler(tilt(),0,0)),one=new T.Vector3(1,1,1);let i=0,j=0;
 for(const s of st){for(let k=0;k<p.perStrip+p.glassPerStrip;k++){const y=p.y0+.5+k,pos=new T.Vector3(leafX(s,y),leafZ(s,y)+.03,-y);m.compose(pos,q,one);
  if(k<p.perStrip)pv.setMatrixAt(i++,m);else gl.setMatrixAt(j++,m);}}
 pv.castShadow=gl.castShadow=true;g.add(pv,gl);return{group:g,count:{pv:i,glass:j}};}
