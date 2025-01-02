const mongoose = require('mongoose');

// Schemat koszyka
const cartSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const Cart = mongoose.model('Cart', cartSchema, 'carts'); // trzeci parametr to nazwa kolekcji

module.exports = Cart;
