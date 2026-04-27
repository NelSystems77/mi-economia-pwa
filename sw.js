const CACHE_NAME = 'mi-economia-v3.5.4';
const urlsToCache = [
  './',
  './index.html',
  './css/styles.css',
  './css/supermarket-v2.css',
  './js/app.js',
  './js/db.js',
  './js/modules/dashboard.js',
  './js/modules/income.js',
  './js/modules/expenses.js',
  './js/modules/obligations.js',
  './js/modules/supermarket.js',
  './js/modules/supermarket-v2.js',
  './js/modules/calculators.js',
  './assets/logo.png',
  './manifest.json'
];

// Instalación - Cachear archivos críticos
self.addEventListener('install', event => {
  console.log('✅ Service Worker: Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Service Worker: Cacheando archivos...');
        // Cachear archivos uno por uno para evitar fallos totales
        return Promise.allSettled(
          urlsToCache.map(url => 
            cache.add(url).catch(err => {
              console.warn(`⚠️ No se pudo cachear: ${url}`, err);
            })
          )
        );
      })
      .catch(err => {
        console.error('❌ Error al abrir cache:', err);
      })
  );
  
  // Activar inmediatamente
  self.skipWaiting();
});

// Activación - Limpiar caches antiguas
self.addEventListener('activate', event => {
  console.log('✅ Service Worker: Activado');
  
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('🗑️ Service Worker: Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Tomar control de todas las páginas inmediatamente
  return self.clients.claim();
});

// Fetch - Estrategia Cache-First con Network Fallback
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorar requests que no sean del mismo origen
  if (url.origin !== location.origin) {
    // Para recursos externos (CDN), intentar red primero
    event.respondWith(
      fetch(request).catch(() => {
        // Si falla, buscar en cache
        return caches.match(request);
      })
    );
    return;
  }
  
  // Para recursos locales: Cache-First
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Si no está en cache, obtener de la red
        return fetch(request)
          .then(response => {
            // Verificar que la respuesta es válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clonar respuesta para cachear
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(request, responseToCache).catch(err => {
                  console.warn('⚠️ No se pudo cachear:', request.url);
                });
              });
            
            return response;
          })
          .catch(err => {
            console.error('❌ Error de red:', err);
            
            // Si es HTML, retornar página offline
            if (request.headers.get('accept').includes('text/html')) {
              return new Response(`
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Sin conexión - Mi Economía</title>
                  <style>
                    body { 
                      font-family: system-ui; 
                      display: flex; 
                      align-items: center; 
                      justify-content: center; 
                      min-height: 100vh; 
                      margin: 0;
                      background: #f5f5f5;
                      text-align: center;
                      padding: 20px;
                    }
                    .offline-container {
                      background: white;
                      padding: 2rem;
                      border-radius: 8px;
                      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                    h1 { color: #333; margin: 0 0 1rem; }
                    p { color: #666; margin: 0.5rem 0; }
                    button {
                      margin-top: 1rem;
                      padding: 0.75rem 1.5rem;
                      background: #00D976;
                      color: white;
                      border: none;
                      border-radius: 4px;
                      cursor: pointer;
                      font-size: 1rem;
                    }
                    button:hover { background: #00bf68; }
                  </style>
                </head>
                <body>
                  <div class="offline-container">
                    <h1>🔌 Sin conexión</h1>
                    <p>No se pudo cargar esta página.</p>
                    <p>Verifica tu conexión a internet.</p>
                    <button onclick="location.reload()">Reintentar</button>
                  </div>
                </body>
                </html>
              `, {
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'text/html' }
              });
            }
            
            // Para otros recursos, retornar error
            return new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Manejo de errores global
self.addEventListener('error', event => {
  console.error('❌ Service Worker Error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
  console.error('❌ Service Worker Unhandled Rejection:', event.reason);
});

console.log('🚀 Service Worker cargado:', CACHE_NAME);
