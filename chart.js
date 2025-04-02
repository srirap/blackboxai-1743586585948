// Chart initialization and update functions
let categoryChart;

function initializeCharts() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;

    const spendingData = budgetTracker.getCategorySpending();
    const categories = Object.keys(spendingData);
    const amounts = categories.map(cat => spendingData[cat]);

    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                data: amounts,
                backgroundColor: [
                    '#3B82F6', // blue
                    '#10B981', // green
                    '#F59E0B', // yellow
                    '#8B5CF6', // purple
                    '#EC4899', // pink
                    '#6366F1'  // indigo
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                        }
                    }
                }
            },
            onClick: (evt, elements) => {
                if (elements.length > 0) {
                    const categoryIndex = elements[0].index;
                    const category = categoryChart.data.labels[categoryIndex];
                    showCategoryTransactions(category);
                }
            }
        }
    });
}

function showCategoryTransactions(category) {
    const transactions = budgetTracker.expenses
        .filter(exp => exp.category === category.toLowerCase())
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div class="p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-semibold">${category} Transactions</h3>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="overflow-y-auto max-h-[60vh]">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${transactions.map(t => `
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap">${t.date}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">${t.description || 'No description'}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">${formatCurrency(t.amount)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function updateCharts() {
    if (!categoryChart) return;

    const spendingData = budgetTracker.getCategorySpending();
    const categories = Object.keys(spendingData);
    const amounts = categories.map(cat => spendingData[cat]);

    categoryChart.data.labels = categories;
    categoryChart.data.datasets[0].data = amounts;
    categoryChart.update();
}

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCharts);