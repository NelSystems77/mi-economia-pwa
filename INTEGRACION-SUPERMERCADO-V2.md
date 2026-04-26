# 🛒 GUÍA DE INTEGRACIÓN - SUPERMERCADO V2

## 📋 Archivos Creados

1. ✅ `/js/modules/supermarket-v2.js` - Lógica completa del módulo
2. ✅ `/css/supermarket-v2.css` - Estilos del módulo
3. ✅ `/supermarket-v2-module.html` - HTML del módulo (para copiar)
4. ✅ `/js/db.js` - Base de datos actualizada (v2)

---

## 🔧 Pasos de Integración

### 1. Actualizar `index.html`

**A. Agregar CSS en el `<head>`:**
```html
<link rel="stylesheet" href="css/styles.css">
<link rel="stylesheet" href="css/supermarket-v2.css">  <!-- NUEVO -->
```

**B. Reemplazar el módulo de Supermercado existente:**

Buscar en `index.html` la sección:
```html
<!-- Supermarket Module -->
<section id="module-supermarket" class="module">
...
</section>
```

**Reemplazar completamente** con el contenido de `supermarket-v2-module.html`

**IMPORTANTE:** Cambiar el id de:
```html
<section id="module-supermarket-v2" class="module">
```

A:
```html
<section id="module-supermarket" class="module">
```

(Esto mantiene la compatibilidad con la navegación existente)

**C. Agregar scripts antes del cierre `</body>`:**

Cambiar:
```html
<script src="js/modules/supermarket.js"></script>
```

Por:
```html
<script src="js/modules/supermarket-v2.js"></script>
```

---

### 2. Actualizar `js/app.js`

**A. En la función `loadModules()`:**

Cambiar:
```javascript
await Supermarket.init();
```

Por:
```javascript
await SupermarketV2.init();
```

**B. En `loadModuleData()`:**

Cambiar:
```javascript
case 'supermarket':
    await Supermarket.loadData();
    break;
```

Por:
```javascript
case 'supermarket':
    await SupermarketV2.showView('dashboard');
    break;
```

---

### 3. Actualizar el Bottom Navigation

En `index.html`, el botón de Supermercado ya apunta a `module-supermarket`, así que no hay que cambiar nada.

---

### 4. Configurar Presupuesto Mensual de Compras (Opcional)

Agregar en el módulo de Configuración (Settings):

```html
<div class="card">
    <h3>Presupuesto de Supermercado</h3>
    <div class="form-group">
        <label>Presupuesto Mensual para Compras</label>
        <input type="number" id="monthlyGroceryBudget" step="0.01">
        <button class="btn btn-primary" onclick="saveGroceryBudget()">Guardar</button>
    </div>
</div>
```

Y en `app.js`:

```javascript
async function saveGroceryBudget() {
    const budget = parseFloat(document.getElementById('monthlyGroceryBudget').value) || 0;
    await DB.setSetting('monthlyGroceryBudget', budget);
    SupermarketV2.monthlyBudget = budget;
    alert('Presupuesto guardado');
}
```

---

## ✅ Verificación Post-Integración

### Test 1: Inicialización
1. Abre la app
2. Ve al módulo de Supermercado
3. **Debe mostrar**: Dashboard con KPIs en ₡0.00
4. **Debe ver**: 5 botones de navegación (Dashboard, Nueva Lista, Catálogo, Tiendas, Historial)

### Test 2: Catálogo Maestro
1. Click en "📦 Catálogo"
2. **Debe mostrar**: 60+ productos pre-cargados agrupados por categoría
3. **Debe ver**: Botones de favorito ⭐, editar ✏️, eliminar 🗑️

### Test 3: Nueva Lista
1. Click en "📝 Nueva Lista"
2. Completar nombre: "Prueba"
3. Seleccionar tienda: "AutoMercado"
4. Click "Crear Lista"
5. **Debe mostrar**: Sección para agregar productos
6. Buscar: "Leche"
7. **Debe mostrar**: Resultados de búsqueda
8. Click en un producto
9. **Debe agregarse**: A la lista actual
10. Agregar precio y cantidad
11. Click "Finalizar Compra"
12. **Debe**: Registrarse en Gastos automáticamente

### Test 4: Dashboard
1. Volver al Dashboard del Supermercado
2. **Debe mostrar**: Lista activa (si hay alguna)
3. **Debe mostrar**: Productos frecuentes (después de varias compras)
4. **Debe actualizar**: KPIs después de finalizar compra

### Test 5: Integración con Gastos
1. Después de finalizar una compra
2. Ve al módulo de "Gastos"
3. **Debe aparecer**: Un nuevo gasto con categoría "Supermercado"
4. **Descripción**: "Supermercado - [Nombre Tienda]"
5. **Monto**: Igual al total de la compra

---

## 🎯 Funcionalidades Implementadas

### ✅ Catálogo Maestro
- 60+ productos pre-cargados
- Búsqueda en tiempo real
- Agregar/editar/eliminar productos
- Marcar favoritos
- Agrupación por categorías (14 categorías)
- Unidades múltiples (kg, lt, unidad, paquete, etc.)

### ✅ Gestión de Listas
- Crear múltiples listas
- Seleccionar supermercado
- Agregar productos desde catálogo con búsqueda inteligente
- Ajustar cantidades y precios
- Marcar productos como comprados (checkbox)
- Total estimado en tiempo real
- Finalizar compra

### ✅ Integración Automática
- Al finalizar compra → Se registra en Gastos
- Se actualiza historial de precios
- Se incrementa frecuencia de productos
- Se actualiza "último precio" del producto
- Se actualiza Dashboard principal

### ✅ Dashboard Supermercado
- KPIs: Presupuesto, Gastado, Disponible, % Ahorro
- Listas activas
- Productos frecuentes
- Gráfico de gastos por tienda

### ✅ Historial
- Todas las compras completadas
- Ordenado por fecha (más reciente primero)
- Detalle: Tienda, # productos, total
- Ver detalle de cada compra

### ✅ Tiendas
- 4 tiendas pre-cargadas
- Agregar/editar/eliminar tiendas
- Marcar favoritas

---

## 📊 Estructura de Datos

### masterProducts
```javascript
{
  id: 1,
  name: "Leche Semidescremada",
  defaultQuantity: 24,
  unit: "lt",
  category: "dairy",
  lastPrice: 1500,
  lastStore: "AutoMercado",
  favorite: false,
  frequency: 5  // veces comprado
}
```

### shoppingLists
```javascript
{
  id: 1,
  name: "Compra Semanal",
  storeId: 1,
  storeName: "AutoMercado",
  date: "2026-04-26",
  completed: false,
  totalEstimated: 15000,
  totalActual: 14230,  // después de finalizar
  itemCount: 12
}
```

### shoppingProducts
```javascript
{
  id: 1,
  listId: 1,
  productId: 5,
  name: "Leche Semidescremada",
  quantity: 2,
  unit: "lt",
  estimatedPrice: 1500,
  actualPrice: 1450,  // precio real pagado
  checked: false
}
```

### priceHistory
```javascript
{
  id: 1,
  productId: 5,
  storeId: 1,
  price: 1450,
  date: "2026-04-26"
}
```

---

## 🚀 Próximas Mejoras (Opcionales)

### Fase 2 (Futuro):
- [ ] Comparador de precios entre tiendas
- [ ] Plantillas de listas (guardar listas frecuentes)
- [ ] Exportar historial a Excel/PDF
- [ ] Gráficos de evolución de precios por producto
- [ ] Sugerencias automáticas basadas en frecuencia
- [ ] Código de barras (scanner)
- [ ] Compartir listas (multi-usuario)

---

## 🐛 Troubleshooting

### Error: "masterProducts is not defined"
**Solución:** La base de datos no se actualizó. Limpia IndexedDB:
```javascript
// En consola del navegador:
indexedDB.deleteDatabase('MiEconomiaDB');
// Luego recarga la página
```

### Error: "SupermarketV2 is not defined"
**Solución:** Verifica que `supermarket-v2.js` esté cargado en `index.html`

### Los productos no se pre-cargan
**Solución:** Verifica que la función `initializeDefaultData()` se ejecute en `init()`

### El gráfico no se muestra
**Solución:** Verifica que Chart.js esté cargado. Si está bloqueado (Safari), el módulo funciona sin gráficos.

---

**Integración completada exitosamente cuando:**
- ✅ Dashboard muestra KPIs
- ✅ Catálogo muestra 60+ productos
- ✅ Puedes crear listas
- ✅ Puedes agregar productos
- ✅ Al finalizar compra se registra en Gastos
- ✅ No hay errores en consola (F12)

---

**Versión:** SupermarketV2 - v1.0  
**Compatibilidad:** Mi Economía v1.0.2+  
**Fecha:** 2026-04-26
