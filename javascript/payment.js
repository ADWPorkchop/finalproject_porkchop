document.addEventListener("DOMContentLoaded", function () {
    loadPaymentItems();

    const payButton = document.querySelector('.pay-button');
    if (payButton) {
        payButton.addEventListener('click', function () {
            const paymentCart = JSON.parse(localStorage.getItem('paymentCart')) || [];
            if (paymentCart.length === 0) {
                alert('Your cart is empty. Please add items before proceeding to payment.');
                return;
            }

            // Save transaction to localStorage
            saveTransaction(paymentCart);

            // Clear the payment cart and redirect to transaction history
            localStorage.removeItem('paymentCart');
            localStorage.removeItem('pokemonCart'); // Clear the cart as well
            window.location.href = 'transaction.html';
        });
    }
});

function loadPaymentItems() {
    const orderItemsContainer = document.querySelector('.order-items');
    const paymentCart = JSON.parse(localStorage.getItem('paymentCart')) || [];
    const orderTotalElement = document.querySelector('.order-total span:last-child');

    // Check if the container exists
    if (!orderItemsContainer) {
        console.error('Error: .order-items container not found in the DOM.');
        return;
    }

    // Clear the container
    orderItemsContainer.innerHTML = '';

    if (paymentCart.length === 0) {
        // Show empty cart message
        orderItemsContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Go to the <a href="storepage.html">Store</a> to add some items!</p>
            </div>
        `;
        document.querySelector('.pay-button').disabled = true;
    } else {
        let subtotal = 0;

        // Add each item to the payment page
        paymentCart.forEach(item => {
            const price = parseFloat(item.price.replace('₱', '').replace(',', ''));
            const itemTotal = price * item.quantity;
            subtotal += itemTotal;

            const itemElement = document.createElement('div');
            itemElement.className = 'order-items';
            itemElement.innerHTML = `
                <span>${item.quantity} × ${item.title}</span>
                <span>₱${itemTotal.toFixed(2)}</span>
            `;
            orderItemsContainer.appendChild(itemElement);
        });

        // Update total
        orderTotalElement.textContent = `₱${subtotal.toFixed(2)}`;
        document.querySelector('.pay-button').innerHTML = `<i class="fas fa-lock"></i> PAY ₱${subtotal.toFixed(2)}`;
        document.querySelector('.pay-button').disabled = false;
    }
}

function saveTransaction(paymentCart) {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const subtotal = paymentCart.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('₱', '').replace(',', ''));
        return sum + (price * item.quantity);
    }, 0);

    const transaction = {
        date: new Date().toISOString(),
        items: paymentCart,
        total: subtotal,
        status: 'Completed'
    };

    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}
