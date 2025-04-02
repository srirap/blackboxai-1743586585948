// Core application logic
class BudgetTracker {
    constructor() {
        this.expenses = [];
        this.budgets = {};
        this.loadData();
    }

    loadData() {
        const savedData = localStorage.getItem('budgetTrackerData');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.expenses = data.expenses || [];
            this.budgets = data.budgets || {};
        }
    }

    saveData() {
        const data = {
            expenses: this.expenses,
            budgets: this.budgets
        };
        localStorage.setItem('budgetTrackerData', JSON.stringify(data));
    }

    addExpense(expense) {
        this.expenses.push(expense);
        this.saveData();
    }

    setBudgets(budgets) {
        this.budgets = budgets;
        this.saveData();
    }

    getCategorySpending() {
        const spending = {};
        this.expenses.forEach(expense => {
            if (!spending[expense.category]) {
                spending[expense.category] = 0;
            }
            spending[expense.category] += expense.amount;
        });
        return spending;
    }

    getRemainingBudget() {
        const spending = this.getCategorySpending();
        let remaining = 0;
        
        for (const category in this.budgets) {
            const budget = this.budgets[category] || 0;
            const spent = spending[category] || 0;
            remaining += (budget - spent);
        }
        
        return remaining;
    }

    importTransactions(transactions) {
        transactions.forEach(transaction => {
            this.addExpense({
                date: transaction.date,
                amount: transaction.amount,
                category: transaction.category || 'other',
                description: transaction.description,
                imported: true
            });
        });
    }
}

// Initialize the app
const budgetTracker = new BudgetTracker();

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function categorizeTransaction(description) {
    const keywords = {
        food: ['starbucks', 'mcdonalds', 'grocery', 'restaurant', 'coffee'],
        transport: ['uber', 'lyft', 'gas', 'taxi', 'parking', 'public transport'],
        bills: ['electric', 'water', 'internet', 'phone', 'rent', 'mortgage'],
        entertainment: ['netflix', 'spotify', 'amazon prime', 'movie', 'concert'],
        shopping: ['amazon', 'target', 'walmart', 'clothes', 'electronics']
    };

    const desc = description.toLowerCase();
    for (const category in keywords) {
        if (keywords[category].some(word => desc.includes(word))) {
            return category;
        }
    }
    return 'other';
}