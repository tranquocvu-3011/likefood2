const CACHE_NAME = 'likefood-cache-v2';
const urlsToCache = ['/', '/manifest.json', '/icon.png'];

self.addEventListener('install', event => {
    self.skipWaiting?.();
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        const results = await Promise.allSettled(urlsToCache.map((u) => cache.add(u)));
        // Náº¿u cÃ³ file khÃ´ng cache Ä‘Æ°á»£c (dev/404), váº«n cho SW install Ä‘á»ƒ trÃ¡nh "stuck"
        void results;
    })());
});

self.addEventListener('activate', event => {
    event.waitUntil((async () => {
        self.clients.claim?.();
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : Promise.resolve(true))));
    })());
});

self.addEventListener('fetch', event => {
    // Chá»‰ handle GET cÃ¹ng-origin; bá» qua Next.js internals Ä‘á»ƒ trÃ¡nh phÃ¡ dev/HMR & image optimizer
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin) return;

    if (
        url.pathname.startsWith('/_next/') ||
        url.pathname.startsWith('/api/') ||
        url.pathname.startsWith('/uploads/') ||
        url.pathname === '/sw.js'
    ) {
        return;
    }

    event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(event.request);
        if (cached) return cached;

        try {
            const resp = await fetch(event.request);
            if (resp && resp.ok) {
                const ct = resp.headers.get('content-type') || '';
                const cacheable =
                    ct.includes('text/') ||
                    ct.includes('application/javascript') ||
                    ct.includes('application/json') ||
                    ct.includes('image/');
                if (cacheable) {
                    await cache.put(event.request, resp.clone());
                }
            }
            return resp;
        } catch (_e) {
            // KhÃ´ng Ä‘á»ƒ promise reject (Ä‘á»¡ spam "FetchEvent ... promise was rejected")
            if (event.request.mode === 'navigate') {
                const fallback = await cache.match('/');
                if (fallback) return fallback;
            }
            return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
        }
    })());
});

