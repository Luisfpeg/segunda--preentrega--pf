const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const logger = require('../config/logging');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Operaciones relacionadas con productos
 */

/**
 * @swagger
 * /products/create-product:
 *   post:
 *     summary: Crea un nuevo producto
 *     tags: [Products]
 *     parameters:
 *       - in: body
 *         name: product
 *         description: Datos del producto a crear
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             description:
 *               type: string
 *     responses:
 *       201:
 *         description: Producto creado con éxito
 *       500:
 *         description: Error al crear el producto
 */
router.post('/create-product', async (req, res) => {
  const { name, description } = req.body;

  try {
    const newProduct = new Product({
      name,
      description,
      owner: req.user ? req.user.email : 'admin', // Asignar el propietario basado en el usuario o usar 'admin'
    });

    await newProduct.save();
    res.status(201).json({ message: 'Producto creado con éxito.' });
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ message: 'Error al crear el producto.' });
  }
});

/**
 * @swagger
 * /products/update-product/{productId}:
 *   put:
 *     summary: Modifica un producto existente
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         description: ID del producto a modificar
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: product
 *         description: Datos del producto actualizados
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             description:
 *               type: string
 *     responses:
 *       200:
 *         description: Producto modificado con éxito
 *       404:
 *         description: Producto no encontrado
 *       403:
 *         description: No tienes permisos para modificar este producto
 *       500:
 *         description: Error al modificar el producto
 */
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

/**
 * @swagger
 * /products/delete-product/{productId}:
 *   delete:
 *     summary: Elimina un producto existente
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         description: ID del producto a eliminar
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado con éxito
 *       404:
 *         description: Producto no encontrado
 *       403:
 *         description: No tienes permisos para eliminar este producto
 *       500:
 *         description: Error al eliminar el producto
 */
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
