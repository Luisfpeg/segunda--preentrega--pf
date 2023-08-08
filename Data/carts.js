const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Product = require('../models/product');
const Ticket = require('../models/ticket');
const middleware = require('../middleware');
const config = require('../config/config'); // Import the config file

router.post('/:cid/purchase', middleware.checkUserRole('user'), async (req, res) => {
  try {
    const user = req.user;
    const cart = await Cart.findOne({ _id: req.params.cid }).populate('items');

    if (!cart) {
      return res.status(400).send('Cart not found');
    }

    const productsToUpdate = [];
    const productsToRemove = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(400).send(`Product with ID ${item.productId} not found`);
      }

      if (product.stock >= item.quantity) {
        productsToUpdate.push({ product, quantity: item.quantity });
      } else {
        productsToRemove.push(item.productId);
      }
    }

    for (const productToUpdate of productsToUpdate) {
      const { product, quantity } = productToUpdate;
      product.stock -= quantity;
      await product.save();
    }

    const validProducts = cart.items.filter(item => !productsToRemove.includes(item.productId));
    const cartTotal = validProducts.reduce((total, item) => total + item.price, 0);

    const newTicket = await Ticket.create({
      code: generateUniqueCode(),
      amount: cartTotal,
      purchaser: user.email,
    });

    cart.items = cart.items.filter(item => productsToRemove.includes(item.productId));
    await cart.save();

    res.json({ unableToProcess: productsToRemove, newTicket });
  } catch (error) {
    res.status(500).send('Error finalizing purchase');
  }
});

function generateUniqueCode() {
  // Implement your code generation logic here
  return 'TICKET123'; // Example code
}

module.exports = router;
