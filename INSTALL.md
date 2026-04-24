# 🚀 Instalación Rápida - Mi Economía

## GitHub Pages (Recomendado)

1. **Sube el proyecto a GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Mi Economía PWA"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/mi-economia-pwa.git
   git push -u origin main
   ```

2. **Activa GitHub Pages**
   - Ve a tu repositorio en GitHub
   - Settings → Pages
   - Source: Deploy from branch `main` → `/` (root)
   - Save

3. **Accede a tu app**
   - URL: `https://TU-USUARIO.github.io/mi-economia-pwa`
   - Espera 2-3 minutos para el primer despliegue

---

## Vercel (Alternativa)

```bash
npm install -g vercel
cd mi-economia-pwa
vercel
```

Sigue las instrucciones en pantalla.

---

## Netlify (Alternativa)

1. Arrastra la carpeta `mi-economia-pwa` a https://app.netlify.com/drop
2. ¡Listo! Tu app estará en línea en segundos

---

## Local (Desarrollo)

```bash
# Opción 1: Python
python -m http.server 8000

# Opción 2: Node.js
npx http-server

# Opción 3: PHP
php -S localhost:8000
```

Abre: http://localhost:8000

---

## ✅ Verificación Post-Instalación

1. Abre la aplicación en tu navegador
2. Verifica que el logo aparece correctamente
3. Prueba agregar un ingreso o gasto
4. Revisa el Dashboard
5. Instala la PWA (botón en la barra de direcciones)

---

## 📱 Instalar como App

### Android
1. Chrome → Menú (⋮) → "Agregar a pantalla de inicio"

### iOS
1. Safari → Compartir  → "Agregar a pantalla de inicio"

### Windows/Mac
1. Edge/Chrome → Icono de instalación en la barra de direcciones

---

## 🐛 Solución de Problemas

**No se ven los iconos:**
- Verifica que la carpeta `icons/` tiene todos los archivos PNG
- Limpia caché del navegador (Ctrl+Shift+R)

**Los datos no persisten:**
- Asegúrate que IndexedDB está habilitado en tu navegador
- No uses modo incógnito

**La PWA no se instala:**
- Verifica que estás usando HTTPS o localhost
- Revisa la consola del navegador (F12) para errores

---

## 📞 Soporte

Crea un issue en GitHub con:
- Descripción del problema
- Navegador y versión
- Sistema operativo
- Captura de pantalla (si aplica)
