document.addEventListener("DOMContentLoaded", function () {
    loadCartItems();

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

    const clearCartButton = document.querySelector('.clear-cart-btn');
    if (clearCartButton) {
        clearCartButton.addEventListener('click', function () {
            // Clear the cart
            localStorage.removeItem('pokemonCart');
            loadCartItems();
        });
    }
});

function loadCartItems() {
    const cartContainer = document.querySelector('.cart-items');
    const cart = JSON.parse(localStorage.getItem('pokemonCart')) || [];

    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Go to the <a href="storepage.html">Store</a> to add some items!</p>
            </div>
        `;
    } else {
        cart.forEach(item => {
            const cartItem = createCartItemElement(item);
            cartContainer.appendChild(cartItem);
        });
    }

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
        <div class="item-total">₱${totalPrice}</div>
        <button class="remove-item">×</button>
    `;

    cartItem.querySelector('.decrease').addEventListener('click', () => updateItemQuantity(item.id, -1));
    cartItem.querySelector('.increase').addEventListener('click', () => updateItemQuantity(item.id, 1));
    cartItem.querySelector('.remove-item').addEventListener('click', () => removeCartItem(item.id));

    return cartItem;
}

function updateItemQuantity(itemId, change) {
    let cart = JSON.parse(localStorage.getItem('pokemonCart')) || [];
    const itemIndex = cart.findIndex(item => item.id === itemId);

    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;

        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }

        localStorage.setItem('pokemonCart', JSON.stringify(cart));
        loadCartItems();
    }
}

function removeCartItem(itemId) {
    let cart = JSON.parse(localStorage.getItem('pokemonCart')) || [];
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('pokemonCart', JSON.stringify(cart));
    loadCartItems();
}

function updateCartTotal() {
    const cart = JSON.parse(localStorage.getItem('pokemonCart')) || [];
    const totalElement = document.querySelector('.sep1 h1');

    const total = cart.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('₱', '').replace(',', ''));
        return sum + (price * item.quantity);
    }, 0);

    totalElement.textContent = `Total: ₱${total.toFixed(2)}`;
}