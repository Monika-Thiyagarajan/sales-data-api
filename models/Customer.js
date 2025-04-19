const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customer_id: { type: String, required: true, unique: true }, 
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, 
  address: { type: String, required: true },
  demographics: {
    age: { type: Number, required: false },
    gender: { type: String, required: false }, 
    location: { type: String, required: false },
  },
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
