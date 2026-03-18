const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ShopSmart Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Mock Products Data
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 99.99,
    description: "High-quality noise-canceling wireless headphones.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 199.99,
    description: "Feature-rich smart watch with health tracking.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"
  },
  {
    id: 3,
    name: "Mechanical Keyboard",
    price: 129.50,
    description: "RGB mechanical keyboard with tactile switches.",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80"
  },
  {
    id: 4,
    name: "Gaming Mouse",
    price: 59.99,
    description: "Ergonomic gaming mouse with customizable buttons.",
    image: "https://images.unsplash.com/photo-1527814050087-37938154791f?w=500&q=80"
  },
  {
    id: 5,
    name: "Minimalist Backpack",
    price: 79.00,
    description: "Water-resistant backpack for daily commuting.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80"
  },
  {
    id: 6,
    name: "Coffee Maker",
    price: 89.99,
    description: "Programmable coffee maker with thermal carafe.",
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&q=80"
  }
];

// Products API Route
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Root Route (optional, just to show something)
app.get('/', (req, res) => {
  res.send('ShopSmart Backend Service');
});

module.exports = app;
