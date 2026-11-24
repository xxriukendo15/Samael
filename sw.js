self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(clients.claim()));
self.addEventListener('push',e=>{
  let d={};try{d=e.data.json()}catch{}
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(cl=>{
    if(cl.some(c=>c.visibilityState==='visible'))return; // la app abierta ya suena sola
    return self.registration.showNotification(d.title||'RKDA',{body:d.body||'',tag:d.chat||'rkda',renotify:true,
      vibrate:[200,100,200],icon:'icon.svg',badge:'icon.svg',data:{chat:d.chat}});
  }));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();const chat=e.notification.data&&e.notification.data.chat;
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(cl=>{
    for(const c of cl){if('focus' in c){c.postMessage({chat});return c.focus()}}
    return clients.openWindow('./?chat='+(chat||''));
  }));
});
