const cacheName = 'v2';
const cacheAssets = [
    'index.html',
    'assets/css/style.css',
    'assets/css/bootstrap.min.css',
    'assets/css/plugins.css',
    'assets/css/roboto-railway-webfont.css',
    'assets/css/linearicons-web-font.css',
    'assets/css/magnific-popup.css',
    'assets/css/responsive.css',
    'assets/js/vendor/jquery-1.11.2.min.js',
    'assets/js/vendor/bootstrap.min.js',
    'assets/js/plugins.js',
    'assets/js/jquery.magnific-popup.js',
    'assets/js/main.js',
    'assets/js/vendor/modernizr-2.8.3-respond-1.4.2.min.js',
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