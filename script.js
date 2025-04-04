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

    const { paymentIntent, error } = await stripe.confirmCardPayment(
        await getClientSecret(), {
            payment_method: {
                card: card,
                billing_details: {
                    name: document.getElementById('fullName').value,
                    email: document.getElementById('email').value
                }
            }
        }
    );

    if (error) {
        document.getElementById('card-errors').textContent = error.message;
        submitButton.disabled = false;
        submitButton.textContent = 'Pay $5 & Submit Application';
    } else if (paymentIntent.status === 'succeeded') {
        window.location.href = 'success.html';
    }
});

async function getClientSecret() {
    const response = await fetch('http://localhost:4242/create-payment-intent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            amount: 1000,
            currency: 'usd'
        }),
    });
    const { clientSecret } = await response.json();
    return clientSecret;
}
