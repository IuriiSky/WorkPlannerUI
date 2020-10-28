var swVersionIdentification = 'v2';


self.addEventListener('install', function (event) {
      // console.log("Installing service worker " + swVersionIdentification);
  event.waitUntil(
    caches.open(swVersionIdentification).then(function (cache) {
      return cache.addAll([
        '/assets/images/192x192.png',
        '/assets/images/logo.png',
      ]);
    })
  );

});

self.addEventListener('fetch', function (event) {
});

// self.addEventListener('fetch', function (event) {
//     // Let the browser do its default thing
//     // for non-GET requests.
//     if (event.request.method != 'GET') return;
  
//     // Prevent the default, and handle the request ourselves.
//     event.respondWith(async function () {
//       // Try to get the response from a cache.
//       const cache = await caches.open(swVersionIdentification);
//       const cachedResponse = await cache.match(event.request);
  
//       if (cachedResponse) {
//         // If we found a match in the cache, return it, but also
//         // update the entry in the cache in the background.
//         event.waitUntil(cache.add(event.request));
//         console.log("USING CACHE ON " + event.request.url + " (recaching in bg)");
//         return cachedResponse;
//       }
  
//       // If we didn't find a match in the cache, use the network. (and make dyn cache from api calls?)
//       //cache all api requests
//       if (event.request.url.indexOf("https://plapi.davidssoft.com") !== -1) {
//         return fetch(event.request).then(function (response) {
//           let responseClone = response.clone();
//           caches.open(swVersionIdentification).then(function (cache) {
//             console.log("CACHING API CALL " + event.request.url);
//             cache.put(event.request, responseClone);
//           });
  
//           return response;
//         }).catch(function () {
//           //in case of not found (for now just match something so same response type everywhere)
//           return caches.match('/main.js');
//         });
//       }
  
  
  
//       console.log("USING NETWORK ON " + event.request.url);    
//       return fetch(event.request);
//     }());
//   });


// https://player.davidssoft.com/service-worker.js
// https://player.davidssoft.com/manifest.json
//https://web.dev/customize-install/