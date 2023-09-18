// routes/products.js

const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const logger = require('../config/logging');

// Ruta para crear un producto
router.post('/create-product', async (req, res) => {
  const { name, description } = req.body;

  let owner = 'admin';

  if (req.user && req.user.role === 'premium') {
    owner = req.user.email;
  }

  try {
    const newProduct = new Product({
      name,
      description,
      owner,
    });

    await newProduct.save();
    res.status(201).json({ message: 'Producto creado con éxito.' });
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ message: 'Error al crear el producto.' });
  }
});

// Ruta para modificar un producto
router.put('/update-product/:productId', async (req, res) => {
  const { productId } = req.params;
  const { name, description } = req.body;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    if (req.user.role === 'admin' || req.user.email === product.owner) {
      product.name = name;
      product.description = description;
      await product.save();
      return res.json({ message: 'Producto modificado con éxito.' });
    } else {
      return res.status(403).json({ message: 'No tienes permisos para modificar este producto.' });
    }
  } catch (error) {
    console.error('Error al modificar el producto:', error);
    res.status(500).json({ message: 'Error al modificar el producto.' });
  }
});

// Ruta para eliminar un producto
router.delete('/delete-product/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    if (req.user.role === 'admin' || req.user.email === product.owner) {
      await product.remove();
      return res.json({ message: 'Producto eliminado con éxito.' });
    } else {
      return res.status(403).json({ message: 'No tienes permisos para eliminar este producto.' });
    }
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ message: 'Error al eliminar el producto.' });
  }
});

module.exports = router;
