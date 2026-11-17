import * as T from 'three';
import {Sky} from 'three/addons/objects/Sky.js';
export function makeScene(canvas){
 const r=new T.WebGLRenderer({canvas,antialias:true});r.setPixelRatio(Math.min(devicePixelRatio,2));r.shadowMap.enabled=true;r.shadowMap.type=T.PCFSoftShadowMap;r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=.55;
 const s=new T.Scene(),cam=new T.PerspectiveCamera(42,1,.5,1500);
 const sky=new Sky();sky.scale.setScalar(900);s.add(sky);const sun=new T.Vector3().setFromSphericalCoords(1,T.MathUtils.degToRad(62),T.MathUtils.degToRad(150));
 Object.assign(sky.material.uniforms,{turbidity:{value:3},rayleigh:{value:1.4},mieCoefficient:{value:.004},mieDirectionalG:{value:.8}});sky.material.uniforms.sunPosition.value.copy(sun);
 const hemi=new T.HemisphereLight(0xbfd9ee,0x3a5560,.9);s.add(hemi);const d=new T.DirectionalLight(0xfff1dc,2.4);d.position.set(24+sun.x*120,sun.y*120,-9+sun.z*120);d.target.position.set(24,5,-9);d.castShadow=true;
 Object.assign(d.shadow.camera,{left:-70,right:70,top:50,bottom:-50,near:10,far:320});d.shadow.mapSize.set(2048,2048);d.shadow.bias=-.0004;s.add(d,d.target);
 const sea=new T.Mesh(new T.PlaneGeometry(900,900),new T.MeshStandardMaterial({color:0x2a7f94,transparent:true,opacity:.5,roughness:.15,metalness:.1,depthWrite:false,side:T.DoubleSide}));sea.rotation.x=-Math.PI/2;sea.name='Sea surface';s.add(sea);
 r.localClippingEnabled=true;return{r,s,cam,sea,sky,hemi};}
