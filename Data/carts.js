const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const logger = require('../config/logging');

/**
 * @swagger
 * tags:
 *   name: Carts
 *   description: Operaciones relacionadas con carritos
 */

/**
 * @swagger
 * /carts/add-to-cart/{productId}:
 *   post:
 *     summary: Agrega un producto al carrito
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: productId
 *         description: ID del producto a agregar al carrito
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto agregado al carrito con éxito
 *       404:
 *         description: Producto no encontrado
 *       403:
 *         description: No puedes agregar tu propio producto al carrito
 *       500:
 *         description: Error al agregar el producto al carrito
 */

router.post('/add-to-cart/:productId', async (req, res) => {
  const { productId } = req.params;
  const user = req.user;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    if (user.role === 'premium' && user.email === product.owner) {
      return res.status(403).json({ message: 'No puedes agregar tu propio producto al carrito.' });
    }

// Ruta para agregar un producto al carrito
router.post('/add-to-cart/:productId', async (req, res) => {
  const { productId } = req.params;
  const user = req.user;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    if (user.role === 'premium' && user.email === product.owner) {
      return res.status(403).json({ message: 'No puedes agregar tu propio producto al carrito.' });
    }

    // Agregar la lógica para agregar el producto al carrito aquí
    // ...

    return res.json({ message: 'Producto agregado al carrito con éxito.' });
  } catch (error) {
    console.error('Error al agregar el producto al carrito:', error);
    res.status(500).json({ message: 'Error al agregar el producto al carrito.' });
  }
});

module.exports = router;
