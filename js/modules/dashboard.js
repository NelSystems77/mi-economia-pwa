const Dashboard = {
    charts: {},

    async init() {
        this.setupEventListeners();
        await this.refresh();
    },

    setupEventListeners() {
        const periodSelector = document.getElementById('dashboardPeriod');
        if (periodSelector) {
            periodSelector.addEventListener('change', () => this.refresh());
        }
    },

    async refresh() {
        await this.loadSummary();
        await this.loadCharts();
        await this.loadAlerts();
    },

    async loadSummary() {
        const period = document.getElementById('dashboardPeriod')?.value || 'current';
        const { startDate, endDate } = this.getPeriodDates(period);

        const income = await DB.getByDateRange('income', startDate, endDate);
        const expenses = await DB.getByDateRange('expenses', startDate, endDate);
        const obligationPayments = await DB.getByDateRange('obligationPayments', startDate, endDate);

        const totalIncome = income.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        const totalExpenses = expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        const totalObligations = obligationPayments.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        const totalAllExpenses = totalExpenses + totalObligations;
        const balance = totalIncome - totalAllExpenses;
        const savingsPercent = totalIncome > 0 ? ((balance / totalIncome) * 100) : 0;

        document.getElementById('totalIncome').textContent = App.formatCurrency(totalIncome);
        document.getElementById('totalExpenses').textContent = App.formatCurrency(totalAllExpenses);
        document.getElementById('totalBalance').textContent = App.formatCurrency(balance);
        document.getElementById('savingsPercent').textContent = `${savingsPercent.toFixed(1)}%`;
    },

    async loadCharts() {
        const period = document.getElementById('dashboardPeriod')?.value || 'current';
        const { startDate, endDate } = this.getPeriodDates(period);

        const expenses = await DB.getByDateRange('expenses', startDate, endDate);
        const income = await DB.getByDateRange('income', startDate, endDate);

        this.renderExpensesChart(expenses);
        this.renderCashFlowChart(income, expenses);
    },

    renderExpensesChart(expenses) {
        const canvas = document.getElementById('expensesChart');
        if (!canvas) return;

        if (this.charts.expenses) {
            this.charts.expenses.destroy();
        }

        const categories = {};
        expenses.forEach(expense => {
            const cat = this.getCategoryLabel(expense.category);
            categories[cat] = (categories[cat] || 0) + parseFloat(expense.amount);
        });

        const ctx = canvas.getContext('2d');
        this.charts.expenses = new Chart(ctx, {
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
                        '#38B2AC',
                        '#ED8936',
                        '#48BB78'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            padding: 10
                        }
                    }
                }
            }
        });
    },

    renderCashFlowChart(income, expenses) {
        const canvas = document.getElementById('cashFlowChart');
        if (!canvas) return;

        if (this.charts.cashFlow) {
            this.charts.cashFlow.destroy();
        }

        const months = this.getLast6Months();
        const incomeByMonth = this.groupByMonth(income, months);
        const expensesByMonth = this.groupByMonth(expenses, months);

        const ctx = canvas.getContext('2d');
        this.charts.cashFlow = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months.map(m => m.label),
                datasets: [
                    {
                        label: 'Ingresos',
                        data: incomeByMonth,
                        backgroundColor: 'rgba(0, 217, 118, 0.8)'
                    },
                    {
                        label: 'Gastos',
                        data: expensesByMonth,
                        backgroundColor: 'rgba(245, 101, 101, 0.8)'
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
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    },

    async loadAlerts() {
        const obligations = await DB.getAll('obligations');
        const today = new Date();
        const currentDay = today.getDate();

        const alerts = [];

        for (const obligation of obligations) {
            const daysUntilDue = obligation.dueDay - currentDay;
            
            if (daysUntilDue <= obligation.alertDays && daysUntilDue >= 0) {
                alerts.push({
                    message: `${obligation.name} vence en ${daysUntilDue} ${daysUntilDue === 1 ? 'día' : 'días'}`,
                    type: daysUntilDue === 0 ? 'danger' : 'warning',
                    amount: App.formatCurrency(obligation.amount)
                });
            } else if (daysUntilDue < 0) {
                alerts.push({
                    message: `${obligation.name} venció hace ${Math.abs(daysUntilDue)} ${Math.abs(daysUntilDue) === 1 ? 'día' : 'días'}`,
                    type: 'danger',
                    amount: App.formatCurrency(obligation.amount)
                });
            }
        }

        const alertsList = document.getElementById('alertsList');
        if (alertsList) {
            if (alerts.length === 0) {
                alertsList.innerHTML = '<div class="empty-state-text">No hay alertas pendientes 🎉</div>';
            } else {
                alertsList.innerHTML = alerts.map(alert => `
                    <div class="alert-item ${alert.type}">
                        <div>
                            <strong>${alert.message}</strong>
                            <p>${alert.amount}</p>
                        </div>
                    </div>
                `).join('');
            }
        }
    },

    getPeriodDates(period) {
        const today = new Date();
        let startDate, endDate = new Date();

        switch(period) {
            case 'current':
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
            case 'last':
                startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                endDate = new Date(today.getFullYear(), today.getMonth(), 0);
                break;
            case 'year':
                startDate = new Date(today.getFullYear(), 0, 1);
                break;
        }

        return { startDate, endDate };
    },

    getLast6Months() {
        const months = [];
        const today = new Date();
        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            months.push({
                label: monthNames[date.getMonth()],
                year: date.getFullYear(),
                month: date.getMonth()
            });
        }

        return months;
    },

    groupByMonth(items, months) {
        const result = new Array(6).fill(0);

        items.forEach(item => {
            const itemDate = new Date(item.date);
            const monthIndex = months.findIndex(m => 
                m.year === itemDate.getFullYear() && m.month === itemDate.getMonth()
            );

            if (monthIndex !== -1) {
                result[monthIndex] += parseFloat(item.amount);
            }
        });

        return result;
    },

    getCategoryLabel(category) {
        const labels = {
            fuel: 'Gasolina',
            vehicle: 'Vehículo',
            home: 'Hogar',
            groceries: 'Supermercado',
            health: 'Salud',
            entertainment: 'Entretenimiento',
            education: 'Educación',
            other: 'Otro'
        };
        return labels[category] || category;
    }
};
