const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Cart = require('./models/Cart');
const Book = require('./models/Book');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // mowimy expressowi aby akceptowal JSON-a i dane beda przesylane w tym formacie

// Połączenie z MongoDB
mongoose.connect('mongodb://localhost:27017/bookstore')
  .then(() => console.log('Połączono z bazą danych MongoDB'))
  .catch(err => console.log('Błąd połączenia z bazą danych:', err));

// Endpoint do pobierania koszyka - używany testowo w koszyku w przyszłości do usunięcia
app.get('/api/cart', async (req, res) => {
  try {
    const cart = await Cart.find(); // Pobiera wszystkie produkty w koszyku
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Nie udało się pobrać koszyka." });
  }
});


// Endpoint do pobrania wszystkich ksiazek
app.get('/api/ksiazki-all', async (req, res) => {
	try{
		const book = await Book.find(); // pobiera wszystkie produkty z bazy
		/*
		console.log(book[0]);
		console.log("--------------");
		console.log(book[0].kategorie);
		console.log(book[0]._id);
		console.log(book[0]._id.toString());
		//console.log(req);
		let cenaallbooks=0;
		let maxxzamowien=0;
		let tytulmaxxzamowien="";
		let tab=[];
		book.forEach((elem) => {
			cenaallbooks+=elem.cena;
			
			if(elem.zamowienia.length > maxxzamowien){
				maxxzamowien=elem.zamowienia.length;
				tytulmaxxzamowien=elem.tytul;
			}
			
			if(elem.cena < 50){
				tab.push(elem);
			}
			
			//console.log(`id z bazy: ${elem._id.toString()}`);
		});
		console.log(`Najczesciej kupowana ksiazka: ${tytulmaxxzamowien} w ilosci ${maxxzamowien}`);
		*/
		
		// obsluga odpowiedzi
		res.json(book);
		
		//res.json(tab); // zwrocenie ksiazek z tablicy, ktore kosztuje mniej niz 50 zl
	} catch(err){
		res.status(500).json({ message: "Nie udało się pobrać ksiazek." });
	}
});


// Endpoint do pobierania listy bestsellerow
app.get('/api/bestsellery', async (req, res) => {
  try {
    // Wykonaj agregację w MongoDB, aby znaleźć książki z największą liczbą zamówień
    const bestsellers = await Book.aggregate([
      {
        // Tworzymy nową zmienną "zamowienia_count" zliczającą liczbę zamówień dla każdej książki
        $addFields: {
          zamowienia_count: { $size: "$zamowienia" }
        }
      },
      {
        // Sortujemy książki według liczby zamówień w malejącej kolejności
        $sort: { zamowienia_count: -1 }
      },
      {
        // Opcjonalnie: Ograniczamy wynik do pierwszych N bestsellerów (np. top 5)
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

    // Zwracamy 5 najnowszych książek
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


/*
app.post('/api/register', async (req, res) => {
  try {
    const { login, haslo } = req.body; // Odbieramy dane z formularza (login i hasło)

    // Sprawdzamy, czy użytkownik istnieje w tablicy "users"
    const user = users.find(u => u.login === login);
    if (!user) {
      return res.status(401).json({ message: 'Błędny login lub hasło' }); // Błędny login
    }

    // Sprawdzamy poprawność hasła
    const passwordMatch = await bcrypt.compare(haslo, user.passwordHash); // Porównujemy hasło z hashem w bazie
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Błędny login lub hasło' }); // Błędne hasło
    }

    // Jeśli wszystko jest OK, logujemy użytkownika
    res.status(200).json({ message: 'Zalogowano pomyślnie' });
  } catch (err) {
    res.status(500).json({ message: 'Wystąpił błąd podczas logowania' });
  }
});
*/



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
