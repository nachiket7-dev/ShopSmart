const express = require('express');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/orders — Create an order (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { items, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      total,
    });

    res.status(201).json(order);
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Order creation failed', error: error.message });
  }
});

// GET /api/orders — Get user's orders (protected)
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name image');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
