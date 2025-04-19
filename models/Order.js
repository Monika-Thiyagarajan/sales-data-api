const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  order_id: { type: String, required: true, unique: true },
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true }, 
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity_sold: { type: Number }, 
  unit_price: { type: Number, required: true },
  discount: { type: Number, required: false, default: 0 }, 
  shipping_cost: { type: Number, required: false, default: 0 }, 
  payment_method: { type: String, required: true }, 
  date_of_sale: { type: Date, required: true }, 
  region: { type: String }, 
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
