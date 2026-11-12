// Cositas · Caja y Stock — funciona sin internet. Desarrollado por JMM Gestiones & Tecnología.
// La app abre siempre desde el celular (rápido y sin internet). Cuando subís una versión nueva,
// este archivo cambia, el celular la descarga en segundo plano y la app muestra "Actualizar nueva versión".
const V='cositas-v14';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE.map(u=>new Request(u,{cache:'reload'})))))});
self.addEventListener('message',e=>{if(e.data==='actualizar')self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  if(r.mode==='navigate'){
    e.respondWith(caches.open(V).then(c=>c.match('./index.html')).then(m=>m||fetch(r)).catch(()=>caches.match('./index.html')));return;
  }
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const c=res.clone();caches.open(V).then(x=>x.put(r,c))}return res})));
});
