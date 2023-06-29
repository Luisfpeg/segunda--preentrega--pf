const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
// Endpoint para visualizar todos los productos
router.get('/', (req, res) => {
  // Lógica para obtener todos los productos y pasarlos a la vista
  const products = [
    { id: 1, name: 'Producto 1', price: 10 },
    { id: 2, name: 'Producto 2', price: 20 },
    { id: 3, name: 'Producto 3', price: 30 }
  ];

  res.render('productList', { products });
});

// Endpoint para ver los detalles de un producto
router.get('/:id', (req, res) => {
  // Lógica para obtener el producto con el ID especificado y pasarlo a la vista
  const product = { id: 1, name: 'Producto 1', price: 10, category: 'Categoría 1', availability: true, description: 'Descripción del producto' };

  res.render('productDetails', { product });
});

// Endpoint para agregar un producto al carrito
router.post('/:id/add-to-cart', (req, res) => {
  // Lógica para agregar el producto al carrito
  const productId = req.params.id;
  const cartId = req.body.cartId;

  // ...

  res.redirect(`/carts/${cartId}`);
});

module.exports = router;
