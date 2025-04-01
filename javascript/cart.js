document.addEventListener("DOMContentLoaded", function() {
    // Create cart container
    const cartContainer = document.createElement('div');
    cartContainer.className = 'cart-container';
    
    // Insert the cart container before the total div
    const totalDiv = document.querySelector('.total');
    document.body.insertBefore(cartContainer, totalDiv);
    
    // Load and display cart items
    loadCartItems();
    
    // Add event listener to the "Proceed to Payment" button
    const paymentButton = document.querySelector('.sep2 .btn-primary');
    if (paymentButton) {
        paymentButton.addEventListener('click', function(e) {
            const cart = JSON.parse(localStorage.getItem('pokemonCart')) || [];
            if (cart.length === 0) {
                e.preventDefault();
                alert('Your cart is empty. Please add items before proceeding to payment.');
            }
        });
    }
});

function loadCartItems() {
    const cartContainer = document.querySelector('.cart-container');
    const cart = JSON.parse(localStorage.getItem('pokemonCart')) || [];
    
    // Clear existing content
    cartContainer.innerHTML = '';
    
    if (cart.length === 0) {
        // Show empty cart message
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Go to the <a href="storepage.html">Store</a> to add some items!</p>
            </div>
        `;
    } else {
        // Create header for the cart items
        const cartHeader = document.createElement('div');
        cartHeader.className = 'cart-header';
        cartHeader.innerHTML = `
            <h2>Shopping Cart</h2>
            <button class="clear-cart-btn">Clear Cart</button>
        `;
        cartContainer.appendChild(cartHeader);
        
        // Add clear cart functionality
        const clearCartBtn = cartHeader.querySelector('.clear-cart-btn');
        clearCartBtn.addEventListener('click', clearCart);
        
        // Create list for cart items
        const cartList = document.createElement('div');
        cartList.className = 'cart-items';
        
        // Add each cart item to the list
        cart.forEach(item => {
            const cartItem = createCartItemElement(item);
            cartList.appendChild(cartItem);
        });
        
        cartContainer.appendChild(cartList);
    }
    
    // Update total price
    updateCartTotal();
}

function createCartItemElement(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.dataset.id = item.id;
    
    // Calculate item total price
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
    const decreaseBtn = cartItem.querySelector('.decrease');
    const increaseBtn = cartItem.querySelector('.increase');
    const removeBtn = cartItem.querySelector('.remove-item');
    
    decreaseBtn.addEventListener('click', () => updateItemQuantity(item.id, -1));
    increaseBtn.addEventListener('click', () => updateItemQuantity(item.id, 1));
    removeBtn.addEventListener('click', () => removeCartItem(item.id));
    
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

function clearCart() {
    localStorage.setItem('pokemonCart', JSON.stringify([]));
    loadCartItems();
}

function updateCartTotal() {
    const cart = JSON.parse(localStorage.getItem('pokemonCart')) || [];
    const totalElement = document.querySelector('.sep1 h1');
    
    if (totalElement) {
        // Calculate total cart price
        const total = cart.reduce((sum, item) => {
            const price = parseFloat(item.price.replace('₱', '').replace(',', ''));
            return sum + (price * item.quantity);
        }, 0);
        
        // Format the total with commas for thousands
        const formattedTotal = total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        
        // Update the total display
        totalElement.textContent = `Total: ₱${formattedTotal}`;
    }
}