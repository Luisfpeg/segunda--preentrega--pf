const express = require('express');
const router = express.Router();
const Cart = require('../dao/models/cart');
const Product = require('../dao/models/product');

// Renderizar vista del carrito
router.get('/cart', async (req, res) => {
  try {
    const cart = await Cart.findOne({});
    res.render('cart', { cart: cart });
  } catch (error) {
    res.status(500).send('Error al obtener el carrito');
  }
});

// Renderizar vista de detalles del carrito
router.get('/cart/details', async (req, res) => {
  try {
    const cart = await Cart.findOne({});
    res.render('cartDetails', { cart: cart });
  } catch (error) {
    res.status(500).send('Error al obtener los detalles del carrito');
  }
});

// Renderizar vista de detalles del producto
router.get('/products/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    if (!product) {
      res.status(404).send('Producto no encontrado');
    } else {
      res.render('productDetails', { product: product });
    }
  } catch (error) {
    res.status(500).send('Error al obtener los detalles del producto');
  }
});

module.exports = router;