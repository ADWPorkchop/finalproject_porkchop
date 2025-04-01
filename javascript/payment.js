
document.addEventListener("DOMContentLoaded", () => {
    const paymentOptions = document.querySelectorAll('.payment-option');
    const payButton = document.querySelector('.pay-button');
    const cardNumberInput = document.getElementById('cardNumber');
    const cardNameInput = document.getElementById('cardName');
    const expiryDateInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');

    // Highlight selected payment option
    paymentOptions.forEach(option => {
        option.addEventListener('click', () => {
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            option.querySelector('input[type="radio"]').checked = true;
        });
    });

    // Payment form submission
    payButton.addEventListener('click', (e) => {
        e.preventDefault();
        const selectedPayment = document.querySelector('input[name="payment"]:checked');

        if (!selectedPayment) {
            alert('Please select a payment method.');
            return;
        }

        if (selectedPayment.value === 'visa') {
            if (!validateCardDetails()) {
                alert('Please enter valid card details.');
                return;
            }
        }

        alert('Payment successful!');
        window.location.href = 'transaction.html';
    });

    // Validate card details
    function validateCardDetails() {
        const cardNumber = cardNumberInput.value.trim();
        const cardName = cardNameInput.value.trim();
        const expiryDate = expiryDateInput.value.trim();
        const cvv = cvvInput.value.trim();

        const cardNumberPattern = /^\d{16}$/;
        const expiryPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
        const cvvPattern = /^\d{3}$/;

        if (!cardNumberPattern.test(cardNumber)) {
            alert('Invalid card number. Please enter 16 digits.');
            return false;
        }
        if (!cardName) {
            alert('Please enter the name on the card.');
            return false;
        }
        if (!expiryPattern.test(expiryDate)) {
            alert('Invalid expiry date. Use MM/YY format.');
            return false;
        }
        if (!cvvPattern.test(cvv)) {
            alert('Invalid CVV. Please enter 3 digits.');
            return false;
        }

        return true;
    }
});
