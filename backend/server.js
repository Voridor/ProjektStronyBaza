const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const Cart = require('./models/Cart');
const Book = require('./models/Book');
const User = require('./models/User');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // mowimy expressowi aby akceptowal JSON-a i dane beda przesylane w tym formacie

// Połączenie z MongoDB
mongoose.connect('mongodb://localhost:27017/bookstore')
  .then(() => console.log('Połączono z bazą danych MongoDB'))
  .catch(err => console.log('Błąd połączenia z bazą danych:', err));


// Endpoint do pobrania wszystkich ksiazek
app.get('/api/ksiazki-all', async (req, res) => {
	try{
		const book = await Book.find(); // pobiera wszystkie produkty z bazy
		// obsluga odpowiedzi
		res.json(book);
	} catch(err){
		res.status(500).json({ message: "Nie udało się pobrać ksiazek." });
	}
});


// Endpoint do pobierania listy bestsellerow
app.get('/api/bestsellery', async (req, res) => {
  try {
    const bestsellers = await Book.aggregate([
      {
        $addFields: {
          zamowienia_count: { $size: "$zamowienia" }
        }
      },
      {
        $sort: { zamowienia_count: -1 }
      },
      {
        $limit: 8
      }
    ]);

    // Zwracamy bestsellerowe książki
    res.json(bestsellers);
  } catch (err) {
    res.status(500).json({ message: "Nie udało się pobrać bestsellerów." });
  }
});


// Endpoint do pobierania 8 najnowszych książek na podstawie daty wydania ksiazki
app.get('/api/nowosci', async (req, res) => {
  try {
    const books = await Book.aggregate([
	{
		$sort: { "data_wydania": -1 } // sortujemy po dacie wydania malejaco (bo jest parametr -1)
	},
	{
		$limit: 8
	}
	]);

    if (books.length === 0) {
      return res.status(404).json({ message: 'Nie znaleziono książek' });
    }

    // Zwracamy JSON najnowszych książek
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Wystąpił błąd podczas pobierania książek' });
  }
});


// Endpoint do pobierania ksiazek po tytule
// wyszukujemy http:localhost:5000/api/ksiazki-tytul?tytul=Harry
app.get('/api/ksiazki-tytul', async (req, res) => {
  try {
    const { tytul } = req.query; // Pobieramy tytul książki z zapytania (query string)
    
    if (!tytul) {
      return res.status(400).json({ message: 'Brak tytułu w zapytaniu' });
    }

    // Wyszukujemy książki, których tytuł zawiera przekazany ciąg znaków (bez względu na wielkość liter)
    const books = await Book.find({
      tytul: { $regex: tytul, $options: 'i' } // $options: 'i' oznacza ignorowanie wielkości liter
    });
	
	/*
	to nie ma raczej sensu bo w frontendzie jak jest tablica o dlugosc zero to wyswietlamy komunikat o braku wynikow
    if (books.length === 0) {
      return res.status(404).json({ message: 'Nie znaleziono książek o tym tytule' });
    }
	*/

    // Zwracamy znalezione książki
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Wystąpił błąd podczas wyszukiwania książek' });
  }
});


// Endpoint do pobierania ksiazek po autorze
// wyszukujemy http:localhost:5000/api/ksiazki-autor?autor=Rowling
app.get('/api/ksiazki-autor', async (req, res) => {
  try {
    const { autor } = req.query; // Pobieramy autora książki z zapytania (query string)
    // pobierany autor to moze byc imie lub nazwisko faktycznego autora w bazie danych
	
    if(!autor){
      return res.status(400).json({ message: 'Nie podano autora w zapytaniu' });
    }

    // Wyszukujemy książki, które napisal dane autor poprzez przekazany ciąg znaków (bez względu na wielkość liter)
    const books = await Book.find({
		autorzy:{
			$elemMatch:{
				// sprawdzenie czy imie lub nazwisko autora zawiera podany parametr autor
				$or:[
				// opcja parametr i ignoruje wielkosc liter
				{imie: { $regex: autor, $options: 'i' }}, // sprawdzenie czy imie zawiera ciag znakow autor
				{nazwisko: { $regex: autor, $options: 'i' }} // sprawdzenie czy nazwisko zawiera ciag znakow autor
				]
			}
		}
    });

	/*
	to nie ma raczej sensu bo w frontendzie jak jest tablica o dlugosc zero to wyswietlamy komunikat o braku wynikow
    if (books.length === 0) { // nie ma nikogo o takim nazwisku lub imieniu
      return res.status(404).json({ message: 'Nie znaleziono książek dla podanego autora' });
    }
	*/
	
    // Zwracamy znalezione książki
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Wystąpił błąd podczas wyszukiwania książek' });
  }
});


// Endpoint do pobierania ksiazek po kategorii
// wyszukujemy http:localhost:5000/api/ksiazki-kategoria?kategoria=Kryminał
app.get('/api/ksiazki-kategoria', async (req, res) => {
  try {
    const { kategoria } = req.query; // pobieramy kategorie ksiazki z zapytania (query string)
    if(!kategoria){
      return res.status(400).json({ message: 'Nie podano kategorii w zapytaniu' });
    }
    // Wyszukujemy książki, które sa przypisane do danej kategorii. Szukamy poprzez przekazany ciąg znaków (bez względu na wielkość liter)
    const books = await Book.find({
		kategorie: { $regex: kategoria, $options: 'i' } // szuka bez względu na wielkość liter
    });
	
	/*
	to nie ma raczej sensu bo w frontendzie jak jest tablica o dlugosc zero to wyswietlamy komunikat o braku wynikow
    if (books.length === 0) { // nie ma książek o tej kategorii
      return res.status(404).json({ message: 'Nie znaleziono książek o podanej kategorii' });
    }
	*/
	
    // Zwracamy znalezione książki
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Wystąpił błąd podczas wyszukiwania książek' });
  }
});



app.post('/api/login', async(req, res) => {
	const { username, password } = req.body;
	try {
		// Sprawdzamy, czy użytkownik istnieje
		const user = await User.findOne({ login: username });
		if (!user) return res.status(404).json({ message: 'Użytkownik nie znaleziony' });

		// Porównanie hasła (bez bcrypt, porównujemy jawne hasła)
		if (user.haslo !== password) {
		  return res.status(401).json({ message: 'Nieprawidłowe hasło' });
		}

		// Generowanie tokenu JWT
		const token = jwt.sign({ userId: user._id }, 'sekretny_klucz', { expiresIn: '1h' });
		res.json({ token });
  } catch (err){
	  res.status(500).json({ message: 'Wystąpił błąd podczas logowania' });
  }
});

app.post('/api/register', async (req, res) => {
	const { username, password, email, name, surname } = req.body;
	try {
		// Sprawdzamy, czy użytkownik już istnieje
		const existingUser = await User.findOne({ login: username });
		if (existingUser) return res.status(400).json({ message: 'Użytkownik o tym loginie już istnieje.' });

		// Tworzymy nowego użytkownika
		const newUser = new User({
			login: username, 
			haslo: password,
			email: email,
			imie: name,
			nazwisko: surname
		});
		await newUser.save();

		res.status(201).json({ message: 'Użytkownik został zarejestrowany.' });
	} catch (err) {
		res.status(500).json({ message: 'Wystąpił błąd podczas rejestracji.' });
	}
});

const authenticateToken = (req, res, next) => {
	const token = req.header('Authorization')?.split(' ')[1]; // Oczekujemy formatu "Bearer <token>"
	if (!token) return res.status(401).json({ message: 'Brak tokenu' });

	jwt.verify(token, 'sekretny_klucz', (err, decoded) => {
		if (err) return res.status(403).json({ message: 'Nieprawidłowy token' });
		req.user = decoded; // Ustawiamy dane użytkownika w req
		next();
	});
};

/*
to jako wzor z authenticateToken (autoryzacja tokenową)
app.get('/user-data', authenticateToken, async (req, res) => {
  try {
    // Pobierz dane użytkownika z bazy na podstawie jego ID (które mamy w tokenie)
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'Użytkownik nie znaleziony' });

    // Zwróć dane użytkownika (np. imię, email)
    res.json({ username: user.login, email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera' });
  }
});
*/

//app.get('/api/cart', authenticateToken, async (req, res) => {

app.get('/api/cart', async (req, res) => {
  try {
	// Pobierz dane użytkownika z bazy na podstawie jego ID (które mamy w tokenie)
    //const user = await User.findById(req.user.userId);
    //if (!user) return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
	//user._id - w tym powinno siedziec id uzytkownika ktore chce do zapytania uzyc
	
    const cart = await Cart.aggregate([
		{
			$match: {user_id: new mongoose.Types.ObjectId("6778fb0406f5360b4f7f6169")}
		},
		{
			$lookup: {
				from: "books",
				localField: "product_id",
				foreignField: "_id",
				as: "dane_ksiazki"
			}
		},
		{
			$project: {
				dane_ksiazki: { $arrayElemAt: ["$dane_ksiazki", 0] }
			}
		}
	]);
    res.json(cart);
	console.log(cart[0]._id);
	console.log(cart[0].dane_ksiazki);
	console.log(cart._id);
  } catch (err) {
	console.log(err);
    res.status(500).json({ message: "Nie udało się pobrać koszyka." });
  }
});






// Endpoint do usuwania produktu z koszyka
app.delete('/api/cart/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    await Cart.deleteOne({ productId }); // Usuwa produkt na podstawie productId
    const cart = await Cart.find();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Nie udało się usunąć produktu." });
  }
});


// Uruchomienie serwera
app.listen(port, () => {
  console.log(`Serwer dziala na http://localhost:${port}`);
  console.log("localhost to 127.0.0.1 (mozna tym zastapic)");
});
