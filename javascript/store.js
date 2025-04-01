document.addEventListener("DOMContentLoaded", function () {
    // Initialize cart in local storage if it doesn't exist
    if (!localStorage.getItem('pokemonCart')) {
        localStorage.setItem('pokemonCart', JSON.stringify([]));
    }

    const cards = document.querySelectorAll(".card");

    // Modal event handling
    cards.forEach(card => {
        card.addEventListener("click", function () {
            const cardImg = card.querySelector(".card-img-top").src;
            const cardTitle = card.querySelector(".card-title").textContent;
            const cardButton = card.querySelector(".btn");
            const cardPrice = cardButton ? cardButton.value : "₱0.00";

            // Update modal content
            document.getElementById("modalCardImg").src = cardImg;
            document.getElementById("modalCardTitle").textContent = cardTitle;

            // Ensure modal button container exists
            const modalButtonContainer = document.getElementById("modalCardButtonContainer");
            modalButtonContainer.innerHTML = ""; // Clear previous button

            if (cardButton) {
                const newButton = document.createElement('button');
                newButton.id = "modalBuyButton";
                newButton.className = "btn btn-primary";
                newButton.textContent = "Add to Cart";
                
                // Add to cart functionality
                newButton.addEventListener('click', function() {
                    addToCart({
                        id: generateProductId(cardTitle),
                        title: cardTitle,
                        image: cardImg,
                        price: cardPrice,
                        quantity: 1
                    });
                    
                    // Close modal
                    const modalInstance = bootstrap.Modal.getInstance(document.getElementById("cardModal"));
                    modalInstance.hide();
                    
                    // Show confirmation message
                    showAddedToCartNotification(cardTitle);
                });
                
                modalButtonContainer.appendChild(newButton);
                
            }

            // Show modal
            const modal = new bootstrap.Modal(document.getElementById("cardModal"));
            modal.show();
        });
    });

    // Direct add to cart from buttons
    const buyButtons = document.querySelectorAll(".card .btn-primary");
    buyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click (which would open modal)
            
            const card = this.closest('.card');
            const cardImg = card.querySelector(".card-img-top").src;
            const cardTitle = card.querySelector(".card-title").textContent;
            const cardPrice = this.value;
            
            addToCart({
                id: generateProductId(cardTitle),
                title: cardTitle,
                image: cardImg,
                price: cardPrice,
                quantity: 1
            });
            
            showAddedToCartNotification(cardTitle);
        });
    });
});

// Helper functions
function generateProductId(title) {
    return title.toLowerCase().replace(/\s+/g, '-');
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('pokemonCart'));
    
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex > -1) {
        // Increment quantity if product already in cart
        cart[existingProductIndex].quantity += 1;
    } else {
        // Add new product to cart
        cart.push(product);
    }
    
    // Save updated cart
    localStorage.setItem('pokemonCart', JSON.stringify(cart));
    
    // Update cart indicator if you have one
    updateCartIndicator();
}

function updateCartIndicator() {
    // If you have a cart indicator element, update it here
    // For example, showing the number of items in cart
    const cart = JSON.parse(localStorage.getItem('pokemonCart'));
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Add this element to your HTML if you want a visual cart counter
    const cartCounter = document.querySelector('.cart-counter');
    if (cartCounter) {
        cartCounter.textContent = totalItems;
        cartCounter.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

function showAddedToCartNotification(productName) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'add-to-cart-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span>${productName} added to cart</span>
            <a href="cart.html">View Cart</a>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add some CSS dynamically for the notification
    const style = document.createElement('style');
    style.innerHTML = `
        .add-to-cart-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #52E3C2;
            color: black;
            padding: 15px;
            border-radius: 5px;
            z-index: 1100;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            animation: slide-in 0.5s ease, fade-out 0.5s ease 2.5s forwards;
        }
        
        .notification-content {
            display: flex;
            flex-direction: column;
        }
        
        .notification-content a {
            margin-top: 5px;
            color: #3a7ca5;
            text-decoration: underline;
        }
        
        @keyframes slide-in {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fade-out {
            from { opacity: 1; }
            to { opacity: 0; visibility: hidden; }
        }
    `;
    document.head.appendChild(style);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}