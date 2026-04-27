# 🧪 Manual de Pruebas QA - Mi Economía PWA

## ✅ Checklist de Pruebas Funcionales

### 1. Dashboard 📊

**Prueba:** Visualización inicial
- [ ] El dashboard carga correctamente
- [ ] Se muestran las 4 tarjetas de KPIs (Ingresos, Gastos, Balance, Ahorro)
- [ ] Los valores iniciales son $0.00
- [ ] El porcentaje de ahorro muestra 0%
- [ ] Se muestran los gráficos (pueden estar vacíos)
- [ ] La sección de alertas dice "No hay alertas pendientes 🎉"

**Prueba:** Selector de período
- [ ] El selector tiene las opciones: Mes actual, Mes anterior, Año actual
- [ ] Cambiar el período actualiza los datos

---

### 2. Módulo de Ingresos 💰

**Prueba:** Agregar ingreso
1. Navegar a Ingresos
2. Completar el formulario:
   - Descripción: "Salario Abril"
   - Monto: 1500
   - Categoría: Salario
   - Fecha: (debe tener fecha de hoy por defecto)
   - NO marcar recurrente
3. Clic en "Guardar Ingreso"

**Resultado Esperado:**
- [ ] Mensaje de éxito: "Ingreso registrado exitosamente"
- [ ] El ingreso aparece en la tabla de historial
- [ ] El formulario se limpia
- [ ] La fecha vuelve al día de hoy

**Prueba:** Ver historial
- [ ] La tabla muestra: Fecha, Descripción, Categoría, Monto, Acciones
- [ ] El monto se muestra en verde
- [ ] Los ingresos están ordenados por fecha (más reciente primero)

**Prueba:** Eliminar ingreso
- [ ] Clic en 🗑️
- [ ] Aparece confirmación
- [ ] Al confirmar, el ingreso desaparece
- [ ] Mensaje de éxito

**Prueba:** Ingreso recurrente
- [ ] Marcar checkbox "Ingreso recurrente"
- [ ] Guardar
- [ ] En la tabla aparece el ícono 🔄 junto a la descripción

---

### 3. Módulo de Gastos 💸

**Prueba:** Agregar gasto
1. Navegar a Gastos
2. Completar el formulario:
   - Descripción: "Gasolina"
   - Monto: 50
   - Categoría: Gasolina
   - Fecha: (debe tener fecha de hoy)
3. Guardar

**Resultado Esperado:**
- [ ] Mensaje de éxito
- [ ] Aparece en la tabla
- [ ] El monto se muestra en rojo
- [ ] Formulario se limpia

**Prueba:** Categorías disponibles
- [ ] Gasolina
- [ ] Mantenimiento Vehículo
- [ ] Mantenimiento Hogar
- [ ] Supermercado
- [ ] Salud
- [ ] Entretenimiento
- [ ] Educación
- [ ] Otro

---

### 4. Módulo de Obligaciones 📅

**Prueba:** Agregar obligación
1. Navegar a Obligaciones
2. Completar:
   - Nombre: "Electricidad ICE"
   - Monto: 15000
   - Categoría: Electricidad
   - Día de vencimiento: 15
   - Días de anticipación: 3
3. Guardar

**Resultado Esperado:**
- [ ] Obligación aparece en "Obligaciones Activas"
- [ ] Muestra: nombre, monto, fecha de vencimiento, categoría
- [ ] Tiene botones: ✅ Pagado y 🗑️

**Prueba:** Estados de obligación
- [ ] Si el día actual < (día vencimiento - días alerta): Sin color especial
- [ ] Si faltan ≤3 días: Borde amarillo, estado "pending"
- [ ] Si es hoy: Borde amarillo, "Vence hoy"
- [ ] Si ya venció: Borde rojo, "Venció hace X días"

**Prueba:** Marcar como pagado
1. Clic en "✅ Pagado"
2. **Resultado:**
   - [ ] Mensaje: "Pago de [nombre] registrado"
   - [ ] Aparece en "Historial de Pagos"
   - [ ] La obligación sigue activa para el próximo mes

**Prueba:** Historial de pagos
- [ ] Muestra: Fecha Pago, Obligación, Monto, Estado
- [ ] Estado muestra "✅ Pagado" en verde

---

### 5. Módulo de Supermercado 🛒

**Prueba:** Crear lista
1. Navegar a Supermercado
2. Clic en "➕ Nueva Lista"
3. Ingresar nombre: "Compra semanal"
4. Aceptar

**Resultado Esperado:**
- [ ] Mensaje: "Lista creada exitosamente"
- [ ] La lista aparece en el selector "Lista Activa"
- [ ] Está seleccionada automáticamente

**Prueba:** Agregar producto (CRÍTICO)
1. Con una lista activa
2. Clic en "📦 Agregar Producto"
3. **Verificar que abre un modal** ✅
4. Completar:
   - Nombre: "Leche"
   - Cantidad: 2
   - Precio: 1500
   - Categoría: Lácteos
5. Clic en "Agregar Producto"

**Resultado Esperado:**
- [ ] Modal se cierra
- [ ] Mensaje: "Producto agregado"
- [ ] El producto aparece en "Productos en Lista"
- [ ] Muestra: checkbox, nombre (x2), categoría, precio total (₡3,000), botón 🗑️
- [ ] Resumen actualiza: Productos: 1, Total Estimado: ₡3,000

**Prueba:** Marcar producto como comprado
- [ ] Clic en checkbox
- [ ] El producto se tacha
- [ ] Se ve semi-transparente

**Prueba:** Eliminar producto
- [ ] Clic en 🗑️
- [ ] Confirmación
- [ ] Producto desaparece
- [ ] Resumen actualiza

**Prueba:** Finalizar compra (CRÍTICO)
1. Tener productos con precios
2. Clic en "✅ Finalizar Compra"
3. Confirmar

**Resultado Esperado:**
- [ ] Mensaje: "Compra finalizada y registrada en gastos"
- [ ] La lista se marca como completada
- [ ] Ya no aparece en "Lista Activa"
- [ ] **IMPORTANTE:** En el módulo de Gastos debe aparecer un nuevo gasto:
  - Descripción: "Supermercado - [nombre lista]"
  - Categoría: Supermercado
  - Monto: suma de todos los productos

---

### 6. Módulo de Calculadoras 🧮

**Calculadora de Préstamos:**
- Monto: 10000
- Tasa: 12% anual
- Plazo: 12 meses
- **Resultado esperado:**
  - [ ] Pago mensual: ~₡888
  - [ ] Total a pagar: ~₡10,656
  - [ ] Intereses: ~₡656

**Calculadora de Ahorro:**
- Ahorro mensual: 100
- Tasa: 5% anual
- Plazo: 12 meses
- **Resultado esperado:**
  - [ ] Valor futuro: ~₡1,230
  - [ ] Total depositado: ₡1,200
  - [ ] Intereses ganados: ~₡30

**Calculadora de Inversión:**
- Inversión inicial: 1000
- Aporte mensual: 100
- Rendimiento: 10% anual
- Años: 1
- **Resultado esperado:**
  - [ ] Valor final > ₡2,200
  - [ ] Muestra ROI en %

**Calculadora de Deudas:**
- Deuda: 5000
- Tasa: 24% anual
- Pago mensual: 500
- **Resultado esperado:**
  - [ ] Tiempo: ~11 meses
  - [ ] Intereses totales calculados
  - [ ] Sugerencia de ahorro al aumentar pago

**Prueba de validación:**
- Pago muy bajo (< intereses)
- **Resultado:**
  - [ ] Mensaje de error: "El pago es muy bajo"
  - [ ] Muestra el mínimo necesario

---

### 7. Módulo de Reportes 📊

**Prueba:** Generar reporte
1. Tener datos de ingresos y gastos
2. Navegar a Reportes
3. Seleccionar período (Este mes)
4. Clic en "Generar Reporte"

**Resultado Esperado:**
- [ ] Sección "Resumen Financiero" muestra:
  - Ingresos Totales
  - Gastos Totales
  - Balance
  - Tasa de Ahorro %
- [ ] Gráfico "Tendencias" muestra líneas de ingresos/gastos
- [ ] Gráfico "Categorías de Gasto" muestra distribución

---

### 8. Navegación 🧭

**Prueba:** Bottom Navigation
- [ ] Todos los íconos son visibles
- [ ] Labels: Inicio, Ingresos, Gastos, Obligaciones, Compras, Calculadoras, Reportes
- [ ] Clic en cada uno cambia el módulo
- [ ] El ícono activo se marca en verde
- [ ] Animación suave al cambiar

**Prueba:** Botón "Volver"
- [ ] En cada módulo (excepto Dashboard) hay botón "← Volver"
- [ ] Lleva al Dashboard

---

### 9. Dashboard Actualización en Tiempo Real ⚡

**Prueba:** Sincronización
1. Desde Dashboard, agregar un ingreso (₡1000)
2. Volver a Dashboard
3. **Verificar:**
   - [ ] "Ingresos" muestra ₡1,000
   - [ ] "Balance" muestra ₡1,000
   - [ ] "Ahorro" muestra 100%

4. Agregar un gasto (₡300)
5. Volver a Dashboard
6. **Verificar:**
   - [ ] "Ingresos" sigue en ₡1,000
   - [ ] "Gastos" muestra ₡300
   - [ ] "Balance" muestra ₡700
   - [ ] "Ahorro" muestra 70%

---

### 10. Alertas y Notificaciones 🔔

**Prueba:** Alertas de obligaciones
1. Crear obligación que vence en 2 días
2. **Verificar Dashboard:**
   - [ ] Aparece en "Alertas Pendientes"
   - [ ] Mensaje: "[Nombre] vence en 2 días"
   - [ ] Color amarillo

**Prueba:** Badge de notificaciones
- [ ] En header, ícono 🔔 tiene badge con número
- [ ] El número coincide con alertas activas
- [ ] Clic en 🔔 abre modal de notificaciones

---

### 11. Persistencia de Datos 💾

**Prueba:** Cierre y reapertura
1. Agregar varios registros
2. Cerrar la aplicación completamente
3. Reabrir
4. **Verificar:**
   - [ ] Todos los datos siguen ahí
   - [ ] Dashboard muestra valores correctos
   - [ ] Listas de compras siguen disponibles

---

### 12. Responsive 📱

**Prueba Mobile (< 768px):**
- [ ] Bottom nav siempre visible
- [ ] Gráficos se ajustan
- [ ] Tablas tienen scroll horizontal
- [ ] Formularios ocupan todo el ancho
- [ ] Botones son grandes (táctiles)

**Prueba Tablet (768px - 1024px):**
- [ ] Dashboard en grid 2 columnas
- [ ] Navegación bottom funcional

**Prueba Desktop (> 1024px):**
- [ ] Dashboard en grid 3-4 columnas
- [ ] Máximo ancho 1400px centrado

---

### 13. PWA 📲

**Prueba:** Instalación
- [ ] En navegador aparece opción "Instalar"
- [ ] Al instalar se abre como app independiente
- [ ] Ícono correcto en pantalla de inicio
- [ ] Splash screen con logo

**Prueba:** Offline
1. Instalar la app
2. Desconectar internet
3. Abrir la app
4. **Verificar:**
   - [ ] La app carga
   - [ ] Todas las funciones trabajan
   - [ ] No hay errores de conexión

---

## 🐛 Bugs Conocidos a Verificar

- [ ] ~~Modal de agregar producto no se abría~~ → CORREGIDO
- [ ] ~~Fechas no se inicializaban~~ → CORREGIDO
- [ ] ~~Calculadora de deudas error en función~~ → CORREGIDO
- [ ] ~~Dashboard no refrescaba al iniciar~~ → CORREGIDO

---

## ✅ Criterios de Aprobación

Para aprobar el proyecto, TODAS estas pruebas deben pasar:

1. ✅ Crear y visualizar ingreso
2. ✅ Crear y visualizar gasto
3. ✅ Crear obligación y ver alertas
4. ✅ Crear lista de compras
5. ✅ Agregar producto a lista (**CRÍTICO**)
6. ✅ Finalizar compra y registrar en gastos (**CRÍTICO**)
7. ✅ Dashboard actualiza en tiempo real
8. ✅ Todas las calculadoras funcionan
9. ✅ Datos persisten al recargar
10. ✅ Responsive en móvil y desktop

---

## 📝 Reporte de Bugs

**Formato para reportar:**
```
Módulo: [nombre]
Acción: [qué hiciste]
Esperado: [qué debería pasar]
Actual: [qué pasó]
Navegador: [Chrome/Safari/etc]
Consola: [errores en F12]
```

---

**Fecha última revisión:** 2026-04-23
**Versión:** 1.0.1 (Corregida)
