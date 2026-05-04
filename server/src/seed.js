require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

// Our hand-picked products with high-quality Unsplash images
const manualProducts = [
  {
    name: 'Wireless Headphones',
    price: 99.99,
    description: 'High-quality noise-canceling wireless headphones.',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    category: 'Audio',
    stock: 50,
  },
  {
    name: 'Smart Watch',
    price: 199.99,
    description: 'Feature-rich smart watch with health tracking.',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    category: 'Wearables',
    stock: 30,
  },
  {
    name: 'Mechanical Keyboard',
    price: 129.5,
    description: 'RGB mechanical keyboard with tactile switches.',
    image:
      'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80',
    category: 'Peripherals',
    stock: 75,
  },
  {
    name: 'Gaming Mouse',
    price: 59.99,
    description: 'Ergonomic gaming mouse with customizable buttons.',
    image:
      'https://images.unsplash.com/photo-1527814050087-379381547944?w=500&q=80',
    category: 'Peripherals',
    stock: 100,
  },
  {
    name: 'Minimalist Backpack',
    price: 79.0,
    description: 'Water-resistant backpack for daily commuting.',
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
    category: 'Accessories',
    stock: 60,
  },
  {
    name: 'Coffee Maker',
    price: 89.99,
    description: 'Programmable coffee maker with thermal carafe.',
    image:
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&q=80',
    category: 'Home',
    stock: 40,
  },
];

// Map DummyJSON category names to cleaner display names
const categoryMap = {
  smartphones: 'Smartphones',
  laptops: 'Laptops',
  fragrances: 'Fragrances',
  skincare: 'Skincare',
  groceries: 'Groceries',
  'home-decoration': 'Home',
  furniture: 'Furniture',
  tops: 'Fashion',
  'womens-dresses': 'Fashion',
  'womens-shoes': 'Footwear',
  'mens-shirts': 'Fashion',
  'mens-shoes': 'Footwear',
  'mens-watches': 'Wearables',
  'womens-watches': 'Wearables',
  'womens-bags': 'Accessories',
  'womens-jewellery': 'Accessories',
  sunglasses: 'Accessories',
  automotive: 'Automotive',
  motorcycle: 'Automotive',
  lighting: 'Home',
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Fetch products from DummyJSON
    console.log('📦 Fetching products from DummyJSON...');
    const response = await fetch('https://dummyjson.com/products?limit=50');
    const data = await response.json();

    const apiProducts = data.products.map((p) => ({
      name: p.title,
      price: p.price,
      description: p.description,
      image: p.thumbnail,
      category: categoryMap[p.category] || p.category,
      stock: p.stock,
    }));

    console.log(`📦 Fetched ${apiProducts.length} products from DummyJSON`);

    // Combine manual + API products
    const allProducts = [...manualProducts, ...apiProducts];

    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    await Product.insertMany(allProducts);
    console.log(`🎉 Seeded ${allProducts.length} products successfully!`);

    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDB();
