const express = require('express');
const router = express.Router();
const Product = require('../dao/models/product');

// Listar todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await Product.find();
    res.render('products', { productos: productos });
  } catch (error) {
    res.status(500).send('Error al obtener los productos');
  }
});

// Obtener producto por id
router.get('/:pid', async (req, res) => {
  try {
    const producto = await Product.findById(req.params.pid);
    if (!producto) {
      res.status(404).send('Producto no encontrado');
    } else {
      res.json(producto);
    }
  } catch (error) {
    res.status(500).send('Error al obtener el producto');
  }
});

// Añadir nuevo producto
router.post('/', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    res.status(500).send('Error al agregar el producto');
  }
});

// Actualizar producto por id
router.put('/:pid', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
    if (!updatedProduct) {
      res.status(404).send('Producto no encontrado');
    } else {
      res.json(updatedProduct);
    }
  } catch (error) {
    res.status(500).send('Error al actualizar el producto');
  }
});

// Eliminar producto por id
router.delete('/:pid', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
    if (!deletedProduct) {
      res.status(404).send('Producto no encontrado');
    } else {
      res.send('Producto eliminado');
    }
  } catch (error) {
    res.status(500).send('Error al eliminar el producto');
  }
});

module.exports = router;
