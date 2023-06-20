const express = require('express');
const router = express.Router();

// Vista para ver los detalles de un producto
router.get('/products/:id', (req, res) => {
  const productId = req.params.id;
  const cartId = req.query.cartId || '';

  // Lógica para obtener el producto con el ID especificado y pasar los datos a la vista
  const product = { id: 1, name: 'Producto 1', price: 10, category: 'Categoría 1', availability: true, description: 'Descripción del producto' };

  res.render('productDetails', { product, cartId });
});

// Vista para ver un carrito específico
router.get('/carts/:cid', (req, res) => {
  const cartId = req.params.cid;

  // Lógica para obtener los productos del carrito especificado y pasarlos a la vista
  const products = [
    { id: 1, name: 'Producto 1', price: 10 },
    { id: 2, name: 'Producto 2', price: 20 },
    { id: 3, name: 'Producto 3', price: 30 }
  ];

  res.render('cartDetails', { cartId, products });
});

module.exports = router;