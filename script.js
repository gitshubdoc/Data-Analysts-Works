const stripe = Stripe('pk_test_51PJtZgRu3L8k6Ew3J4n7vTc6yZ3kQ2W6j7h8H9vB2dYq1rXx0mKj5lA8b7n1cL9oM3gFmZsQ7iGt0yHnDpVd00');
const elements = stripe.elements();
const card = elements.create('card', {
    style: {
        base: {
            fontSize: '16px',
            color: '#24292e',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
            '::placeholder': {
                color: '#6a737d'
            }
        },
        invalid: {
            color: '#cf222e'
        }
    }
});

card.mount('#card-element');

card.addEventListener('change', (event) => {
    const displayError = document.getElementById('card-errors');
    displayError.textContent = event.error ? event.error.message : '';
});

document.getElementById('applicationForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="mr-2">Processing...</span><span class="spinner"></span>';

    const response = await fetch('http://localhost:4242/create-payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            amount: 5,
            currency: 'USD',
            email: document.getElementById('email').value,
            name: document.getElementById('fullName').value,
        }),
    });

    const { paymentLink } = await response.json();

    if (paymentLink) {
        window.location.href = paymentLink;
    } else {
        document.getElementById('card-errors').textContent = 'Failed to initiate payment.';
        submitButton.disabled = false;
        submitButton.textContent = 'Pay $5 & Submit Application';
    }
});
