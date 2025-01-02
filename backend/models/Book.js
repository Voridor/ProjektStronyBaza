const mongoose = require('mongoose');

// Schemat ksiazki
const bookSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  tytul: { type: String, required: true },
  autorzy: [
    {
      imie: { type: String, required: true },
      nazwisko: { type: String, required: true }
    }
  ],
  kategorie: [String],
  isbn: {type: String, required: true},
  data_wydania: {type: Date, required: true},
  cena: { type: Number, required: true },
  ilosc: { type: Number, required: true },
  zamowienia: [
    {
      data_zamowienia: { type: Date, required: true },
      kwota_zamowienia: { type: Number, required: true },
      imie_zamawiajacego: { type: String, required: true },
      nazwisko_zamawiajacego: { type: String, required: true },
      email_zamawiajacego: { type: String, required: true },
      ilosc: { type: Number, required: true }
    }
  ],
  okladka_adres: { type: String, required: true },
});

const Book = mongoose.model('Book', bookSchema, 'books'); // trzeci parametr to nazwa kolekcji

module.exports = Book;
