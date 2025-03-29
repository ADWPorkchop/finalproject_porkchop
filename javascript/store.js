document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        card.addEventListener("click", function () {
            const cardImg = card.querySelector(".card-img-top").src;
            const cardTitle = card.querySelector(".card-title").textContent;
            const cardButton = card.querySelector(".btn"); // Select using the class instead

            // Update modal content
            document.getElementById("modalCardImg").src = cardImg;
            document.getElementById("modalCardTitle").textContent = cardTitle;

            // Ensure modal button container exists
            const modalButtonContainer = document.getElementById("modalCardButtonContainer");
            modalButtonContainer.innerHTML = ""; // Clear previous button

            if (cardButton) {
                const newButton = cardButton.cloneNode(true); // Clone the button
                newButton.id = "modalBuyButton"; // Rename to avoid conflicts
                modalButtonContainer.appendChild(newButton); // Append the button inside modal
            } else {
                console.warn("No button found inside card:", card);
            }

            // Show modal
            const modal = new bootstrap.Modal(document.getElementById("cardModal"));
            modal.show();
        });
    });
});