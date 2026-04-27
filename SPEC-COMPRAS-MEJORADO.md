# 🛒 SISTEMA DE COMPRAS MEJORADO - ESPECIFICACIÓN TÉCNICA

## 📋 CAMBIOS A IMPLEMENTAR

### 1. PRE-CARGA CON CANTIDADES EDITABLES

**Actual:**
```html
☑ Arroz
  8 kg (fijo)
```

**Nuevo:**
```html
☑ Arroz
  <input type="number" value="8" min="0.1" step="0.1"> kg
```

**Implementación:**
- Cada producto tendrá input de cantidad
- Se guarda en array temporal al seleccionar
- Al confirmar, se usan las cantidades personalizadas

---

### 2. MODO COMPRAS vs EDITAR

**Dashboard → Listas Activas:**
```
[✏️ Editar] [🛒 Modo Compras] [📋 Duplicar] [✅ Finalizar] [🗑️]
```

**Modo Editar:**
- Modificar lista ANTES de ir al super
- Agregar/eliminar productos
- Cambiar cantidades
- Establecer precios estimados
- Guardar cambios

**Modo Compras:**
- Usar EN el supermercado
- Ver productos pendientes
- Buscar y agregar productos
- Marcar como comprado ✓
- Editar cantidades sobre la marcha
- Agregar precios individuales (opcional)
- Finalizar con Total General (opcional)

---

### 3. PRECIOS FLEXIBLES

**Sistema de Precios:**

Opción A - Precios Individuales:
```
Arroz: ₡3,500
Leche: ₡2,800
Pan: ₡1,200
TOTAL AUTO: ₡7,500
```

Opción B - Total General:
```
Arroz: (vacío)
Leche: (vacío)
Pan: (vacío)
TOTAL MANUAL: ₡7,500 ← Usuario ingresa
```

Opción C - Mixto (pero Total General gana):
```
Arroz: ₡3,500 ← Ignorado
Leche: ₡2,800 ← Ignorado
Pan: (vacío)
TOTAL MANUAL: ₡10,000 ← Este se usa
```

**Regla:** Si existe Total General, se usa ese y se ignoran precios individuales.

---

### 4. BUSCADOR EN MODO COMPRAS

**Flujo:**
```
Usuario busca: "tomate"

Caso A - Producto NO en lista:
→ Resultado: "Tomate cherry 500g"
→ Click "Agregar"
→ Se agrega a lista con cantidad por defecto
→ Aparece en productos pendientes

Caso B - Producto YA en lista:
→ Resultado: "Tomate cherry 500g ✓ En lista"
→ Click "Marcar Comprado"
→ Producto se mueve a sección "Comprados" (abajo, tachado)
```

---

### 5. PRODUCTOS COMPRADOS

**Estructura Visual:**

```
🛒 MODO COMPRAS

📝 Productos Pendientes (5)
┌─────────────────────────┐
│ ☐ Arroz 2kg            │
│ ☐ Leche 3lt            │
│ ☐ Pan 1u               │
│ ☐ Huevos 12u           │
│ ☐ Queso 500g           │
└─────────────────────────┘

✅ Productos Comprados (2)
┌─────────────────────────┐
│ ☑̶ ̶T̶o̶m̶a̶t̶e̶ ̶1̶k̶g̶    [↩️] │
│ ☑̶ ̶C̶e̶b̶o̶l̶l̶a̶ ̶5̶0̶0̶g̶  [↩️] │
└─────────────────────────┘
```

**Interacción:**
- Marcar ☐ → ☑ mueve a "Comprados"
- Click [↩️] → Confirmación: "¿Comprar nuevamente o fue error?"
  - "Comprar nuevamente" → Vuelve a pendientes con cantidad +1
  - "Fue error" → Vuelve a pendientes sin cambios

---

### 6. FINALIZAR COMPRA

**Modal Final:**
```
┌─────────────────────────────────┐
│ Finalizar Compra                │
├─────────────────────────────────┤
│                                 │
│ Productos: 15                   │
│ Comprados: 12                   │
│ Pendientes: 3                   │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Precios Individuales        │ │
│ │                             │ │
│ │ Arroz:    ₡3,500           │ │
│ │ Leche:    ₡2,800           │ │
│ │ Pan:      (vacío)          │ │
│ │ ...                         │ │
│ │                             │ │
│ │ Total Auto: ₡45,230        │ │
│ └─────────────────────────────┘ │
│                                 │
│ O                               │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Total General               │ │
│ │ [₡50,000_______]           │ │
│ │                             │ │
│ │ ⚠️ Esto ignorará precios   │ │
│ │ individuales                │ │
│ └─────────────────────────────┘ │
│                                 │
│    [Cancelar] [✅ Finalizar]   │
└─────────────────────────────────┘
```

---

## 🗂️ ESTRUCTURA DE DATOS

### Lista de Compras (shoppingLists)
```javascript
{
  id: 1,
  name: "Compra Semanal",
  storeId: 2,
  storeName: "Walmart",
  date: "2026-04-26",
  completed: false,
  totalEstimated: 45000,
  totalActual: 50000,    // Puede ser auto o manual
  totalManual: 50000,    // Si usuario ingresó total general
  itemCount: 15,
  mode: 'shopping' // 'edit' | 'shopping'
}
```

### Productos de Lista (shoppingProducts)
```javascript
{
  id: 1,
  listId: 1,
  productId: 5,
  name: "Arroz",
  quantity: 2,
  unit: "kg",
  estimatedPrice: 3500,
  actualPrice: 3500,
  checked: true,         // Marcado como comprado
  checkedAt: "2026-04-26T10:30:00"
}
```

---

## 🎯 FUNCIONES NUEVAS

### supermarket-v2.js

```javascript
// Modal pre-carga con cantidades editables
showPreloadModalWithQuantities()

// Modo Compras
enterShoppingMode(listId)
exitShoppingMode()

// Marcar/Desmarcar productos
toggleProductChecked(productId)
uncheckProduct(productId) // con confirmación

// Buscador en compras
searchInShoppingMode(query)
addSearchedProduct(productId)
markSearchedAsChecked(productId)

// Finalizar con total general
showFinalizeModal()
finishWithManualTotal(totalAmount)
finishWithIndividualPrices()
```

---

## ✅ TESTING CHECKLIST

### Test 1: Pre-carga con cantidades
- [ ] Modal abre correctamente
- [ ] Cada producto tiene input de cantidad
- [ ] Cantidades son editables
- [ ] Se guardan correctamente al agregar

### Test 2: Modo Editar vs Modo Compras
- [ ] Botón "Editar" abre modo edición
- [ ] Botón "Modo Compras" abre modo shopping
- [ ] Ambos modos son diferentes visualmente
- [ ] Funcionalidades correctas en cada modo

### Test 3: Marcar Comprados
- [ ] Click en checkbox marca producto
- [ ] Producto se mueve a sección "Comprados"
- [ ] Aparece tachado
- [ ] Botón de desmarcar funciona
- [ ] Confirmación al desmarcar

### Test 4: Buscador en Compras
- [ ] Buscar producto no en lista → Agregar
- [ ] Buscar producto en lista → Marcar comprado
- [ ] Resultados correctos

### Test 5: Precios Flexibles
- [ ] Guardar sin precios → OK
- [ ] Guardar con algunos precios → OK
- [ ] Finalizar con precios individuales → Total auto
- [ ] Finalizar con Total General → Ignora individuales

### Test 6: Finalizar Compra
- [ ] Modal muestra resumen correcto
- [ ] Opción A (individuales) funciona
- [ ] Opción B (total general) funciona
- [ ] Total general sobrescribe individuales
- [ ] Gasto se registra correctamente
- [ ] Dashboard se actualiza

---

## 📱 RESPONSIVE

Todas las nuevas funciones deben ser:
- Touch-friendly
- Responsive en móvil
- Botones grandes
- Inputs accesibles

---

**PRÓXIMO PASO:** Implementar estos cambios en el código.
