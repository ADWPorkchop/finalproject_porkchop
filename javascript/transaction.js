document.addEventListener("DOMContentLoaded", function () {
    const transactionsList = document.getElementById('transactionsList');
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    // Hide the empty state if there are transactions
    toggleEmptyState(transactions);

    if (transactions.length === 0) {
        transactionsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-bag"></i>
                <p>No transactions yet</p>
                <a href="storepage.html" class="btn-view-all">SHOP NOW</a>
            </div>
        `;
        return;
    }

    transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
        const year = date.getFullYear();

        const itemsHTML = transaction.items.map(item => `
            <span>${item.quantity} × ${item.title}</span>
        `).join('');

        const transactionHTML = `
            <div class="transaction-item">
                <div class="transaction-date">
                    <span class="date-day">${day}</span>
                    <span class="date-month">${month}</span>
                    <span class="date-year">${year}</span>
                </div>
                <div class="transaction-details">
                    <h3>${transaction.items[0].title}</h3>
                    <p class="transaction-id">Order #PCHP-${year}-${month}-${day}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}</p>
                    <div class="transaction-items">
                        ${itemsHTML}
                    </div>
                </div>
                <div class="transaction-amount">
                    <span class="amount">₱${transaction.total.toFixed(2)}</span>
                    <span class="status ${transaction.status.toLowerCase()}">${transaction.status}</span>
                </div>
            </div>
        `;

        transactionsList.innerHTML += transactionHTML;
    });
});

/**
 * Toggles the visibility of the empty state based on transaction history.
 * @param {Array} transactions - The list of transactions.
 */
function toggleEmptyState(transactions) {
    const emptyStateElement = document.querySelector('.empty-state');
    if (emptyStateElement) {
        if (transactions.length > 0) {
            emptyStateElement.style.display = 'none';
        } else {
            emptyStateElement.style.display = 'block';
        }
    }
}
