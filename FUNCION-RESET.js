// FUNCIÓN DE RESETEO COMPLETO
// Agregar en js/app.js

async resetApp() {
    if (!confirm('⚠️ ¿Estás seguro?\n\nEsto eliminará:\n- Todos los ingresos\n- Todos los gastos\n- Todas las obligaciones\n- Todas las listas de compras\n- Todo el historial\n\nEsta acción NO se puede deshacer.')) {
        return;
    }

    // Segunda confirmación
    const confirmText = prompt('Escribe "BORRAR TODO" para confirmar:');
    if (confirmText !== 'BORRAR TODO') {
        alert('Cancelado');
        return;
    }

    try {
        // 1. Borrar IndexedDB
        await new Promise((resolve, reject) => {
            const req = indexedDB.deleteDatabase('MiEconomiaDB');
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });

        // 2. Borrar localStorage
        localStorage.clear();

        // 3. Borrar sessionStorage
        sessionStorage.clear();

        // 4. Desregistrar Service Workers
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
            await registration.unregister();
        }

        // 5. Limpiar caché
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(name => caches.delete(name))
            );
        }

        alert('✅ App reseteada completamente.\n\nLa página se recargará.');
        
        // 6. Recargar
        window.location.reload(true);
    } catch (error) {
        console.error('Error al resetear:', error);
        alert('❌ Error al resetear la app. Revisa la consola.');
    }
}

// USO:
// App.resetApp();
