document.addEventListener("DOMContentLoaded", function () {
    const cart = JSON.parse(localStorage.getItem('paymentCart')) || [];
    const orderItemsContainer = document.querySelector('.order-items');
    const orderTotalElement = document.querySelector('.order-total span:last-child');
    const payButton = document.querySelector('.pay-button');

    let subtotal = 0;

    // Clear previous items
    orderItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        orderItemsContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Go to the <a href="storepage.html">Store</a> to add some items!</p>
            </div>
        `;
        payButton.disabled = true;
    } else {
        cart.forEach(item => {
            const price = parseFloat(item.price.replace('₱', '').replace(',', ''));
            const itemTotal = price * item.quantity;
            subtotal += itemTotal;

            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            itemElement.innerHTML = `
                <span>${item.quantity} × ${item.title}</span>
                <span>₱${itemTotal.toFixed(2)}</span>
            `;
            orderItemsContainer.appendChild(itemElement);
        });

        orderTotalElement.textContent = `₱${subtotal.toFixed(2)}`;
        payButton.innerHTML = `<i class="fas fa-lock"></i> PAY ₱${subtotal.toFixed(2)}`;
        payButton.disabled = false;

        payButton.addEventListener('click', function () {
            const cardNumber = document.getElementById('cardNumber').value;
            const cardName = document.getElementById('cardName').value;
            const expiryDate = document.getElementById('expiryDate').value;
            const cvv = document.getElementById('cvv').value;

            if (!cardNumber || !cardName || !expiryDate || !cvv) {
                alert('Please fill in all payment details');
                return;
            }

            setTimeout(() => {
                const transaction = {
                    date: new Date().toISOString(),
                    items: cart.map(item => ({
                        title: item.title,
                        quantity: item.quantity,
                        price: item.price
                    })),
                    total: subtotal,
                    status: 'Completed'
                };

                const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
                transactions.push(transaction);
                localStorage.setItem('transactions', JSON.stringify(transactions));

                localStorage.removeItem('paymentCart');
                localStorage.removeItem('pokemonCart');

                window.location.href = 'transaction.html';
            }, 1000);
        });
    }
});