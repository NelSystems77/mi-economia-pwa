# 🔧 SOLUCIÓN DE PROBLEMAS - Mi Economía PWA

## ✅ Correcciones Aplicadas en v2.0

### 1. Chart.js no se cargaba
**Problema:** Los módulos intentaban usar Chart.js antes de que terminara de cargar.

**Solución:**
- Chart.js ahora se carga SINCRÓNICAMENTE antes que los módulos
- Se mantiene el `onerror` handler para degradación elegante
- La app funciona perfectamente sin gráficos si Chart.js falla

```html
<!-- ANTES (Malo - Asíncrono) -->
<script>
  const chartScript = document.createElement('script');
  chartScript.src = '...chart.js';
  document.head.appendChild(chartScript);
</script>
<script src="js/app.js"></script> <!-- Se ejecuta ANTES de Chart.js -->

<!-- AHORA (Bueno - Síncrono) -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/..." 
        onerror="window.Chart = null;"></script>
<script src="js/app.js"></script> <!-- Se ejecuta DESPUÉS de Chart.js -->
```

---

### 2. Service Worker - Errores de Cache
**Problema:** `addAll()` fallaba completamente si UN solo archivo no se cacheaba.

**Solución:**
- Usamos `Promise.allSettled()` en lugar de `Promise.all()`
- Cada archivo se cachea independientemente
- Si uno falla, los demás continúan

```javascript
// ANTES (Todo o nada)
cache.addAll(urlsToCache) // Si falla 1 archivo, falla todo

// AHORA (Individual)
Promise.allSettled(
  urlsToCache.map(url => 
    cache.add(url).catch(err => console.warn('No se pudo:', url))
  )
)
```

---

### 3. Material Icons - Failed to Convert Response
**Problema:** Google Fonts bloqueado por CORS/Tracking Prevention.

**Solución:**
- Service Worker ignora recursos externos (CDN)
- Para externos: Network-First (intenta red, luego cache)
- Para locales: Cache-First (intenta cache, luego red)

```javascript
// Service Worker mejorado
if (url.origin !== location.origin) {
  // Externo (Google Fonts, CDN) - Network First
  fetch(request).catch(() => caches.match(request));
} else {
  // Local - Cache First
  caches.match(request).then(...) || fetch(request);
}
```

---

## 🐛 Problemas Comunes y Soluciones

### Problema: "Chart.js no disponible"
```
Console: Chart.js no disponible
```

**Causas:**
1. CDN bloqueado por bloqueador de anuncios
2. Navegador con privacidad estricta (Safari, Brave)
3. Sin conexión a internet en primera carga

**Soluciones:**
- ✅ La app funciona SIN gráficos (degradación elegante)
- ✅ Los KPIs y datos se muestran normalmente
- ✅ Solo los gráficos no aparecen

**Opcional - Usar Chart.js local:**
```bash
# Descargar Chart.js localmente
cd mi-economia-pwa
mkdir -p js/libs
curl -o js/libs/chart.min.js https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js

# Cambiar en index.html:
<script src="js/libs/chart.min.js" onerror="window.Chart = null;"></script>
```

---

### Problema: Service Worker no se actualiza
```
Console: Service Worker antiguo sigue activo
```

**Solución 1 - Forzar actualización (Desarrollo):**
```
1. F12 (DevTools)
2. Application → Service Workers
3. ✅ "Update on reload"
4. Ctrl+Shift+R (Hard Reload)
```

**Solución 2 - Limpiar todo:**
```javascript
// En consola del navegador:
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.unregister());
});
caches.keys().then(keys => keys.forEach(key => caches.delete(key)));
location.reload();
```

**Solución 3 - Incrementar versión:**
```javascript
// En sw.js:
const CACHE_NAME = 'mi-economia-v2.0.1'; // Incrementar
```

---

### Problema: IndexedDB no se crea
```
Console: Error opening database
```

**Causas:**
- Modo incógnito (algunas restricciones)
- Cuota excedida
- Navegador antiguo sin IndexedDB

**Soluciones:**
```javascript
// Verificar soporte:
if (!window.indexedDB) {
  alert('Tu navegador no soporta IndexedDB');
}

// Ver espacio disponible:
navigator.storage.estimate().then(estimate => {
  console.log('Usado:', estimate.usage);
  console.log('Disponible:', estimate.quota);
});

// Limpiar si es necesario:
indexedDB.deleteDatabase('MiEconomiaDB');
location.reload();
```

---

### Problema: PWA no se instala
```
No aparece botón "Instalar"
```

**Requisitos para PWA:**
1. ✅ HTTPS (o localhost para desarrollo)
2. ✅ manifest.json válido
3. ✅ Service Worker registrado
4. ✅ Al menos 2 visitas en 5 minutos (Chrome)

**Verificar:**
```
F12 → Application → Manifest
F12 → Application → Service Workers
```

**Instalar manualmente:**
- Chrome: ⋮ → Instalar Mi Economía
- Safari iOS: Compartir → Añadir a pantalla de inicio
- Edge: ⋮ → Aplicaciones → Instalar

---

### Problema: Datos desaparecieron
```
Usuario: "Perdí todos mis datos"
```

**Causas:**
- Limpió caché/datos del navegador
- Cambió de navegador/dispositivo
- Modo incógnito (datos no persisten)

**Prevención:**
```javascript
// Exportar datos regularmente
async function exportBackup() {
  const allData = {
    income: await DB.getAll('income'),
    expenses: await DB.getAll('expenses'),
    obligations: await DB.getAll('obligations'),
    masterProducts: await DB.getAll('masterProducts'),
    stores: await DB.getAll('stores'),
    shoppingLists: await DB.getAll('shoppingLists'),
    date: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(allData, null, 2)], 
    { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mi-economia-backup-${Date.now()}.json`;
  a.click();
}
```

---

### Problema: No funciona offline
```
Error: Failed to fetch
```

**Verificar:**
1. Service Worker instalado correctamente
2. Archivos en cache
3. Primera visita con internet (para cachear)

**Depurar:**
```
F12 → Application → Cache Storage
F12 → Network → ✅ Offline (simular sin internet)
```

---

## 🔍 Herramientas de Depuración

### Chrome DevTools
```
F12 → Application
├── Service Workers (ver estado)
├── Cache Storage (ver archivos cacheados)
├── IndexedDB (ver base de datos)
├── Manifest (validar PWA)
└── Storage (ver uso)
```

### Console Útil
```javascript
// Ver versión de cache activa
caches.keys().then(console.log);

// Ver tamaño de IndexedDB
navigator.storage.estimate().then(est => {
  console.log('MB usados:', (est.usage/1024/1024).toFixed(2));
});

// Verificar Chart.js
console.log('Chart.js:', typeof Chart !== 'undefined' ? 'OK' : 'NO');

// Ver todas las bases de datos
indexedDB.databases().then(console.log);
```

---

## 📱 Problemas Específicos por Plataforma

### iOS Safari
- ⚠️ Tracking Prevention puede bloquear CDN
- ⚠️ Datos se limpian después de 7 días sin uso
- ✅ Solución: Exportar/Importar datos regularmente

### Android Chrome
- ✅ Funciona perfectamente
- ✅ PWA se instala como app nativa
- ✅ Datos persisten indefinidamente

### Windows Edge
- ✅ Excelente soporte de PWA
- ✅ Se integra con taskbar
- ✅ Notificaciones nativas

### Firefox
- ⚠️ Soporte PWA limitado
- ✅ Funciona como web app
- ✅ Service Worker OK

---

## 🚨 Errores Críticos

### Error: "TypeError: DB.init is not a function"
```javascript
// db.js no se cargó o tiene error de sintaxis
// Solución: Verificar orden de scripts en index.html
<script src="js/db.js"></script> <!-- DEBE ir primero -->
<script src="js/app.js"></script>
```

### Error: "Cannot read property 'getAll' of undefined"
```javascript
// IndexedDB no inicializada
// Solución: Esperar a que DB.init() termine
await DB.init();
const data = await DB.getAll('income');
```

### Error: "QuotaExceededError"
```javascript
// Sin espacio de almacenamiento
// Solución:
1. Exportar datos
2. Limpiar base de datos
3. Importar datos esenciales
```

---

## ✅ Checklist de Verificación

Antes de reportar un bug, verifica:

- [ ] Hard reload (Ctrl+Shift+R)
- [ ] Service Worker actualizado
- [ ] Chart.js se carga (o app funciona sin él)
- [ ] IndexedDB creada (F12 → Application)
- [ ] No estás en modo incógnito
- [ ] Navegador actualizado
- [ ] JavaScript habilitado
- [ ] Espacio disponible en disco

---

## 📞 Soporte

Si el problema persiste:

1. **Abrir issue en GitHub** con:
   - Navegador y versión
   - Sistema operativo
   - Pasos para reproducir
   - Screenshot de consola (F12)
   - Screenshot de Application → Service Workers

2. **Incluir datos de depuración:**
```javascript
// Ejecutar en consola y copiar resultado:
console.log({
  browser: navigator.userAgent,
  indexedDB: !!window.indexedDB,
  serviceWorker: 'serviceWorker' in navigator,
  chartJS: typeof Chart !== 'undefined',
  storage: await navigator.storage.estimate()
});
```

---

**Versión:** 2.0.0  
**Última actualización:** 2026-04-26
