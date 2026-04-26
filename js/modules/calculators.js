const Calculators = {
    async init() {
        this.setupEventListeners();
    },

    setupEventListeners() {
        document.getElementById('loanCalculator')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.calculateLoan();
        });

        document.getElementById('savingsCalculator')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.calculateSavings();
        });

        document.getElementById('investmentCalculator')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.calculateInvestment();
        });

        document.getElementById('debtCalculator')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.calculateDebtPayoff();
        });
    },

    calculateLoan() {
        const amount = parseFloat(document.getElementById('loanAmount').value);
        const rate = parseFloat(document.getElementById('loanRate').value) / 100 / 12;
        const term = parseInt(document.getElementById('loanTerm').value);

        const monthlyPayment = (amount * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
        const totalPayment = monthlyPayment * term;
        const totalInterest = totalPayment - amount;

        const resultDiv = document.getElementById('loanResult');
        resultDiv.innerHTML = `
            <div class="result-item">
                <span class="result-label">Pago mensual:</span>
                <span class="result-value">${App.formatCurrency(monthlyPayment)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Total a pagar:</span>
                <span class="result-value">${App.formatCurrency(totalPayment)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Intereses totales:</span>
                <span class="result-value" style="color: var(--danger)">${App.formatCurrency(totalInterest)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Plazo:</span>
                <span class="result-value">${term} meses (${(term / 12).toFixed(1)} años)</span>
            </div>
        `;
    },

    calculateSavings() {
        const monthly = parseFloat(document.getElementById('savingsMonthly').value);
        const rate = parseFloat(document.getElementById('savingsRate').value) / 100 / 12;
        const term = parseInt(document.getElementById('savingsTerm').value);

        const futureValue = monthly * ((Math.pow(1 + rate, term) - 1) / rate);
        const totalDeposits = monthly * term;
        const totalInterest = futureValue - totalDeposits;

        const resultDiv = document.getElementById('savingsResult');
        resultDiv.innerHTML = `
            <div class="result-item">
                <span class="result-label">Valor futuro:</span>
                <span class="result-value" style="color: var(--success)">${App.formatCurrency(futureValue)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Total depositado:</span>
                <span class="result-value">${App.formatCurrency(totalDeposits)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Intereses ganados:</span>
                <span class="result-value" style="color: var(--success)">${App.formatCurrency(totalInterest)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Rendimiento:</span>
                <span class="result-value">${((totalInterest / totalDeposits) * 100).toFixed(2)}%</span>
            </div>
        `;
    },

    calculateInvestment() {
        const initial = parseFloat(document.getElementById('investmentInitial').value);
        const monthly = parseFloat(document.getElementById('investmentMonthly').value);
        const annualRate = parseFloat(document.getElementById('investmentRate').value) / 100;
        const years = parseInt(document.getElementById('investmentYears').value);

        const months = years * 12;
        const monthlyRate = annualRate / 12;

        const initialGrowth = initial * Math.pow(1 + annualRate, years);
        
        const monthlyGrowth = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
        
        const futureValue = initialGrowth + monthlyGrowth;
        const totalDeposits = initial + (monthly * months);
        const totalGains = futureValue - totalDeposits;

        const resultDiv = document.getElementById('investmentResult');
        resultDiv.innerHTML = `
            <div class="result-item">
                <span class="result-label">Valor final:</span>
                <span class="result-value" style="color: var(--success)">${App.formatCurrency(futureValue)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Total invertido:</span>
                <span class="result-value">${App.formatCurrency(totalDeposits)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Ganancias:</span>
                <span class="result-value" style="color: var(--success)">${App.formatCurrency(totalGains)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">ROI:</span>
                <span class="result-value">${((totalGains / totalDeposits) * 100).toFixed(2)}%</span>
            </div>
            <div class="result-item">
                <span class="result-label">Plazo:</span>
                <span class="result-value">${years} años (${months} meses)</span>
            </div>
        `;
    },

    calculateDebtPayoff() {
        const debt = parseFloat(document.getElementById('debtTotal').value);
        const rate = parseFloat(document.getElementById('debtRate').value) / 100 / 12;
        const payment = parseFloat(document.getElementById('debtPayment').value);

        if (payment <= (debt * rate)) {
            const resultDiv = document.getElementById('debtResult');
            resultDiv.innerHTML = `
                <div class="alert-item danger">
                    <strong>⚠️ El pago mensual es muy bajo</strong>
                    <p>Con este pago, nunca podrás salir de la deuda. 
                    El pago mínimo debe ser mayor a ${App.formatCurrency(debt * rate)} (solo intereses).</p>
                </div>
            `;
            return;
        }

        const months = Math.log(payment / (payment - debt * rate)) / Math.log(1 + rate);
        const totalPaid = payment * months;
        const totalInterest = totalPaid - debt;

        const resultDiv = document.getElementById('debtResult');
        resultDiv.innerHTML = `
            <div class="result-item">
                <span class="result-label">Tiempo para salir de deuda:</span>
                <span class="result-value">${Math.ceil(months)} meses (${(months / 12).toFixed(1)} años)</span>
            </div>
            <div class="result-item">
                <span class="result-label">Total a pagar:</span>
                <span class="result-value">${App.formatCurrency(totalPaid)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Intereses totales:</span>
                <span class="result-value" style="color: var(--danger)">${App.formatCurrency(totalInterest)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Ahorro si aumentas el pago 20%:</span>
                <span class="result-value">
                    ${this.calculateSavingsFromExtraPayment(debt, rate, payment * 1.2, totalPaid)}
                </span>
            </div>
        `;
    },

    calculateSavingsFromExtraPayment(debt, rate, newPayment, currentTotal) {
        if (newPayment <= (debt * rate)) return 'N/A';
        
        const newMonths = Math.log(newPayment / (newPayment - debt * rate)) / Math.log(1 + rate);
        const newTotal = newPayment * newMonths;
        const savings = currentTotal - newTotal;
        const monthsSaved = (currentTotal / payment) - newMonths;
        
        return `${App.formatCurrency(savings)} en ${Math.ceil(monthsSaved)} meses menos`;
    }
};
