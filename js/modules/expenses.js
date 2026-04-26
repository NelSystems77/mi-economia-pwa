const Expenses = {
    async init() {
        this.setupEventListeners();
        await this.loadData();
    },

    setupEventListeners() {
        const form = document.getElementById('expenseForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleSubmit(e);
            });
        }

        // Set today's date as default
        setTimeout(() => {
            const dateInput = document.getElementById('expenseDate');
            if (dateInput && !dateInput.value) {
                dateInput.value = new Date().toISOString().split('T')[0];
            }
        }, 100);
    },

    async handleSubmit(e) {
        const form = e.target;

        const expense = {
            description: document.getElementById('expenseDescription').value,
            amount: parseFloat(document.getElementById('expenseAmount').value),
            category: document.getElementById('expenseCategory').value,
            date: document.getElementById('expenseDate').value
        };

        try {
            await DB.add('expenses', expense);
            form.reset();
            document.getElementById('expenseDate').value = new Date().toISOString().split('T')[0];
            await this.loadData();
            await Dashboard.refresh();
            this.showSuccess('Gasto registrado exitosamente');
        } catch (error) {
            this.showError('Error al guardar el gasto');
        }
    },

    async loadData() {
        const expenses = await DB.getAll('expenses');
        expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

        const tbody = document.getElementById('expenseTableBody');
        if (!tbody) return;

        if (expenses.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state-text">No hay gastos registrados</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = expenses.map(expense => `
            <tr>
                <td>${App.formatDate(expense.date)}</td>
                <td>${expense.description}</td>
                <td>${this.getCategoryLabel(expense.category)}</td>
                <td><strong style="color: var(--danger)">${App.formatCurrency(expense.amount)}</strong></td>
                <td class="table-actions">
                    <button class="btn btn-sm btn-danger" onclick="Expenses.delete(${expense.id})">
                        🗑️
                    </button>
                </td>
            </tr>
        `).join('');
    },

    async delete(id) {
        if (!confirm('¿Estás seguro de eliminar este gasto?')) return;

        try {
            await DB.delete('expenses', id);
            await this.loadData();
            await Dashboard.refresh();
            this.showSuccess('Gasto eliminado');
        } catch (error) {
            this.showError('Error al eliminar el gasto');
        }
    },

    getCategoryLabel(category) {
        const labels = {
            fuel: '⛽ Gasolina',
            vehicle: '🚗 Mantenimiento Vehículo',
            home: '🏠 Mantenimiento Hogar',
            groceries: '🛒 Supermercado',
            health: '🏥 Salud',
            medicines: '💊 Medicamentos',
            entertainment: '🎮 Entretenimiento',
            education: '📚 Educación',
            other: '📦 Otro'
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
