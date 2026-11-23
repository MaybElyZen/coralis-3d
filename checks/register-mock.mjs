import {register} from 'node:module';
register('data:text/javascript,'+encodeURIComponent(`export async function resolve(s,c,n){if(s==='three')return{url:'${new URL('./three-mock.mjs',import.meta.url).href}',shortCircuit:true};return n(s,c);}`));
const ctx={fillRect(){},beginPath(){},arc(){},fill(){},stroke(){},strokeRect(){},fillText(){},moveTo(){},lineTo(){},setLineDash(){},measureText:()=>({width:100})};
globalThis.document={createElement:()=>({getContext:()=>ctx,width:0,height:0}),};
