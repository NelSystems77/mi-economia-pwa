const Obligations = {
    async init() {
        this.setupEventListeners();
        await this.loadData();
    },

    setupEventListeners() {
        const form = document.getElementById('obligationForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleSubmit(e);
            });
        }
    },

    async handleSubmit(e) {
        const form = e.target;

        const dueDay = parseInt(document.getElementById('obligationDueDay').value);
        
        if (dueDay < 1 || dueDay > 31) {
            this.showError('El día de vencimiento debe estar entre 1 y 31');
            return;
        }

        const obligation = {
            name: document.getElementById('obligationName').value,
            amount: parseFloat(document.getElementById('obligationAmount').value),
            category: document.getElementById('obligationCategory').value,
            dueDay: dueDay,
            alertDays: parseInt(document.getElementById('obligationAlertDays').value),
            active: true
        };

        try {
            await DB.add('obligations', obligation);
            form.reset();
            await this.loadData();
            await Dashboard.refresh();
            this.showSuccess('Obligación registrada exitosamente');
        } catch (error) {
            console.error('Error saving obligation:', error);
            this.showError('Error al guardar la obligación');
        }
    },

    async loadData() {
        const obligations = await DB.getAll('obligations');
        await this.renderObligations(obligations.filter(o => o.active));
        await this.loadPaymentHistory();
    },

    async renderObligations(obligations) {
        const container = document.getElementById('obligationsList');
        if (!container) return;

        if (obligations.length === 0) {
            container.innerHTML = '<div class="empty-state-text">No hay obligaciones registradas</div>';
            return;
        }

        const today = new Date();
        const currentDay = today.getDate();

        container.innerHTML = obligations.map(obligation => {
            const daysUntilDue = obligation.dueDay - currentDay;
            let statusClass = '';
            let statusText = '';

            if (daysUntilDue < 0) {
                statusClass = 'overdue';
                statusText = `Venció hace ${Math.abs(daysUntilDue)} días`;
            } else if (daysUntilDue === 0) {
                statusClass = 'pending';
                statusText = 'Vence hoy';
            } else if (daysUntilDue <= obligation.alertDays) {
                statusClass = 'pending';
                statusText = `Vence en ${daysUntilDue} días`;
            } else {
                statusText = `Vence el día ${obligation.dueDay}`;
            }

            return `
                <div class="obligation-item ${statusClass}">
                    <div class="obligation-info">
                        <h4>${obligation.name}</h4>
                        <div class="obligation-details">
                            <span>💰 ${App.formatCurrency(obligation.amount)}</span>
                            <span>📅 ${statusText}</span>
                            <span>🏷️ ${this.getCategoryLabel(obligation.category)}</span>
                        </div>
                    </div>
                    <div class="obligation-actions">
                        <button class="btn btn-sm btn-primary" onclick="Obligations.markAsPaid(${obligation.id})">
                            ✅ Pagado
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="Obligations.delete(${obligation.id})">
                            🗑️
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    },

    async markAsPaid(obligationId) {
        const obligation = await DB.get('obligations', obligationId);
        if (!obligation) return;

        const payment = {
            obligationId: obligationId,
            obligationName: obligation.name,
            amount: obligation.amount,
            date: new Date().toISOString().split('T')[0],
            status: 'paid'
        };

        try {
            await DB.add('obligationPayments', payment);
            await this.loadData();
            await Dashboard.refresh();
            this.showSuccess(`Pago de ${obligation.name} registrado`);
        } catch (error) {
            this.showError('Error al registrar el pago');
        }
    },

    async delete(id) {
        if (!confirm('¿Estás seguro de eliminar esta obligación?')) return;

        try {
            await DB.delete('obligations', id);
            await this.loadData();
            await Dashboard.refresh();
            this.showSuccess('Obligación eliminada');
        } catch (error) {
            this.showError('Error al eliminar la obligación');
        }
    },

    async loadPaymentHistory() {
        const payments = await DB.getAll('obligationPayments');
        payments.sort((a, b) => new Date(b.date) - new Date(a.date));

        const tbody = document.getElementById('obligationPaymentsBody');
        if (!tbody) return;

        if (payments.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="empty-state-text">No hay pagos registrados</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = payments.slice(0, 20).map(payment => `
            <tr>
                <td>${App.formatDate(payment.date)}</td>
                <td>${payment.obligationName}</td>
                <td>${App.formatCurrency(payment.amount)}</td>
                <td>
                    <span style="color: var(--success); font-weight: 600;">
                        ✅ ${payment.status === 'paid' ? 'Pagado' : 'Pendiente'}
                    </span>
                </td>
            </tr>
        `).join('');
    },

    getCategoryLabel(category) {
        const labels = {
            electricity: 'Electricidad',
            water: 'Agua',
            internet: 'Internet/Cable',
            phone: 'Teléfono',
            insurance: 'Seguro',
            subscription: 'Suscripción',
            rent: 'Alquiler/Hipoteca',
            condo: 'Condominio',
            other: 'Otro'
        };
        return labels[category] || category;
    },

    showSuccess(message) {
        this.showToast(message, 'success');
    },

    showError(message) {
        this.showToast(message, 'danger');
    },

    showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `alert-item ${type}`;
        toast.style.cssText = 'position: fixed; top: 80px; right: 20px; z-index: 1000; min-width: 250px;';
        toast.innerHTML = `<strong>${message}</strong>`;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
};
