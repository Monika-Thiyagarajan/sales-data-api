const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_id: { type: String, required: true, unique: true }, 
  name: { type: String, required: true }, 
  category: { type: String, required: true }, 
  description: { type: String, required: true },
  unit_price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
