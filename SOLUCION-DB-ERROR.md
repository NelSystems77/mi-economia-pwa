# 🔧 SOLUCIÓN URGENTE - Error de Base de Datos

## ⚠️ ERROR QUE ESTÁS VIENDO:

```
NotFoundError: Failed to execute 'transaction' on 'IDBDatabase': 
One of the specified object stores was not found.
```

## 🎯 CAUSA:

La base de datos en tu navegador **todavía tiene la versión antigua** con la tabla `users` que ya eliminamos del código. El navegador está usando una base de datos "vieja" mientras el código busca la nueva estructura.

---

## ✅ SOLUCIÓN (2 PASOS SIMPLES):

### Paso 1: Limpiar Base de Datos en el Navegador

#### Opción A - Chrome/Edge (MÁS FÁCIL):
```
1. Abre la app (aunque tenga errores)
2. F12 para abrir DevTools
3. Tab "Application"
4. Menú izquierdo → "Storage"
5. Buscar "IndexedDB"
6. Click derecho en "MiEconomiaDB"
7. "Delete database"
8. Cerrar DevTools
9. Recargar página (Ctrl + Shift + R)
```

#### Opción B - Firefox:
```
1. F12 → Tab "Storage"
2. "Indexed DB"
3. Click derecho en "MiEconomiaDB"
4. "Delete database"
5. Recargar (Ctrl + Shift + R)
```

#### Opción C - Safari:
```
1. Develop → Show Web Inspector
2. Storage tab
3. IndexedDB → MiEconomiaDB
4. Delete
5. Recargar
```

---

### Paso 2: Extraer el ZIP Nuevo

```bash
# El nuevo ZIP ya tiene TODO corregido:
# - Sin referencias a userId
# - Sin tabla users
# - 100% local

1. Extrae: mi-economia-pwa-v2.0-DB-FIXED.zip
2. Reemplaza todos los archivos
3. Abre index.html
4. ¡LISTO!
```

---

## 🧪 VERIFICACIÓN

Después de los pasos anteriores:

```
1. Abre la app
2. F12 → Console
3. Debe decir:
   ✅ "Base de datos inicializada v2"
   ✅ "Productos predeterminados cargados: 60+"

4. NO debe haber errores rojos
5. Dashboard debe cargar normalmente
```

---

## 🔍 DEBUG SI PERSISTE EL ERROR

Si DESPUÉS de limpiar la DB el error persiste:

### Verificar versión de DB:
```javascript
// En la consola del navegador:
indexedDB.databases().then(console.log)

// Debe mostrar:
// name: "MiEconomiaDB"
// version: 2  ← IMPORTANTE (debe ser 2, no 1)
```

### Forzar recreación:
```javascript
// En la consola:
indexedDB.deleteDatabase('MiEconomiaDB')
location.reload()
```

---

## 📊 ESTRUCTURA CORRECTA DE LA DB v2

```
MiEconomiaDB (version: 2)
├── income
├── expenses
├── obligations
├── obligationPayments
├── masterProducts (60+ productos)
├── stores (4 tiendas)
├── shoppingLists
├── shoppingProducts
├── priceHistory
└── settings
```

**NO debe tener:**
❌ tabla `users`
❌ campo `userId` en los registros

---

## 🎯 LO QUE SE CORRIGIÓ EN ESTE ZIP

### db.js:
```javascript
// ANTES (Error):
async add(storeName, data) {
    const userId = await this.getCurrentUserId(); // ❌
    const dataWithUser = { ...data, userId };    // ❌
    // ...
}

// AHORA (Correcto):
async add(storeName, data) {
    const dataWithTimestamp = { ...data, createdAt: new Date().toISOString() };
    // Sin userId ✅
}
```

### getAll():
```javascript
// ANTES:
const userId = await this.getCurrentUserId(); // ❌
const results = request.result.filter(item => item.userId === userId); // ❌

// AHORA:
resolve(request.result); // Sin filtro de userId ✅
```

### getByDateRange():
```javascript
// ANTES:
item.userId === userId // ❌

// AHORA:
// Solo filtra por fecha ✅
```

### Funciones eliminadas:
- ❌ `getCurrentUserId()`
- ❌ `createDefaultUser()`

---

## ⚡ SOLUCIÓN RÁPIDA (1 MINUTO):

```bash
# Terminal/PowerShell:
1. cd ruta/a/tu/proyecto
2. rm -rf * (o eliminar todo manualmente)
3. unzip mi-economia-pwa-v2.0-DB-FIXED.zip
4. Navegar a la carpeta
5. Abrir index.html

# Navegador:
6. F12 → Application → IndexedDB
7. Delete "MiEconomiaDB"
8. Recargar página (Ctrl + Shift + R)

# Verificar:
9. Console debe estar limpia ✅
10. Dashboard debe cargar ✅
```

---

## 🎉 DESPUÉS DE APLICAR LA SOLUCIÓN

La app debería:
- ✅ Cargar sin errores
- ✅ Dashboard con 7 KPIs visible
- ✅ Módulo Supermercado funcional
- ✅ Pre-carga de productos funcionando
- ✅ Sin errores en consola
- ✅ 100% local (sin usuarios)

---

## 💡 IMPORTANTE

**Cada vez que cambies el esquema de la base de datos:**

1. Incrementa el número de versión en db.js:
   ```javascript
   const DB_VERSION = 3; // Era 2, ahora 3, etc.
   ```

2. O limpia manualmente la DB como se explicó arriba

**El navegador cachea la estructura de IndexedDB**, por eso necesitamos eliminarla cuando cambiamos el código.

---

## 🚀 PARA PRODUCCIÓN (GitHub Pages)

Cuando hagas push a GitHub:

```bash
git add .
git commit -m "v2.0 - DB Fixed - Sin userId"
git push origin main
```

**Los usuarios que ya usen la app verán el error la primera vez.**

**Solución para usuarios:**
- Instrúyelos a limpiar caché
- O incrementa DB_VERSION a 3 para forzar upgrade

---

**¡Esto debería solucionar el problema completamente!** 🎯
