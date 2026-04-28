const App = {
    currentModule: 'dashboard',
    charts: {},

    async init() {
        await DB.init();
        this.setupEventListeners();
        this.showModule('dashboard');
        await this.loadModules();
        this.checkNotifications();
        this.loadUserInfo();
        
        // Service Worker DESHABILITADO temporalmente por problemas de cache
        // if ('serviceWorker' in navigator) {
        //     navigator.serviceWorker.register('sw.js');
        // }
    },

    setupEventListeners() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const module = e.currentTarget.dataset.module;
                this.showModule(module);
            });
        });

        // Botón de usuario
        document.getElementById('btnUserMenu')?.addEventListener('click', () => {
            this.showUserSettings();
        });

        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const module = e.currentTarget.dataset.module;
                this.showModule(module);
            });
        });

        document.getElementById('btnNotifications')?.addEventListener('click', () => {
            this.showNotifications();
        });
    },

    showModule(moduleName) {
        document.querySelectorAll('.module').forEach(module => {
            module.classList.remove('active');
        });
        
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        const moduleElement = document.getElementById(`module-${moduleName}`);
        if (moduleElement) {
            moduleElement.classList.add('active');
        }

        const navItem = document.querySelector(`.nav-item[data-module="${moduleName}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }

        this.currentModule = moduleName;
        this.loadModuleData(moduleName);
    },

    async loadModules() {
        await Dashboard.init();
        await Income.init();
        await Expenses.init();
        await Obligations.init();
        await SupermarketV2.init();
        await Calculators.init();
    },

    async loadModuleData(moduleName) {
        switch(moduleName) {
            case 'dashboard':
                await Dashboard.refresh();
                break;
            case 'income':
                await Income.loadData();
                break;
            case 'expenses':
                await Expenses.loadData();
                break;
            case 'obligations':
                await Obligations.loadData();
                break;
            case 'supermarket':
                await SupermarketV2.showView('dashboard');
                break;
            case 'reports':
                await this.loadReports();
                break;
        }
    },

    async checkNotifications() {
        const obligations = await DB.getAll('obligations');
        const today = new Date();
        const currentDay = today.getDate();
        
        let alertCount = 0;
        
        for (const obligation of obligations) {
            const daysUntilDue = obligation.dueDay - currentDay;
            if (daysUntilDue <= obligation.alertDays && daysUntilDue >= 0) {
                alertCount++;
            }
        }

        const badge = document.getElementById('notificationBadge');
        if (badge) {
            badge.textContent = alertCount;
            badge.style.display = alertCount > 0 ? 'block' : 'none';
        }
    },

    async showNotifications() {
        const obligations = await DB.getAll('obligations');
        const today = new Date();
        const currentDay = today.getDate();
        
        const notifications = [];
        
        for (const obligation of obligations) {
            const daysUntilDue = obligation.dueDay - currentDay;
            if (daysUntilDue <= obligation.alertDays && daysUntilDue >= 0) {
                notifications.push({
                    title: obligation.name,
                    message: `Vence en ${daysUntilDue} días`,
                    type: daysUntilDue === 0 ? 'danger' : 'warning'
                });
            }
        }

        this.showModal('Notificaciones', `
            <div class="notifications-list">
                ${notifications.length === 0 
                    ? '<p class="empty-state-text">No hay notificaciones pendientes</p>'
                    : notifications.map(n => `
                        <div class="alert-item ${n.type}">
                            <div>
                                <strong>${n.title}</strong>
                                <p>${n.message}</p>
                            </div>
                        </div>
                    `).join('')
                }
            </div>
        `);
    },

    showModal(title, content, buttons = []) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                ${buttons.length > 0 ? `
                    <div class="modal-footer">
                        ${buttons.map(btn => `
                            <button class="btn ${btn.class}" onclick="${btn.onclick}">
                                ${btn.text}
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
        
        document.getElementById('modalContainer').appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    },

    formatCurrency(amount) {
        return new Intl.NumberFormat('es-CR', {
            style: 'currency',
            currency: 'CRC',
            minimumFractionDigits: 2
        }).format(amount);
    },

    formatDate(date) {
        try {
            return new Intl.DateFormat('es-CR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }).format(new Date(date));
        } catch (e) {
            // Fallback simple para navegadores sin Intl
            const d = new Date(date);
            const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
            return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
        }
    },

    async loadReports() {
        const period = document.getElementById('reportPeriod')?.value || 'month';
        const { startDate, endDate } = this.getPeriodDates(period);
        
        const income = await DB.getByDateRange('income', startDate, endDate);
        const expenses = await DB.getByDateRange('expenses', startDate, endDate);
        
        const totalIncome = income.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        const totalExpenses = expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        const balance = totalIncome - totalExpenses;
        
        const summaryElement = document.getElementById('reportSummary');
        if (summaryElement) {
            summaryElement.innerHTML = `
                <div class="summary-card">
                    <h4>Ingresos Totales</h4>
                    <p class="card-value" style="color: var(--success)">${this.formatCurrency(totalIncome)}</p>
                </div>
                <div class="summary-card">
                    <h4>Gastos Totales</h4>
                    <p class="card-value" style="color: var(--danger)">${this.formatCurrency(totalExpenses)}</p>
                </div>
                <div class="summary-card">
                    <h4>Balance</h4>
                    <p class="card-value" style="color: ${balance >= 0 ? 'var(--success)' : 'var(--danger)'}">
                        ${this.formatCurrency(balance)}
                    </p>
                </div>
                <div class="summary-card">
                    <h4>Tasa de Ahorro</h4>
                    <p class="card-value">${totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0}%</p>
                </div>
            `;
        }

        this.renderTrendsChart(income, expenses);
        this.renderCategoriesChart(expenses);
    },

    getPeriodDates(period) {
        const today = new Date();
        let startDate, endDate = new Date();
        
        switch(period) {
            case 'month':
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
            case 'quarter':
                const quarter = Math.floor(today.getMonth() / 3);
                startDate = new Date(today.getFullYear(), quarter * 3, 1);
                break;
            case 'semester':
                const semester = today.getMonth() < 6 ? 0 : 6;
                startDate = new Date(today.getFullYear(), semester, 1);
                break;
            case 'year':
                startDate = new Date(today.getFullYear(), 0, 1);
                break;
        }
        
        return { startDate, endDate };
    },

    renderTrendsChart(income, expenses) {
        const canvas = document.getElementById('trendsChart');
        if (!canvas || typeof Chart === 'undefined' || !Chart) {
            console.warn('Chart.js no disponible');
            if (canvas) {
                canvas.parentElement.innerHTML = '<p style="text-align:center; color: #718096;">Gráfico no disponible</p>';
            }
            return;
        }

        if (this.charts.trends) {
            this.charts.trends.destroy();
        }

        const ctx = canvas.getContext('2d');
        this.charts.trends = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.getMonthLabels(),
                datasets: [
                    {
                        label: 'Ingresos',
                        data: this.groupByMonth(income),
                        borderColor: '#00D976',
                        backgroundColor: 'rgba(0, 217, 118, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Gastos',
                        data: this.groupByMonth(expenses),
                        borderColor: '#F56565',
                        backgroundColor: 'rgba(245, 101, 101, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    },

    renderCategoriesChart(expenses) {
        const canvas = document.getElementById('categoriesChart');
        if (!canvas || typeof Chart === 'undefined' || !Chart) {
            console.warn('Chart.js no disponible');
            if (canvas) {
                canvas.parentElement.innerHTML = '<p style="text-align:center; color: #718096;">Gráfico no disponible</p>';
            }
            return;
        }

        if (this.charts.categories) {
            this.charts.categories.destroy();
        }

        const categories = {};
        expenses.forEach(expense => {
            categories[expense.category] = (categories[expense.category] || 0) + parseFloat(expense.amount);
        });

        const ctx = canvas.getContext('2d');
        this.charts.categories = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(categories),
                datasets: [{
                    data: Object.values(categories),
                    backgroundColor: [
                        '#00D976',
                        '#4299E1',
                        '#FFD93D',
                        '#F56565',
                        '#9F7AEA',
                        '#38B2AC'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    },

    getMonthLabels() {
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const today = new Date();
        const labels = [];
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            labels.push(months[date.getMonth()]);
        }
        
        return labels;
    },

    groupByMonth(items) {
        const months = new Array(6).fill(0);
        const today = new Date();
        
        items.forEach(item => {
            const itemDate = new Date(item.date);
            const monthDiff = (today.getFullYear() - itemDate.getFullYear()) * 12 + 
                             (today.getMonth() - itemDate.getMonth());
            
            if (monthDiff >= 0 && monthDiff < 6) {
                months[5 - monthDiff] += parseFloat(item.amount);
            }
        });
        
        return months;
    },

    async resetApp() {
        if (!confirm('⚠️ ADVERTENCIA CRÍTICA ⚠️\n\n¿Estás absolutamente seguro de que deseas ELIMINAR TODOS LOS DATOS?\n\nSe borrará:\n✗ Todos los ingresos\n✗ Todos los gastos\n✗ Todas las obligaciones\n✗ Todas las listas de compras\n✗ Todo el historial\n✗ Configuración de usuario\n\nEsta acción es PERMANENTE y NO SE PUEDE DESHACER.')) {
            return;
        }

        const confirmText = prompt('Para confirmar, escribe exactamente:\nBORRAR TODO\n\n(distingue mayúsculas)');
        if (confirmText !== 'BORRAR TODO') {
            alert('❌ Cancelado. El texto no coincide.');
            return;
        }

        const randomNum = Math.floor(Math.random() * 9000) + 1000;
        const numConfirm = prompt(`Última verificación.\nEscribe este número: ${randomNum}`);
        if (numConfirm !== randomNum.toString()) {
            alert('❌ Cancelado.');
            return;
        }

        try {
            const progress = document.createElement('div');
            progress.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
                            background: rgba(0,0,0,0.9); z-index: 999999; 
                            display: flex; align-items: center; justify-content: center; 
                            color: white; font-size: 1.5rem; flex-direction: column;">
                    <div>🗑️ Eliminando datos...</div>
                    <div style="margin-top: 1rem; font-size: 1rem; opacity: 0.7;">No cierres esta ventana</div>
                </div>
            `;
            document.body.appendChild(progress);

            await new Promise((resolve, reject) => {
                const req = indexedDB.deleteDatabase('MiEconomiaDB');
                req.onsuccess = () => resolve();
                req.onerror = () => reject(req.error);
            });

            localStorage.clear();
            sessionStorage.clear();

            if ('serviceWorker' in navigator) {
                const regs = await navigator.serviceWorker.getRegistrations();
                for (const reg of regs) await reg.unregister();
            }

            if ('caches' in window) {
                const names = await caches.keys();
                await Promise.all(names.map(n => caches.delete(n)));
            }

            progress.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
                            background: linear-gradient(135deg, #00D976, #00B863); 
                            z-index: 999999; display: flex; align-items: center; 
                            justify-content: center; color: white; font-size: 2rem; 
                            flex-direction: column;">
                    <div>✅ App reseteada completamente</div>
                    <div style="margin-top: 1rem; font-size: 1rem;">Recargando...</div>
                </div>
            `;

            setTimeout(() => location.reload(true), 2000);
        } catch (error) {
            alert('❌ Error: ' + error.message);
        }
    },

    showUserSettings() {
        const modal = document.getElementById('userSettingsModal');
        if (modal) {
            document.getElementById('settingsUserName').value = localStorage.getItem('userName') || '';
            document.getElementById('settingsUserEmail').value = localStorage.getItem('userEmail') || '';
            modal.style.display = 'flex';
        }
    },

    closeUserSettings() {
        document.getElementById('userSettingsModal').style.display = 'none';
    },

    saveUserSettings() {
        const name = document.getElementById('settingsUserName').value.trim();
        const email = document.getElementById('settingsUserEmail').value.trim();

        if (!name) {
            alert('❌ El nombre es obligatorio');
            return;
        }

        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);

        const display = document.getElementById('userNameDisplay');
        if (display) display.textContent = name;

        this.closeUserSettings();
        alert('✅ Configuración guardada');
    },

    loadUserInfo() {
        const name = localStorage.getItem('userName');
        if (name) {
            const display = document.getElementById('userNameDisplay');
            if (display) display.textContent = name;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

document.getElementById('btnGenerateReport')?.addEventListener('click', () => {
    App.loadReports();
});

document.getElementById('reportPeriod')?.addEventListener('change', () => {
    App.loadReports();
});
