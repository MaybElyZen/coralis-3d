import * as T from 'three';
import {PIPE_MEDIA} from './stage5.js';
const S=(c,r=.5,m=0,o={})=>new T.MeshStandardMaterial({color:c,roughness:r,metalness:m,...o});
const glow=(c,i=.5)=>S(c,.3,0,{emissive:c,emissiveIntensity:i});
export const M5={
 slab:S(0xd9d9d6,.85),
 annexWall:S(0xdfe9ee,.4,.1,{transparent:true,opacity:.3,depthWrite:false,side:T.DoubleSide}),
 annexRoof:S(0xeef3f5,.5,.1,{transparent:true,opacity:.35,depthWrite:false,side:T.DoubleSide}),
 sleeve:S(0x8d949a,.35,.85,{side:T.DoubleSide}),
 power:S(0xd8473f,.5),bus:S(0xc98a4b,.35,.8),ems:S(0x24405e,.5,.3),battery:S(0x4f6b5a,.6,.2),db:S(0x8a949a,.5,.4),tray:S(0x6f777c,.5,.6),
 blade:S(0xdfe6ea,.4,.3),mast:S(0xbfc7cc,.4,.8),cup:S(0xffb347,.5),flow:glow(0xffe066,.9),
 tank:S(0xdfe9ec,.4,.2),tankClear:S(0xcfe6ee,.2,.1,{transparent:true,opacity:.4,depthWrite:false}),
 cond:S(0xffc857,.3,0,{transparent:true,opacity:.45,depthWrite:false}),condEdge:new T.LineBasicMaterial({color:0xffc857}),
 carbon:S(0x2a2a2a,.7),uv:glow(0x8f6bff,.8),membrane:S(0xe8f1f4,.3,.3),sand:S(0xd8c08a,.9),box:S(0x3d4a52,.5,.4),
 termNP:S(0x9a5fd0,.5),termPot:S(0x2fbf71,.5),bracket:S(0x6f777c,.5,.6),
 pipe:Object.fromEntries(PIPE_MEDIA.map(m=>[m.k,S(m.hex,.4,.3)])),
 arrow:Object.fromEntries(PIPE_MEDIA.map(m=>[m.k,glow(m.hex,.55)]))};
