const express = require('express');
const router = express.Router();
const Cart = require('../dao/models/cart');
const Product = require('../dao/models/product');

// Obtener contenido del carrito
router.get('/', async (req, res) => {
  try {
    const cart = await Cart.findOne({});
    res.json(cart);
  } catch (error) {
    res.status(500).send('Error al obtener el carrito');
  }
});

// Agregar producto al carrito
router.post('/add', async (req, res) => {
  try {
    const productId = req.body.productId;
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).send('Producto no encontrado');
    } else {
      const cart = await Cart.findOneAndUpdate({}, { $push: { items: product } }, { new: true });
      res.json(cart);
    }
  } catch (error) {
    res.status(500).send('Error al agregar el producto al carrito');
  }
});

// Eliminar producto del carrito
router.delete('/remove/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const cart = await Cart.findOneAndUpdate({}, { $pull: { items: { _id: productId } } }, { new: true });
    res.json(cart);
  } catch (error) {
    res.status(500).send('Error al eliminar el producto del carrito');
  }
});

module.exports = router;
