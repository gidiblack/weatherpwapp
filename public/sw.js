const staticCacheName = 'site-static';
// const dynamicCache = 'site-dynamic-v1';
const assets = [
    './',
    './index.html',
    './js/app.js',
    './css/style.css',
    './img/gidi-weather-logo.png',
    './img/dawn-img.jpg',
    './img/icons/icon-32x32.png',
    './img/icons/icon-144x144.png',
    "./img/icons/icon-16x16.png",
    "./img/icons/icon-96x96.png",
    "https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css",
    "https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"
];

// install service worker
self.addEventListener('install', evt => {
    // console.log('service worker has been installed');
    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log('caching shell assets');
            cache.addAll(assets);
        })
    );
});

// activate event
self.addEventListener('activate', evt => {
    // console.log('service worker has been activated');
    evt.waitUntil(
        caches.keys().then(keys => {
            // console.log(keys);
            return Promise.all(keys
                .filter(key => key !== staticCacheName)
                .map(key => caches.delete(key))
            )
        })
    );
});

//fetch event
self.addEventListener('fetch', evt => {
    // console.log('fetch event', evt);
    // check if server requests have been cached then allow 
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request);
            // .then(fetchRes => {
            //     return caches.open(dynamicCache).then(cache => {
            //         cache.put(evt.request.url, fetchRes.clone());
            //         return fetchRes;
            //     })
            // });
        })
    );
});