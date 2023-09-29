//payment.js

const express = require('express');
const router = express.Router();
const stripe = require('stripe')('tu_clave_secreta_de_stripe');

router.post('/checkout', async (req, res) => {
  const { productId, quantity } = req.body;

  // Aquí deberías obtener el precio del producto desde tu base de datos
  const productPrice = 1000; 

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Nombre del Producto',
            },
            unit_amount: productPrice,
          },
          quantity,
        },
      ],
      mode: 'payment',
      success_url: '',
      cancel_url: '',
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error al crear la sesión de pago:', error);
    res.status(500).json({ message: 'Error al procesar el pago.' });
  }
});

module.exports = router;
