const mongoose = require('mongoose');

// Schemat koszyka
const cartSchema = new mongoose.Schema({
	//_id: { type: mongoose.Schema.Types.ObjectId },
	user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	ksiazki: [{
		_id: false,
		book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
		ilosc: { type: Number },
		cena: { type: Number },
		subtotal: { type: Number }
	}],
	data_utworzenia: { type: Date },
	status: { type: String }
},{
	versionKey: false
});

const Cart = mongoose.model('Cart', cartSchema, 'carts'); // trzeci parametr to nazwa kolekcji

module.exports = Cart;
