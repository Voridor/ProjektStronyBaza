const mongoose = require('mongoose');

// Schemat koszyka
const cartSchema = new mongoose.Schema({
	_id: { type: mongoose.Schema.Types.ObjectId },
	user_id: { type: mongoose.Schema.Types.ObjectId },
	product_id: { type: mongoose.Schema.Types.ObjectId },
	amount: { type: Number },
});

const Cart = mongoose.model('Cart', cartSchema, 'carts'); // trzeci parametr to nazwa kolekcji

module.exports = Cart;
