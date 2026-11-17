import * as T from 'three';
const S=(c,r=.6,m=0,o={})=>new T.MeshStandardMaterial({color:c,roughness:r,metalness:m,...o});
function pvTex(){const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');g.fillStyle='#10233a';g.fillRect(0,0,128,128);g.strokeStyle='#5d7fa3';
 for(let i=0;i<=128;i+=16){g.beginPath();g.moveTo(i,0);g.lineTo(i,128);g.moveTo(0,i);g.lineTo(128,i);g.stroke();}const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t;}
export const M={concrete:S(0xd9d9d6,.85),white:S(0xf2f2ee,.7),timber:S(0xb98a5a,.75),steel:S(0x8d949a,.35,.85),pile:S(0x6f777c,.5,.7),
 glass:S(0x9fd0e0,.05,.1,{transparent:true,opacity:.28,depthWrite:false}),leaf:S(0xe9ecec,.5,.3),branch:S(0xe6e3dc,.55,.2),stack:S(0xd5dde0,.5,.3,{side:T.DoubleSide}),
 pv:S(0xffffff,.25,.4,{map:pvTex()}),frit:S(0xbfd9d3,.2,.1,{transparent:true,opacity:.55}),grating:S(0x4d5a60,.6,.4,{transparent:true,opacity:.85}),
 pipe:S(0x3b7fbf,.4,.3),tank:S(0xe8f1f4,.35,.2),gutter:S(0xb3bcc2,.3,.8),furn:S(0xcbbca4,.7),bench:S(0x6c7f86,.6,.2),land:S(0x9a9484,.9)};
const S2=(c,r=.6,m=0,o={})=>new T.MeshStandardMaterial({color:c,roughness:r,metalness:m,...o});
Object.assign(M,{frameT:S2(0x2f9f98,.45,.2),frameC:S2(0xe9822a,.45,.2),tile:S2(0xcfc9bb,.9),coralA:S2(0xc9b79a,.8),coralB:S2(0xa88f6c,.8),coralC:S2(0xc4a39b,.8),
 seabed:new T.MeshStandardMaterial({vertexColors:true,roughness:1}),rock:S2(0x6e7378,.95),urchin:S2(0x1d1722,.8),nodeBody:S2(0x1d2a32,.5,.5),probe:S2(0xbfc7cc,.4,.8),
 nodeH:S2(0x19c2d6,.4,0,{emissive:0x0a5a66}),nodeR:S2(0xe0457b,.4,0,{emissive:0x5a1030}),cable:S2(0xf0a830,.5),buoy:S2(0xf4d03f,.5),led:S2(0x39e07a,.4,0,{emissive:0x39e07a}),
 packet:S2(0xffc857,.3,0,{emissive:0xffa000}),fish:S2(0xffffff,.4,.2),marker:S2(0xe9822a,.5,0,{emissive:0x7a3a08})});
