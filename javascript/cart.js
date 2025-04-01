document.addEventListener("DOMContentLoaded", function () {
    loadCartItems();

    // Add event listener to the "Proceed to Payment" button
    const paymentButton = document.querySelector('.sep2 button');
    if (paymentButton) {
        paymentButton.addEventListener('click', function () {
            const cart = JSON.parse(localStorage.getItem('pokemonCart')) || [];
            if (cart.length === 0) {
                alert('Your cart is empty. Please add items before proceeding to payment.');
                return;
            }

            // Save cart data to localStorage for the payment page
            localStorage.setItem('paymentCart', JSON.stringify(cart));

            // Redirect to the payment page
            window.location.href = 'paymentpage.html';
        });
    }
});

function loadCartItems() {
    const cartContainer = document.querySelector('.cart-items');
    const cart = JSON.parse(localStorage.getItem('pokemonCart')) || [];

    // Clear existing content
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        // Show empty cart message
        const emptyCartMessage = document.querySelector('.empty-cart');
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
    } else {
        const emptyCartMessage = document.querySelector('.empty-cart');
        if (emptyCartMessage) emptyCartMessage.style.display = 'none';

        // Add each cart item to the list
        cart.forEach(item => {
            const cartItem = createCartItemElement(item);
            cartContainer.appendChild(cartItem);
        });
    }

    // Update total price
    updateCartTotal();
}

function createCartItemElement(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';

    const price = parseFloat(item.price.replace('₱', '').replace(',', ''));
    const totalPrice = (price * item.quantity).toFixed(2);

    cartItem.innerHTML = `
        <div class="item-image">
            <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="item-details">
            <h3>${item.title}</h3>
            <p class="item-price">${item.price}</p>
        </div>
        <div class="item-quantity">
            <button class="quantity-btn decrease">-</button>
            <span class="quantity-value">${item.quantity}</span>
            <button class="quantity-btn increase">+</button>
        </div>
        <div class="item-total">
            ₱${totalPrice}
        </div>
        <button class="remove-item">×</button>
    `;

    // Add event listeners for quantity buttons
    cartItem.querySelector('.decrease').addEventListener('click', () => updateItemQuantity(item.id, -1));
    cartItem.querySelector('.increase').addEventListener('click', () => updateItemQuantity(item.id, 1));
    cartItem.querySelector('.remove-item').addEventListener('click', () => removeCartItem(item.id));

    return cartItem;
}

function updateItemQuantity(itemId, change) {
    let cart = JSON.parse(localStorage.getItem('pokemonCart')) || [];
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        // Update quantity
        cart[itemIndex].quantity += change;
        
        // Remove item if quantity is 0 or less
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        // Save updated cart
        localStorage.setItem('pokemonCart', JSON.stringify(cart));
        
        // Reload cart items
        loadCartItems();
    }
}

function removeCartItem(itemId) {
    let cart = JSON.parse(localStorage.getItem('pokemonCart')) || [];
    const updatedCart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('pokemonCart', JSON.stringify(updatedCart));
    
    // Reload cart items
    loadCartItems();
}

function updateCartTotal() {
    const cart = JSON.parse(localStorage.getItem('pokemonCart')) || [];
    const totalElement = document.querySelector('.sep1 h1');

    if (totalElement) {
        const total = cart.reduce((sum, item) => {
            const price = parseFloat(item.price.replace('₱', '').replace(',', ''));
            return sum + (price * item.quantity);
        }, 0);

        totalElement.textContent = `Total: ₱${total.toFixed(2)}`;
    }
}