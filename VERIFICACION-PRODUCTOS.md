# VERIFICACIÓN - PRODUCTOS HARDCODEADOS

Los productos DEBEN estar en `supermarket-v2.js` línea 5-84 aproximadamente.

```javascript
DEFAULT_PRODUCTS: [
    // Granos
    { name: 'Arroz', category: 'grains', defaultQuantity: 8, unit: 'kg', favorite: false },
    { name: 'Frijoles negros', category: 'grains', defaultQuantity: 4, unit: 'paquete', favorite: false },
    // ... 60+ productos más
]
```

**IMPORTANTE:** Estos productos se cargan AUTOMÁTICAMENTE en IndexedDB cuando se inicializa SupermarketV2.

**Flujo correcto:**
1. Usuario entra a Supermercado → Ve dashboard (SIN modal)
2. Click "Nueva Lista" → Ve formulario (SIN modal)
3. Llena nombre y tienda
4. Click "📦 Pre-cargar Productos" → AQUÍ sí abre modal
5. Modal carga productos desde IndexedDB
6. Usuario selecciona y agrega

**Problema actual:** Modal se abre solo al entrar a Compras

**Solución:** Eliminar cualquier llamada automática a showPreloadModal()
