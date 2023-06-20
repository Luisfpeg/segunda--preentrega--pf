const express = require('express');
const router = express.Router();
const Cart = require('../dao/models/cart');

// Obtener el contenido del carrito
router.get('/', async (req, res) => {
  try {
    const cart = await Cart.findOne();
    res.json(cart);
  } catch (error) {
    res.status(500).send('Error al obtener el carrito');
  }
});

// Añadir artículo al carrito
router.post('/', async (req, res) => {
  try {
    const cart = await Cart.findOne();
    const newItem = { productId: req.body.productId, quantity: req.body.quantity };
    cart.items.push(newItem);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).send('Error al añadir el artículo al carrito');
  }
});

// Eliminar artículo del carrito
router.delete('/:pid', async (req, res) => {
  try {
    const cart = await Cart.findOne();
    const itemIndex = cart.items.findIndex(item => item.productId === req.params.pid);
    if (itemIndex !== -1) {
      cart.items.splice(itemIndex, 1);
      await cart.save();
    }
    res.json(cart);
  } catch (error) {
    res.status(500).send('Error al eliminar el artículo del carrito');
  }
});

module.exports = router;
