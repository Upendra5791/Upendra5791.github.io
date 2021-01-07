const cacheName = 'v2';
const cacheAssets = [
    'index.html',
    'css/styles.css',
    'css/plugins.css',
    'js/app.js',
    'images/android-chrome-192x192.png',
    'images/android-chrome-512x512.png'
];

self.addEventListener('install', (e) => {
    console.log(e);
    e.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                cache.addAll(cacheAssets);
            })
            .then(() => self.skipWaiting())
    );
})

self.addEventListener('activate', (e) => {
    console.log(e);
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        return caches.delete(cache);
                    }
                })
            )
        })
    )
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    );
});