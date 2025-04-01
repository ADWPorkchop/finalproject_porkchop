document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.querySelector('.cart-items');
    const clearCartBtn = document.querySelector('.clear-cart-btn');
    const totalElement = document.querySelector('.total h1');
    const proceedButton = document.querySelector('.sep2 button');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCartDisplay() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        if (cart.length === 0) {
            document.querySelector('.empty-cart').style.display = 'block';
        } else {
            document.querySelector('.empty-cart').style.display = 'none';
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                cartItemsContainer.innerHTML += `
                    <div class="cart-item">
                        <div class="item-image"><img src="${item.image}" alt="${item.name}"></div>
                        <div class="item-details">
                            <h3>${item.name}</h3>
                            <p class="item-price">₱${item.price.toFixed(2)}</p>
                        </div>
                        <div class="item-quantity">
                            <div class="quantity-btn decrease">-</div>
                            <div class="quantity-value">${item.quantity}</div>
                            <div class="quantity-btn increase">+</div>
                        </div>
                        <div class="item-total">₱${itemTotal.toFixed(2)}</div>
                        <button class="remove-item">×</button>
                    </div>`;
            });
        }
        totalElement.textContent = `Total: ₱${total.toFixed(2)}`;
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item')) {
            const index = [...cartItemsContainer.children].indexOf(e.target.closest('.cart-item'));
            cart.splice(index, 1);
            updateCartDisplay();
        }

        if (e.target.classList.contains('increase')) {
            const index = [...cartItemsContainer.children].indexOf(e.target.closest('.cart-item'));
            cart[index].quantity += 1;
            updateCartDisplay();
        }

        if (e.target.classList.contains('decrease')) {
            const index = [...cartItemsContainer.children].indexOf(e.target.closest('.cart-item'));
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
                updateCartDisplay();
            }
        }
    });

    clearCartBtn.addEventListener('click', () => {
        cart = [];
        updateCartDisplay();
    });

    proceedButton.addEventListener('click', () => {
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.href = 'paymentpage.html';
    });

    updateCartDisplay();
});
