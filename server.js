require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.post('/create-payment', async (req, res) => {
    try {
        const response = await axios.post('https://api.flutterwave.com/v3/payments', {
            tx_ref: `tx-${Date.now()}`,
            amount: req.body.amount,
            currency: req.body.currency,
            redirect_url: 'http://localhost:3000/success.html',
            customer: {
                email: req.body.email,
                name: req.body.name,
            },
        }, {
            headers: {
                Authorization: `Bearer ${process.env.FLWSECK_TEST-f6ef3bd7a7019f235aa556bbae39889e-X}`, // Correctly uses the environment variable
            },
        });

        res.json({
            paymentLink: response.data.data.link,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));