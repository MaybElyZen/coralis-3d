const ALL=['Building','Canopy','Solar','Rainwater','Habitat','Coral','Sensors','Marine life','Sea surface'];
export const STEPS=[
{title:'Overall project',view:'overall',layers:ALL,caption:'CORALIS Reef Canopy is a conceptual marine research and education pavilion above a proposed coral restoration experiment. All dimensions are design assumptions.'},
{title:'Architecture',view:'building',layers:['Building','Canopy','Sea surface'],caption:'A 48 × 18 m deck at +6.0 m carries a welcome and exhibition zone, a covered terrace and a research zone with a second level. Enclosed floor 864 m² plus 288 m² covered terrace.'},
{title:'Green building systems',view:'green',layers:['Building','Canopy','Solar','Rainwater','Sea surface'],labels:true,caption:'Four branching trees carry 12 leaf strips for shade, solar panels and rain catchment into 4 tanks. Solar output and rainwater yield are not calculated.'},
{title:'Underwater habitat',view:'underwater',layers:['Building','Habitat','Marine life','Sea surface'],caption:'32 modular frames hang in two depth tiers below the deck, apart from the building. Not surveyed; any real installation needs assessment and permission.'},
{title:'Coral treatment and control experiment',view:'restoration',layers:['Habitat','Coral','Marine life','Sea surface'],caption:'28 treatment frames would carry small coral fragments. 4 unseeded control frames (orange) allow comparison. No survival or recovery is claimed.'},
{title:'Sensor network',view:'sensors',layers:['Building','Habitat','Sensors','Sea surface'],labels:true,caption:'3 habitat nodes and 1 reference node outside the canopy shadow would measure temperature, light, salinity, water quality and local conditions. No readings are simulated.'},
{title:'Data and risk-management workflow',view:'workflow',layers:['Building','Habitat','Sensors','Sea surface'],risk:'normal',caption:'Sensors, Data, Research building, Risk assessment, Management action, Monitoring. The status shown is an illustrative scenario, not live monitoring.'}];
export function makePresentation(h){
 let i=0,on=false,timer=null,playing=false;
 const apply=(n,instant)=>{i=(n+STEPS.length)%STEPS.length;const s=STEPS[i];h.setLayers(s.layers);h.explode(false,instant?0:1.2);h.labels(!!s.labels);h.sectionOff();h.risk(s.risk||'off');h.go(s.view,instant?0:2.2);h.caption(i,STEPS.length,s.title,s.caption,playing);};
 const arm=()=>{clearTimeout(timer);if(playing)timer=setTimeout(()=>{apply(i+1);arm();},11000);};
 return{STEPS,isOn:()=>on,index:()=>i,apply,
  start(){on=true;playing=false;document.body.classList.add('pres');apply(0);try{document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen();}catch(e){}},
  next(){apply(i+1);arm();},prev(){apply(i-1);arm();},play(){playing=!playing;h.caption(i,STEPS.length,STEPS[i].title,STEPS[i].caption,playing);arm();},
  stop(){on=false;playing=false;clearTimeout(timer);document.body.classList.remove('pres');h.setLayers(ALL);h.explode(false,0);h.labels(false);h.risk('off');h.go('overall',1.2);h.caption(-1);try{document.fullscreenElement&&document.exitFullscreen();}catch(e){}}};}
