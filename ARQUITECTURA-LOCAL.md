# 🔒 ARQUITECTURA 100% LOCAL - MI ECONOMÍA PWA

## ✅ CONFIRMACIÓN: Datos 100% en el Dispositivo del Usuario

**Mi Economía es una PWA completamente local.** Todos los datos se almacenan ÚNICAMENTE en el navegador del usuario.

---

## 📦 Dónde se Almacenan los Datos

### IndexedDB (Base de Datos Local del Navegador)
- **Ubicación:** Dentro del navegador del usuario
- **Nombre DB:** `MiEconomiaDB`
- **Versión:** 2
- **Persistencia:** Datos permanecen aunque cierres el navegador
- **Privacidad:** Nadie más puede acceder a estos datos

### Verificar en el Navegador (Chrome/Edge):
```
1. F12 (Abrir DevTools)
2. Pestaña "Application"
3. Sidebar izquierdo → "Storage" → "IndexedDB"
4. Ver: MiEconomiaDB
```

---

## 🗄️ Estructura de Datos Local

### Tablas en IndexedDB (9 tablas):

#### Finanzas Personales:
1. **income** - Ingresos del usuario
2. **expenses** - Gastos del usuario
3. **obligations** - Obligaciones/deudas
4. **obligationPayments** - Pagos de obligaciones

#### Supermercado:
5. **masterProducts** - Catálogo de productos (60+)
6. **stores** - Supermercados favoritos
7. **shoppingLists** - Listas de compras
8. **shoppingProducts** - Productos en cada lista
9. **priceHistory** - Historial de precios

#### Configuración:
10. **settings** - Configuraciones del usuario

---

## 🔐 Seguridad y Privacidad

### ✅ Qué SÍ hace la app:
- Guarda datos en IndexedDB (local al navegador)
- Funciona 100% offline
- No requiere internet después de la primera carga
- Los datos viajan CERO veces por la red

### ❌ Qué NO hace la app:
- ❌ NO envía datos a servidores
- ❌ NO tiene backend
- ❌ NO sincroniza con la nube
- ❌ NO tiene cuentas de usuario
- ❌ NO usa APIs externas (excepto Chart.js desde CDN para gráficos)
- ❌ NO hay login/registro
- ❌ NO hay tracking o analytics

---

## 💾 Persistencia de Datos

### ¿Cuánto tiempo se guardan los datos?
**Indefinidamente**, hasta que:
1. El usuario limpia los datos del navegador
2. El usuario desinstala la PWA
3. El usuario borra manualmente IndexedDB

### ¿Se pueden perder los datos?
Sí, en estos casos:
- Limpiar caché/cookies del navegador
- Desinstalar/reinstalar navegador
- Formatear dispositivo

### Solución: Export/Import
La app permite exportar datos para backup:
```javascript
// Función de exportación (ya incluida)
async function exportAllData() {
    const allData = {
        income: await DB.getAll('income'),
        expenses: await DB.getAll('expenses'),
        obligations: await DB.getAll('obligations'),
        masterProducts: await DB.getAll('masterProducts'),
        stores: await DB.getAll('stores'),
        // ... etc
    };
    
    const blob = new Blob([JSON.stringify(allData)], { type: 'application/json' });
    // Descargar archivo
}
```

---

## 🌐 Sin Backend = Máxima Privacidad

### Comparación:

| Característica | Mi Economía | Apps Tradicionales |
|----------------|-------------|-------------------|
| Almacenamiento | IndexedDB (local) | Base de datos en servidor |
| Internet requerido | Solo primera carga | Siempre |
| Privacidad | 100% privada | Datos en servidor |
| Sincronización | No (local únicamente) | Sí (multi-dispositivo) |
| Login | No requerido | Requerido |
| Costo servidor | $0 | $$$$ |

---

## 📱 Multi-Dispositivo (Importante Entender)

### ¿Cómo funciona en múltiples dispositivos?

**Cada dispositivo tiene SU PROPIA copia de datos.**

#### Ejemplo:
```
Usuario abre Mi Economía en:
- 💻 Laptop Chrome → Base de datos A (independiente)
- 📱 iPhone Safari → Base de datos B (independiente)
- 🖥️ PC Edge → Base de datos C (independiente)

¡Son 3 bases de datos SEPARADAS!
```

#### ¿Se sincronizan entre dispositivos?
**NO.** Cada dispositivo mantiene sus propios datos.

#### ¿Cómo compartir datos entre dispositivos?
Opciones:
1. **Export/Import manual** (ya incluido)
2. **Agregar sincronización en el futuro** (requiere backend)

---

## 🔄 Service Worker y Caché

### ¿Qué cachea el Service Worker?
Solo archivos estáticos:
- HTML, CSS, JavaScript
- Imágenes, iconos
- Manifest

### ¿Cachea datos del usuario?
**NO.** Los datos están en IndexedDB, no en caché del service worker.

---

## 🛠️ Para Desarrolladores

### Limpiar IndexedDB en desarrollo:
```javascript
// En consola del navegador (F12):
indexedDB.deleteDatabase('MiEconomiaDB');
location.reload();
```

### Ver tamaño de datos:
```javascript
// En consola:
if (navigator.storage && navigator.storage.estimate) {
  navigator.storage.estimate().then(estimate => {
    console.log('Usado:', (estimate.usage / 1024 / 1024).toFixed(2), 'MB');
    console.log('Disponible:', (estimate.quota / 1024 / 1024).toFixed(2), 'MB');
  });
}
```

### Límites de IndexedDB:
- **Chrome/Edge:** ~80% del espacio disponible en disco
- **Firefox:** Sin límite fijo (pide permiso si >50MB)
- **Safari:** ~1GB (iOS puede limpiar si no se usa por 7 días)

---

## 🚀 Ventajas de Arquitectura 100% Local

### ✅ Pros:
1. **Privacidad total** - Tus datos nunca salen del dispositivo
2. **Funciona offline** - No necesitas internet
3. **Gratis para siempre** - Sin costos de servidor
4. **Rápida** - Todo es local, cero latencia
5. **Sin límite de usuarios** - Cada persona usa su propia copia
6. **Open source** - Código transparente en GitHub

### ⚠️ Contras:
1. **No multi-dispositivo automático** - Datos no se sincronizan
2. **Backup manual** - Usuario debe exportar para respaldar
3. **Puede perderse** - Si limpia navegador o cambia de dispositivo
4. **No colaborativo** - No se puede compartir con familia en tiempo real

---

## 🔮 Opciones Futuras (Opcional)

Si en el futuro quieres agregar sincronización:

### Opción A: Sincronización con Backend Propio
```javascript
// Supabase, Firebase, o tu propio servidor
// Requiere agregar autenticación
```

### Opción B: Sincronización P2P
```javascript
// WebRTC para compartir entre dispositivos sin servidor
```

### Opción C: Export/Import Automático a Drive
```javascript
// Guardar backup automático en Google Drive del usuario
```

**Por ahora:** 100% local es perfecto para privacidad máxima.

---

## 📋 Checklist de Privacidad

- ✅ Sin login/registro
- ✅ Sin cookies de tracking
- ✅ Sin analytics (Google Analytics, etc.)
- ✅ Sin conexión a APIs de terceros (excepto Chart.js CDN)
- ✅ Sin envío de datos
- ✅ Sin backend
- ✅ Sin base de datos remota
- ✅ Código abierto en GitHub
- ✅ PWA instalable (funciona como app nativa)
- ✅ Todo en IndexedDB local

---

## 🎯 Resumen Final

```
┌─────────────────────────────────────┐
│     MI ECONOMÍA PWA                 │
│     100% LOCAL                      │
├─────────────────────────────────────┤
│                                     │
│  Usuario (Navegador)                │
│  ┌─────────────────────────────┐   │
│  │  IndexedDB (Local)          │   │
│  │  • Ingresos                 │   │
│  │  • Gastos                   │   │
│  │  • Obligaciones             │   │
│  │  • Productos                │   │
│  │  • Listas                   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ❌ NO HAY SERVIDOR                │
│  ❌ NO HAY BACKEND                 │
│  ❌ NO HAY SINCRONIZACIÓN          │
│  ❌ NO HAY ENVÍO DE DATOS          │
│                                     │
└─────────────────────────────────────┘
```

**Tu información NUNCA sale de tu dispositivo.** 🔒

---

**Última actualización:** 2026-04-26  
**Versión DB:** v2  
**Arquitectura:** 100% Client-side
