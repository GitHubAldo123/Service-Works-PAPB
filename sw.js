// Nama cache beserta versinya 
const CACHE_NAME = 'pwa-modul-v2'; 
 
// Daftar file yang akan disimpan ke dalam cache (App Shell) 
const urlsToCache = [ 
    '/', 
    '/index.html', 
    '/css/style.css', 
    '/manifest.json', 
    '/images/icon-192x192.png', 
]; 
 
// Event Install: Menyimpan aset ke Cache 
self.addEventListener('install', (event) => { 
    event.waitUntil( 
        caches.open(CACHE_NAME) 
            .then((cache) => { 
                console.log('Cache berhasil dibuka'); 
                return cache.addAll(urlsToCache); 
            }) 
    ); 
}); 

self.addEventListener('activate', (event) => { 
    event.waitUntil( 
        caches.keys().then((cacheNames) => { 
            return Promise.all(
                 cacheNames.map((cacheName) => { 
                    // Jika nama cache tidak sama dengan cache versi terbaru, hapus! 
                    if (cacheName !== CACHE_NAME) { 
                        console.log('Service Worker: Menghapus cache lama', cacheName); 
                        return caches.delete(cacheName); 
                    } 
                }) 
            ); 
        }) 
    ); 
});

// Event Fetch: Mengambil data dari Cache jika tersedia, jika tidak ambil dari jaringan (Cache-First strategy) 
self.addEventListener('fetch', (event) => { 
    event.respondWith( 
        caches.match(event.request) 
            .then((response) => { 
                // Cache hit - mengembalikan respon dari cache 
                if (response) { 
                    return response; 
                } 
                // Jika tidak ada di cache, lanjutkan mengambil dari jaringan (network) 
                return fetch(event.request); 
            }) 
    ); 
});