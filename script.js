document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculate-btn');
    const debtAmountInput = document.getElementById('debt-amount');
    const aprInput = document.getElementById('apr');
    const monthlyPaymentInput = document.getElementById('monthly-payment');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const themeText = themeToggle.querySelector('span');

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeIcon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
        themeText.textContent = isDark ? 'Dark Mode' : 'Light Mode';
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
    });

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    themeText.textContent = savedTheme === 'dark' ? 'Light Mode' : 'Dark Mode';

    calculateBtn.addEventListener('click', calculateDebt);

    function calculateDebt() {
        const debtAmount = parseFloat(debtAmountInput.value);
        const apr = parseFloat(aprInput.value);
        const monthlyPayment = parseFloat(monthlyPaymentInput.value);

        if (!debtAmount || !apr || !monthlyPayment) {
            alert('Please fill in all fields');
            return;
        }

        // Calculate current plan
        const currentPlan = calculateRepaymentPlan(debtAmount, apr, monthlyPayment);
        updateCurrentPlanResults(currentPlan);

        // Calculate different payment scenarios
        const increasedPayment = monthlyPayment * 1.2; // 20% increase
        const decreasedPayment = monthlyPayment * 0.8; // 20% decrease
        
        const increasedPlan = calculateRepaymentPlan(debtAmount, apr, increasedPayment);
        const decreasedPlan = calculateRepaymentPlan(debtAmount, apr, decreasedPayment);

        // Update strategy results with different scenarios
        updateStrategyResults({
            snowball: {
                current: currentPlan,
                increased: increasedPlan,
                decreased: decreasedPlan
            },
            avalanche: {
                current: calculateAvalancheMethod(debtAmount, apr, monthlyPayment),
                increased: calculateAvalancheMethod(debtAmount, apr, increasedPayment),
                decreased: calculateAvalancheMethod(debtAmount, apr, decreasedPayment)
            }
        });
    }

    function calculateRepaymentPlan(debtAmount, apr, monthlyPayment) {
        let remainingDebt = debtAmount;
        let totalInterest = 0;
        let months = 0;
        const monthlyRate = apr / 12 / 100;

        while (remainingDebt > 0 && months < 600) { // Cap at 50 years
            const interest = remainingDebt * monthlyRate;
            const principal = monthlyPayment - interest;
            
            if (principal <= 0) {
                alert('Your monthly payment is too low to cover the interest. Please increase your payment amount.');
                return null;
            }

            remainingDebt -= principal;
            totalInterest += interest;
            months++;
        }

        return {
            months,
            totalInterest,
            totalAmount: debtAmount + totalInterest,
            monthlyPayment
        };
    }

    function calculateAvalancheMethod(debtAmount, apr, monthlyPayment) {
        // For avalanche method, we'll assume the user has multiple debts
        // and will pay the minimum on all debts except the highest APR
        const minimumPayment = monthlyPayment * 0.1; // 10% of total payment as minimum
        const extraPayment = monthlyPayment - minimumPayment;
        
        let remainingDebt = debtAmount;
        let totalInterest = 0;
        let months = 0;
        const monthlyRate = apr / 12 / 100;

        while (remainingDebt > 0 && months < 600) {
            const interest = remainingDebt * monthlyRate;
            const principal = extraPayment + minimumPayment - interest;
            
            if (principal <= 0) {
                return null;
            }

            remainingDebt -= principal;
            totalInterest += interest;
            months++;
        }

        return {
            months,
            totalInterest,
            totalAmount: debtAmount + totalInterest,
            monthlyPayment
        };
    }

    function updateCurrentPlanResults(plan) {
        if (!plan) return;

        document.getElementById('months-to-payoff').textContent = plan.months;
        document.getElementById('total-interest').textContent = formatCurrency(plan.totalInterest);
        document.getElementById('total-amount').textContent = formatCurrency(plan.totalAmount);
    }

    function updateStrategyResults(plans) {
        if (!plans.snowball.current || !plans.avalanche.current) return;

        const snowballResults = document.querySelector('#snowball-results');
        const avalancheResults = document.querySelector('#avalanche-results');

        // Update Snowball Method results
        snowballResults.innerHTML = `
            <p>Current Payment (${formatCurrency(plans.snowball.current.monthlyPayment)}):</p>
            <p>Months to pay off: <span>${plans.snowball.current.months}</span></p>
            <p>Total interest: <span>${formatCurrency(plans.snowball.current.totalInterest)}</span></p>
            <p class="payment-comparison">
                <span class="increase">+20% Payment: ${plans.snowball.increased.months} months (${formatCurrency(plans.snowball.increased.totalInterest)} interest)</span><br>
                <span class="decrease">-20% Payment: ${plans.snowball.decreased.months} months (${formatCurrency(plans.snowball.decreased.totalInterest)} interest)</span>
            </p>
        `;

        // Update Avalanche Method results
        avalancheResults.innerHTML = `
            <p>Current Payment (${formatCurrency(plans.avalanche.current.monthlyPayment)}):</p>
            <p>Months to pay off: <span>${plans.avalanche.current.months}</span></p>
            <p>Total interest: <span>${formatCurrency(plans.avalanche.current.totalInterest)}</span></p>
            <p class="payment-comparison">
                <span class="increase">+20% Payment: ${plans.avalanche.increased.months} months (${formatCurrency(plans.avalanche.increased.totalInterest)} interest)</span><br>
                <span class="decrease">-20% Payment: ${plans.avalanche.decreased.months} months (${formatCurrency(plans.avalanche.decreased.totalInterest)} interest)</span>
            </p>
        `;
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
}); 