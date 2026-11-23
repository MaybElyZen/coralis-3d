// Minimal stand-in for three.js used ONLY by Node checks (the real build uses real three). Records geometry parameters.
export class Vector3{constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z;}set(x,y,z){this.x=x;this.y=y;this.z=z;return this;}copy(v){return this.set(v.x,v.y,v.z);}clone(){return new Vector3(this.x,this.y,this.z);}
 sub(v){this.x-=v.x;this.y-=v.y;this.z-=v.z;return this;}length(){return Math.hypot(this.x,this.y,this.z);}normalize(){const l=this.length()||1;this.x/=l;this.y/=l;this.z/=l;return this;}distanceTo(v){return Math.hypot(this.x-v.x,this.y-v.y,this.z-v.z);}lerpVectors(a,b,t){return this.set(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t,a.z+(b.z-a.z)*t);}setScalar(s){return this.set(s,s,s);}}
export class Quaternion{setFromUnitVectors(){return this;}setFromEuler(){return this;}}
export class Euler{constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z;}set(x,y,z){this.x=x;this.y=y;this.z=z;return this;}}
export class Object3D{constructor(){this.name='';this.children=[];this.parent=null;this.visible=true;this.position=new Vector3();this.rotation=new Euler();this.scale=new Vector3(1,1,1);this.quaternion=new Quaternion();}
 add(...o){for(const c of o){c.parent=this;this.children.push(c);}return this;}traverse(f){f(this);this.children.forEach(c=>c.traverse(f));}}
export class Group extends Object3D{}
export class Mesh extends Object3D{constructor(g,m){super();this.geometry=g;this.material=m;this.isMesh=true;}}
export class Sprite extends Object3D{constructor(m){super();this.material=m;this.isSprite=true;this.scale=new Vector3(1,1,1);}}
export class LineSegments extends Object3D{constructor(g,m){super();this.geometry=g;this.material=m;}}
const geo=n=>class{constructor(...a){this.type=n;this.p=a;}setAttribute(){}setIndex(){}computeVertexNormals(){}};
export const BoxGeometry=geo('Box'),CylinderGeometry=geo('Cylinder'),SphereGeometry=geo('Sphere'),ConeGeometry=geo('Cone'),PlaneGeometry=geo('Plane'),TorusGeometry=geo('Torus'),EdgesGeometry=geo('Edges'),BufferGeometry=geo('Buffer');
export class Float32BufferAttribute{constructor(){}}
export class CatmullRomCurve3{constructor(p){this.p=p;}getPoints(){return this.p;}computeFrenetFrames(){return{normals:[],binormals:[]};}}
const mat=class{constructor(o={}){Object.assign(this,o);this.color={clone(){return this;},copy(){},set(){}};this.emissive={set(){},copy(){}};}};
export const MeshStandardMaterial=mat,MeshBasicMaterial=mat,LineBasicMaterial=mat,SpriteMaterial=mat,LineDashedMaterial=mat;
export class CanvasTexture{constructor(){}}
export const SRGBColorSpace='srgb',DoubleSide=2;
