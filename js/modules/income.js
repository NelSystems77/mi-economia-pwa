const Income = {
    async init() {
        this.setupEventListeners();
        await this.loadData();
    },

    setupEventListeners() {
        const form = document.getElementById('incomeForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleSubmit(e);
            });
        }

        const dateInput = document.getElementById('incomeDate');
        if (dateInput && !dateInput.value) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }
    },

    async handleSubmit(e) {
        const form = e.target;
        const formData = new FormData(form);

        const income = {
            description: document.getElementById('incomeDescription').value,
            amount: parseFloat(document.getElementById('incomeAmount').value),
            category: document.getElementById('incomeCategory').value,
            date: document.getElementById('incomeDate').value,
            recurring: document.getElementById('incomeRecurring').checked
        };

        try {
            await DB.add('income', income);
            form.reset();
            document.getElementById('incomeDate').value = new Date().toISOString().split('T')[0];
            await this.loadData();
            await Dashboard.refresh();
            this.showSuccess('Ingreso registrado exitosamente');
        } catch (error) {
            this.showError('Error al guardar el ingreso');
        }
    },

    async loadData() {
        const incomes = await DB.getAll('income');
        incomes.sort((a, b) => new Date(b.date) - new Date(a.date));

        const tbody = document.getElementById('incomeTableBody');
        if (!tbody) return;

        if (incomes.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state-text">No hay ingresos registrados</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = incomes.map(income => `
            <tr>
                <td>${App.formatDate(income.date)}</td>
                <td>
                    ${income.description}
                    ${income.recurring ? '<span style="color: var(--primary)">🔄</span>' : ''}
                </td>
                <td>${this.getCategoryLabel(income.category)}</td>
                <td><strong style="color: var(--success)">${App.formatCurrency(income.amount)}</strong></td>
                <td class="table-actions">
                    <button class="btn btn-sm btn-danger" onclick="Income.delete(${income.id})">
                        🗑️
                    </button>
                </td>
            </tr>
        `).join('');
    },

    async delete(id) {
        if (!confirm('¿Estás seguro de eliminar este ingreso?')) return;

        try {
            await DB.delete('income', id);
            await this.loadData();
            await Dashboard.refresh();
            this.showSuccess('Ingreso eliminado');
        } catch (error) {
            this.showError('Error al eliminar el ingreso');
        }
    },

    getCategoryLabel(category) {
        const labels = {
            salary: 'Salario',
            bonus: 'Bono',
            freelance: 'Freelance',
            investment: 'Inversión',
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
