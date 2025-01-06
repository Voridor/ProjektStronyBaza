const mongoose = require('mongoose');

// Schemat uzytkownika
const userSchema = new mongoose.Schema({
  login: { type: String, required: true, unique: true },
  haslo: { type: String, required: true },
  email: { type: String, required: true },
  imie: { type: String, required: true },
  nazwisko: { type: String, required: true },
});

const User = mongoose.model('User', userSchema, 'users'); // trzeci parametr to nazwa kolekcji

module.exports = User;
