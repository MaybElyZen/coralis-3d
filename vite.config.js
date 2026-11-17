import {defineConfig} from 'vite';
import {readdirSync,statSync,readFileSync,writeFileSync} from 'node:fs';
import {join,relative} from 'node:path';
import {createHash} from 'node:crypto';

// Stage 5: after the build, emit dist/sw.js — a service worker that precaches
// every file in dist under a content-hash cache name, so the app works fully
// offline and a new build replaces the old cache cleanly.
const swPlugin=()=>({name:'coralis-sw',closeBundle(){
 const out='dist',files=[];
 const walk=d=>{for(const n of readdirSync(d)){const p=join(d,n);if(statSync(p).isDirectory())walk(p);else if(n!=='sw.js')files.push(relative(out,p).split('\\').join('/'));}};
 walk(out);files.sort();
 const h=createHash('sha256');for(const f of files)h.update(f).update(readFileSync(join(out,f)));
 const version=h.digest('hex').slice(0,10),cache='coralis-'+version;
 const urls=['./','index.html',...files.filter(f=>f!=='index.html')];
 const sw=`// CORALIS service worker — generated at build time. Cache version ${version}.
const CACHE='${cache}';
const PRECACHE=${JSON.stringify(urls)};
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(PRECACHE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);
 if(e.request.method!=='GET'||u.origin!==location.origin)return;
 if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put('index.html',cp));return r;}).catch(()=>caches.match('index.html').then(m=>m||caches.match('offline.html'))));return;}
 e.respondWith(caches.match(e.request).then(m=>m||fetch(e.request).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return r;})));
});
`;
 writeFileSync(join(out,'sw.js'),sw);
 console.log('sw.js written: cache',cache,'precaches',urls.length,'files');
}});
export default defineConfig({base:'./',build:{outDir:'dist',chunkSizeWarningLimit:900},plugins:[swPlugin()]});
