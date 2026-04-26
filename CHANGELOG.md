# 📝 Changelog - Mi Economía PWA

## [2.0.0] - 2026-04-26

### 🛒 SUPERMERCADO V2 - ACTUALIZACIÓN MAYOR

#### Nuevas Funcionalidades
- ✅ **Catálogo Maestro**: 60+ productos pre-cargados organizados en 14 categorías
  - Granos, Lácteos, Carnes, Frutas, Vegetales, Panadería, Bebidas, Snacks, Pastas, Enlatados, Cereales, Aceites, Limpieza, Cuidado Personal
- ✅ **Sistema de Tiendas**: 4 supermercados pre-configurados (AutoMercado, Walmart, Mas x Menos, Fresh Market)
- ✅ **Dashboard Dedicado del Supermercado**:
  - Presupuesto mensual de compras
  - Total gastado este mes
  - Disponible
  - Porcentaje de ahorro
  - Gráfico de gastos por tienda
- ✅ **Listas Inteligentes**:
  - Búsqueda rápida de productos desde el catálogo
  - Productos sugeridos basados en frecuencia
  - Ajuste de cantidades y precios por producto
  - Total estimado en tiempo real
  - Marcar productos como comprados (checkbox)
- ✅ **Historial de Precios**: Tracking automático de precios por producto y tienda
- ✅ **Productos Frecuentes**: Muestra los 5 productos más comprados
- ✅ **Integración Automática**: Al finalizar compra → se registra como gasto en categoría "groceries"
- ✅ **Gestión de Favoritos**: Marca productos del catálogo como favoritos

#### Mejoras de Privacidad y Arquitectura
- 🔒 **Confirmado 100% Local**: Eliminados todos los índices de `userId`
- 🔒 **Sin Backend**: Ningún dato sale del dispositivo del usuario
- 🔒 **IndexedDB Local**: Todos los datos permanecen en el navegador
- 🔒 **Sin Tracking**: Cero analytics o cookies de terceros

#### Mejoras Técnicas
- ✅ Base de datos actualizada de v1 → v2
- ✅ 5 nuevas tablas en IndexedDB:
  - `masterProducts` - Catálogo maestro
  - `stores` - Supermercados
  - `shoppingLists` - Listas de compras
  - `shoppingProducts` - Productos en cada lista
  - `priceHistory` - Historial de precios

#### Archivos Nuevos
- `/js/modules/supermarket-v2.js` - Módulo completo (400+ líneas)
- `/css/supermarket-v2.css` - Estilos del módulo
- `/ARQUITECTURA-LOCAL.md` - Documentación de privacidad 100% local
- `/INTEGRACION-SUPERMERCADO-V2.md` - Guía de integración paso a paso

#### Flujo de Usuario Mejorado
```
1. Crear lista → Seleccionar tienda
2. Buscar productos en catálogo maestro
3. Agregar productos con cantidades/precios
4. Ver total estimado en tiempo real
5. Finalizar compra → Se registra automáticamente en Gastos
6. Se actualizan precios históricos
7. Se incrementa frecuencia de productos
```

---

## [1.0.2] - 2026-04-26

### 🐛 Correcciones de Compatibilidad
- **CRÍTICO:** Chart.js ahora es opcional - app funciona sin gráficos si CDN está bloqueado
- **Safari:** Tracking Prevention ya no rompe la aplicación
- **Fechas:** Fallback para navegadores sin soporte completo de Intl.DateFormat
- **Gráficos:** Degradación elegante cuando Chart.js no está disponible

### 🔧 Cambios Técnicos
- Chart.js se carga dinámicamente con manejo de errores
- Service Worker actualizado (no cachea Chart.js de CDN)
- Funciones de renderizado de gráficos con validación de Chart.js
- formatDate() con try-catch y fallback manual

### ✅ Compatibilidad Mejorada
- Safari con Tracking Prevention activado
- iOS Safari (todas las versiones)
- Navegadores con privacidad estricta
- Navegadores antiguos sin Intl completo

### 📚 Documentación
- Nuevo archivo: SAFARI-FIX.md con detalles técnicos

---

## [1.0.1] - 2026-04-23

### 🐛 Correcciones Críticas
- **Supermercado:** Modal de agregar producto ahora se abre correctamente
- **Supermercado:** Formulario dentro del modal captura valores correctamente
- **Supermercado:** Productos se agregan a la lista sin errores
- **Formularios:** Inicialización de fechas mejorada con setTimeout para evitar race conditions
- **Dashboard:** Auto-refresh al inicializar el módulo
- **Calculadoras:** Función `calculateSavingsFromExtraPayment` corregida
- **Obligaciones:** Validación de día de vencimiento agregada (1-31)

### ✨ Mejoras
- Mejor manejo de errores con console.log para debugging
- Validaciones adicionales en formularios
- Mensajes de error más descriptivos

### 📚 Documentación
- Manual de pruebas completo agregado (MANUAL-PRUEBAS.md)
- Archivo de pruebas funcionales (test.html)
- Checklist QA actualizado

---

## [1.0.0] - 2026-04-23

### 🎉 Lanzamiento Inicial

#### Funcionalidades Core
- ✅ Dashboard con KPIs financieros
- ✅ Módulo de Ingresos (CRUD completo)
- ✅ Módulo de Gastos Variables
- ✅ Módulo de Obligaciones Recurrentes
- ✅ Módulo de Supermercado integrado
- ✅ 4 Calculadoras Financieras
- ✅ Reportes por período

#### Características Técnicas
- PWA completa con Service Worker
- IndexedDB para persistencia offline
- Chart.js para visualizaciones
- Responsive design (Mobile-first)
- Multi-tenant desde el diseño

#### Diseño
- Paleta de colores moderna
- Logo con difuminado circular
- Navegación bottom-nav
- Animaciones suaves

---

## Notas de Versión

### Compatibilidad
- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+

### Dependencias
- Chart.js 4.4.0 (CDN)
- IndexedDB (nativo)

### Próximas Mejoras Planificadas
- [ ] Exportación de datos (CSV, Excel)
- [ ] Modo oscuro
- [ ] Push notifications nativas
- [ ] IA para categorización automática
- [ ] Sincronización en la nube (SaaS)
