document.addEventListener("DOMContentLoaded", function () {
    loadPaymentItems();
    setupFormValidation();

    // Setup pay button click handler
    const payButton = document.querySelector('.pay-button');
    if (payButton) {
        payButton.addEventListener('click', function () {
            // Validate fields regardless of payment method
            if (!validateFields()) {
                alert('Please fill all payment fields correctly');
                return;
            }

            const paymentCart = JSON.parse(localStorage.getItem('paymentCart')) || [];
            if (paymentCart.length === 0) {
                alert('Your cart is empty. Please add items before proceeding to payment.');
                return;
            }

            // Save transaction and redirect
            saveTransaction(paymentCart);
            localStorage.removeItem('paymentCart');
            localStorage.removeItem('pokemonCart');
            window.location.href = 'transaction.html';
        });
    }
});

function loadPaymentItems() {
    const orderItemsContainer = document.querySelector('.order-items');
    const paymentCart = JSON.parse(localStorage.getItem('paymentCart')) || [];
    const orderTotalElement = document.querySelector('.order-total span:last-child');

    // Clear the container
    if (!orderItemsContainer) return;
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
            itemElement.className = 'order-item';
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
        status: 'Completed',
        paymentMethod: document.querySelector('input[name="payment"]:checked').value
    };

    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function setupFormValidation() {
    // Card number formatting
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            // Remove non-digits and format
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            for (let i = 0; i < value.length && i < 16; i++) {
                if (i > 0 && i % 4 === 0) formattedValue += ' ';
                formattedValue += value[i];
            }
            e.target.value = formattedValue;
        });
    }
    
    // Expiry date formatting (MM/YY)
    const expiryDateInput = document.getElementById('expiryDate');
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    
    // CVV - numbers only
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
        });
    }
    
    // Keep track of which payment method is selected (for transaction record)
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            // Get the payment method name for display
            const methodName = this.parentElement.querySelector('span').textContent;
            document.querySelector('.pay-button').setAttribute('data-method', methodName);
        });
    });
}

function validateFields() {
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const cardName = document.getElementById('cardName').value.trim();
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    
    // Basic validation
    if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
        highlightField('cardNumber');
        return false;
    }
    
    if (cardName.length < 3) {
        highlightField('cardName');
        return false;
    }
    
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        highlightField('expiryDate');
        return false;
    }
    
    // Additional validation for expiry date
    if (expiryDate.includes('/')) {
        const [month, year] = expiryDate.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        
        // Check if month is valid (1-12)
        if (parseInt(month) < 1 || parseInt(month) > 12) {
            highlightField('expiryDate');
            return false;
        }
        
        // Check if date is in the future
        if (parseInt(year) < currentYear || 
            (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
            highlightField('expiryDate');
            return false;
        }
    }
    
    if (!/^\d{3}$/.test(cvv)) {
        highlightField('cvv');
        return false;
    }
    
    return true;
}

function highlightField(fieldId) {
    const field = document.getElementById(fieldId);
    field.style.borderColor = 'red';
    
    // Reset border after 2 seconds
    setTimeout(() => {
        field.style.borderColor = '';
    }, 2000);
}