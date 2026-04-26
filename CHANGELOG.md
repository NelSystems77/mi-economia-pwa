# 📝 Changelog - Mi Economía PWA

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
