document.addEventListener("DOMContentLoaded", function() {
    // Load cart items from localStorage
    const cart = JSON.parse(localStorage.getItem('pokemonCart')) || [];
    const paymentItemsContainer = document.getElementById('payment-items-container');
    const paymentTotal = document.getElementById('payment-total');
    const payButtonAmount = document.getElementById('pay-button-amount');
    const payNowBtn = document.getElementById('pay-now-btn');
    
    let subtotal = 0;
    
    // Clear previous items
    paymentItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        paymentItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        payNowBtn.disabled = true;
    } else {
        // Add each item to the payment page
        cart.forEach(item => {
            const price = parseFloat(item.price.replace('₱', '').replace(',', ''));
            const itemTotal = price * item.quantity;
            subtotal += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'payment-item';
            itemElement.innerHTML = `
                <div class="item-info">
                    <img src="${item.image}" alt="${item.title}" class="item-image">
                    <div class="item-details">
                        <h3>${item.title}</h3>
                        <p>Quantity: ${item.quantity}</p>
                        <p class="price-per-item">${item.price} each</p>
                    </div>
                </div>
                <div class="item-price">₱${itemTotal.toFixed(2)}</div>
            `;
            paymentItemsContainer.appendChild(itemElement);
        });
        
        // Calculate tax (12% of subtotal)
        const tax = subtotal * 0.12;
        const total = subtotal + tax;
        
        // Add tax and subtotal rows
        const summaryElement = document.createElement('div');
        summaryElement.className = 'payment-summary';
        summaryElement.innerHTML = `
            <div class="summary-row">
                <span>Subtotal</span>
                <span>₱${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Tax (12%)</span>
                <span>₱${tax.toFixed(2)}</span>
            </div>
            <div class="summary-row total-row">
                <span>Total</span>
                <span>₱${total.toFixed(2)}</span>
            </div>
        `;
        paymentItemsContainer.appendChild(summaryElement);
        
        // Update totals
        paymentTotal.textContent = `₱${total.toFixed(2)}`;
        payButtonAmount.textContent = `₱${total.toFixed(2)}`;
        
        // Enable pay button
        payNowBtn.disabled = false;
    }
    
    // Handle payment button click
    payNowBtn.addEventListener('click', function() {
        // Basic form validation
        const cardNumber = document.getElementById('cardNumber').value;
        const cardName = document.getElementById('cardName').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;
        
        if (!cardNumber || !cardName || !expiryDate || !cvv) {
            alert('Please fill in all payment details');
            return;
        }
        
        // Process payment (in a real app, this would be an API call)
        setTimeout(() => {
            // Show success message
            const successModal = new bootstrap.Modal(document.getElementById('paymentSuccessModal'));
            successModal.show();
            
            // Clear cart after successful payment
            localStorage.removeItem('pokemonCart');
            
            // Update cart indicator if it exists
            if (typeof updateCartIndicator === 'function') {
                updateCartIndicator();
            }
            
            // Redirect after 3 seconds
            setTimeout(() => {
                window.location.href = 'storepage.html';
            }, 3000);
        }, 1000);
    });
    
    // Format card number input
    document.getElementById('cardNumber').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/\D/g, '');
        if (value.length > 16) value = value.substr(0, 16);
        value = value.replace(/(\d{4})/g, '$1 ').trim();
        e.target.value = value;
    });
    
    // Format expiry date input
    document.getElementById('expiryDate').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.substr(0, 2) + '/' + value.substr(2, 2);
        }
        e.target.value = value;
    });
    
    // Format CVV input
    document.getElementById('cvv').addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '').substr(0, 3);
    });
});