// Single source of truth. Metres. Drawing axes: X seaward, Y north, Z up (mean sea level = 0).
// All values are provisional design parameters, NOT site measurements or engineering data.
export const P={
 deck:{x1:48,y1:18,z:6.0},
 zone:{A:[0,16],B:[16,32],C:[32,48]},
 L1:[['Entry lobby',0,0,16,6,'A'],['Exhibition hall',0,6,16,18,'A'],['Circulation',16,0,32,6,'B'],['Observation grating',16,6,32,12,'B'],['Learning terrace',16,12,32,18,'B'],
  ['Wet lab',32,0,40,9,'C'],['Dry lab',32,9,40,18,'C'],['Diver prep',40,0,48,6,'C'],['Core + stack',40,6,48,12,'C'],['Plant + tanks',40,12,48,18,'C']],
 L2:[['Control room',32,0,40,9],['Study / office',32,9,40,18],['Seminar',40,0,48,6],['Core + stack',40,6,48,12],['Meeting',40,12,48,18]],
 lv:{l1ceil:9.6,l2floor:10.0,l2top:13.7,roofC:14.0,roofA:10.0},
 piles:{xs:[6,18,30,42],ys:[1.5,9,16.5],d:1.0,seabed:-5.0,bw:{xs:[-27,-18,-9],ys:[8,10],d:0.5}},
 canopy:{xs:[6,18,30,42],y:9,peak:{6:13.5,18:17,30:19,42:17.5},wingDrop:{6:1.5,18:1.5,30:1.5,42:1.0},dx:[-4.5,0,4.5],
  leaf:{w:2.4,y0:-4,y1:22,t:0.5,slopeDeg:1,swayAmp:0.25},soffitMin:{A:11,B:9,C:15.5,overhang:9},trunk:{r0:0.5,r1:0.34,stackR0:0.7,stackR1:0.55,stackX:42}},
 pv:{w:2.0,l:1.0,y0:-4,perStrip:19,glassPerStrip:6,note:'1.0 x 2.0 m panel size is an UNCONFIRMED visual assumption'},
 tanks:{r:0.95,h:3.53,pos:[[41.5,13.5],[44.5,13.5],[41.5,16.5],[44.5,16.5]]},
 pipes:{mainY:10.2,mainZ:4.6}
};
const C=P.canopy,L=C.leaf,tanS=Math.tan(L.slopeDeg*Math.PI/180);
export const strips=()=>C.xs.flatMap(xc=>C.dx.map(dx=>({xc,dx,top:C.peak[xc]-(dx===0?0:C.wingDrop[xc])})));
export const leafZ=(s,y)=>s.top-tanS*(L.y1-y);
export const leafX=(s,y)=>s.xc+s.dx+L.swayAmp*Math.sin(0.35*y+0.7*s.xc+s.dx);
export const tilt=()=>L.slopeDeg*Math.PI/180;
// ---------- Stage 3: underwater ecosystem (conceptual proposals, not approved works) ----------
export const sbz=x=>x<0?-1-4*(x+36)/36:-5;
export const seabedH=(X,Y)=>(X<-36?-1+(-36-X)*0.7:sbz(X))+0.1*(0.5+0.5*Math.sin(X*.9+Y*.4)*Math.sin(Y*.7-X*.3));
P.hab={frame:{w:1.2,h:0.8,tile:0.36},cols:[17,19,21,23,25,27,29,31],rows:{T2:[4,6],T1:[12,14]},tierZ:{T1:-2.0,T2:-3.5},
 controls:[[17,4],[31,6],[17,14],[31,12]],field:{x0:16,x1:32,y0:3,y1:15},coralPerFrame:3};
P.nodes={habitat:[{id:'H1',x:24,y:13,z:-2.0},{id:'H2',x:24,y:5,z:-3.5},{id:'H3',x:24,y:9,z:-3.0}],ref:{id:'R',x:88,y:9,z:-3.0},
 buoy:{x:88,y:9,z:0.1,antennaZ:2.6},junction:{x:29.35,y:9,z:-1.0},conduit:{x:39.8,y:8.6,zTop:10.6},gateway:{x:39.3,y:8.2,z:10.0},mast:{x:39,y:7,z0:14.0,z1:15.2}};
P.seabed={x0:-46,x1:160,y0:-80,y1:90,seg:[100,70]};
P.life={orbits:[[24,-8,-2.0,4],[24,26,-3.0,5],[8,9,-2.5,5],[42,9,-3.2,4],[60,0,-2.0,6],[60,18,-3.0,5],[-10,9,-2.5,3]],fishPerOrbit:4,urchins:[[6.7,9.3],[18.8,8.5],[29,10.2],[41,8.2],[12,2],[36,14],[27,-3]],rocks:14};
P.cut={long:9,cross:24};
P.views={overall:{p:[78,-52,34],t:[22,9,9]},building:{p:[60,-30,18],t:[26,9,10]},underwater:{p:[30,-14,-3],t:[24,9,-3]},
 restoration:{p:[26,-3,-2.2],t:[24,9,-2.8]},sensors:{p:[56,-45,16],t:[56,9,-2]},sectionLong:{p:[24,-62,10],t:[24,9,4]},sectionCross:{p:[78,4,6],t:[24,9,3]}};
export const frames=()=>{const H=P.hab,o=[];for(const tier of['T2','T1'])H.rows[tier].forEach((y,ri)=>H.cols.forEach((x,ci)=>{
 o.push({tier,x,y,z:H.tierZ[tier],control:H.controls.some(c=>c[0]===x&&c[1]===y),id:`${tier}_R${ri+1}_C${String(ci+1).padStart(2,'0')}`,v:(ci+ri)%3,ci});}));return o;};
// ---------- Stage 4: presentation data (view/explode only; no design geometry) ----------
Object.assign(P.views,{green:{p:[56,-24,26],t:[24,9,12]},exploded:{p:[125,-100,38],t:[44,9,6]},workflow:{p:[72,-38,22],t:[50,9,5]}});
P.explode={DECK:2,INTERIOR:6,LEVEL2:9,ENCLOSURE:12,PILES:0,rain:16,canopy:20,solar:23,surface:30,hab:-4,under:-8,seabed:-12};
