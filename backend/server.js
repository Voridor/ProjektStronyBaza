const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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
mongoose.connect('mongodb://127.0.0.1:27017/bookstore')
  .then(() => console.log('Połączono z bazą danych MongoDB'))
  .catch(err => console.log('Błąd połączenia z bazą danych:', err));


// Endpoint do pobrania wszystkich ksiazek
app.get('/api/ksiazki-all', async (req, res) => {
	try{
		const book = await Book.find(); // pobiera wszystkie produkty z bazy
		res.json(book); // obsluga odpowiedzi
	} catch(err){
		res.status(500).json({ message: "Nie udało się pobrać ksiazek." });
	}
});


// Endpoint do pobierania listy bestsellerow
app.get('/api/bestsellery', async (req, res) => {
  try {
	// strict false zezwala na nieokreslone pola
	let Bestseller;
	// zabezpieczenie przed ponownym tworzeniem modelu
	if(mongoose.models.Bestseller){
		Bestseller=mongoose.models.Bestseller;
	} else{
		Bestseller=mongoose.model('Bestseller', new mongoose.Schema({},{strict:false}),'bestsellery');
	}
	const bestsellers=await Bestseller.find();
    // Zwracamy bestsellerowe książki
    res.json(bestsellers);
  } catch (err) {
    res.status(500).json({ message: "Nie udało się pobrać bestsellerów." });
  }
});


// Endpoint do pobierania 8 najnowszych książek na podstawie daty wydania ksiazki
app.get('/api/nowosci', async (req, res) => {
  try {
	let NoweKsiazki;
	if(mongoose.models.NoweKsiazki){
		NoweKsiazki=mongoose.models.NoweKsiazki;
	} else{
		NoweKsiazki=mongoose.model('NoweKsiazki', new mongoose.Schema({},{strict:false}),'nowosci');
	}
	const books=await NoweKsiazki.find();
	delete mongoose.models.NoweKsiazki;
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
	
    // Zwracamy znalezione książki
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Wystąpił błąd podczas wyszukiwania książek' });
  }
});


// endpoint do logowania
app.post('/api/login', async (req, res) => {
	const { username, password } = req.body;
	try {
		// Sprawdzamy, czy użytkownik istnieje
		const user = await User.findOne({ login: username });
		if (!user) {
			return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
		}

		// Porównanie hasła za pomocą bcrypt
		const isPasswordValid = await bcrypt.compare(password, user.haslo);
		if (!isPasswordValid) {
			return res.status(401).json({ message: 'Nieprawidłowe hasło' });
		}

		// Generowanie tokenu JWT
		const token = jwt.sign({ userId: user._id }, 'trudny_klucz', { expiresIn: '24h' });
		res.json({ token });
	} catch (err) {
		res.status(500).json({ message: 'Wystąpił błąd podczas logowania' });
	}
});


// endpoint do rejestracji
app.post('/api/register', async (req, res) => {
	const { username, password, email, name, surname } = req.body;
	try {
		// Sprawdzamy, czy użytkownik już istnieje
		const existingUser = await User.findOne({ login: username });
		if (existingUser) {
			return res.status(400).json({ message: 'Użytkownik o tym loginie już istnieje.' });
		}

		// Hashowanie hasła za pomocą bcrypt
		const hashedPassword = await bcrypt.hash(password, 10); // 10 to liczba rund "salt"

		// Tworzymy nowego użytkownika
		const newUser = new User({
			login: username,
			haslo: hashedPassword,
			email: email,
			imie: name,
			nazwisko: surname,
		});

		await newUser.save();

		res.status(201).json({ message: 'Użytkownik został zarejestrowany.' });
	} catch (err) {
		res.status(500).json({ message: 'Wystąpił błąd podczas rejestracji.' });
	}
});


// funckcja do autoryzacji operacji z tokenem
const authenticateToken = (req, res, next) => {
	const token = req.header('Authorization')?.split(' ')[1]; // Oczekujemy formatu "Bearer <token>"
	if (!token) return res.status(401).json({ message: 'Brak tokenu' });

	jwt.verify(token, 'trudny_klucz', (err, decoded) => {
		if (err) return res.status(403).json({ message: 'Nieprawidłowy token' });
		req.user = decoded; // Ustawiamy dane użytkownika w req
		next();
	});
};


// endpoint do pobierania zawartosci koszyka dla użytkownika
// Zakładamy, że użytkownik ma jeden koszyk dla siebie.
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
	// pobieranie danych użytkownika z bazy na podstawie jego ID (które jest w tokenie)
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
	const cart = await Cart.findOne({ user_id: user._id, status: "otwarty" }).populate('ksiazki.book_id');
	if(!cart){
		return res.status(200).json({}); // zwracamy pusty obiekt i unikamy errora
		//return res.status(404).json({ message: 'Koszyk nie znaleziony' }); to powodowalo error w konsoli przeglaraki, gdy koszyk byl pusty
	}
	
	// przygotowanie odpowiedzi z informacjami o książkach w koszyku
    const cartItems = cart.ksiazki.map(item => ({
		book_id: item.book_id._id,
		tytul: item.book_id.tytul,
		ilosc: item.ilosc,
		cena: item.cena,
		calkowita_cena: item.subtotal,
		okladka_adres: item.book_id.okladka_adres
    }));
    res.status(200).json(cartItems);
  } catch (err) {
    res.status(500).json({ message: "Nie udało się pobrać koszyka." });
  }
});


// endpoint do usuwania ksiazki z koszyka
app.delete('/api/cart/:bookID', authenticateToken, async (req, res) => {
  const { bookID } = req.params;
  try {
	const user = await User.findById(req.user.userId);
	if (!user) return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
	
	// Sprawdzamy, czy koszyk użytkownika istnieje i czy jest otwarty
    let cart = await Cart.findOne({ user_id: user._id, status: "otwarty" });
    if(!cart){
		return res.status(404).json({ message: 'Koszyk nie został znaleziony' });
    }
	
	// Sprawdzamy, czy książka istnieje w koszyku
    const bookIndex = cart.ksiazki.findIndex(item => item.book_id.toString() === bookID);
    if (bookIndex === -1) {
		return res.status(404).json({ message: 'Książka nie znajduje się w koszyku' });
    }

    // Usuwamy książkę z koszyka
    cart.ksiazki.splice(bookIndex, 1);

    // Zapisujemy zmiany w koszyku
    //await cart.save();  -- stary sposob
	await Cart.findOneAndUpdate(
		{_id: cart._id},
		{$set: {ksiazki: cart.ksiazki}}, // ustawiamy zaktualizowana tablice ksiazek
		{new: true}
	);

    // Zwracamy zaktualizowany koszyk
	const cartItems = cart.ksiazki.map(item => ({
		book_id: item.book_id._id,
		tytul: item.book_id.tytul,
		ilosc: item.ilosc,
		cena: item.cena,
		calkowita_cena: item.subtotal,
		okladka_adres: item.book_id.okladka_adres
    }));
    res.status(200).json(cartItems);
  } catch (err) {
    res.status(500).json({ message: "Nie udało się usunąć produktu." });
  }
});


// endpoint do dodawania ksiazki do koszyka
app.post('/api/cart-add/:bookID', authenticateToken, async (req, res) => {
  const { bookID } = req.params;
  const { ilosc } = req.body;
  try {
	const user = await User.findById(req.user.userId);
	if (!user) return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
	
	// sprawdzenie czy książka istanieje w bazie (dla bezpieczeństwa)
	const book=await Book.findById(bookID);
	if (!book){
		return res.status(404).json({message:"Książka nie została odnaleziona w bazie."});
	}
	
	// sprawdzenie czy koszyk użytkownika istnieje i czy jest otwarty
    let cart = await Cart.findOne({ user_id: user._id, status: "otwarty" });
    if(!cart){
		// nie mamy koszyka, wiec trzeba jakis stworzyc dla uzytkownika
		cart=new Cart({
			user_id: user._id,
			ksiazki: [],
			data_utworzenia: new Date(),
			status: "otwarty"
		});
    }
	
	// sprawdzenie czy książka juz jest w koszyku
    const existBookIndex = cart.ksiazki.findIndex(item => item.book_id.toString() === bookID);
    if (existBookIndex !== -1) {
		// gdy jest w koszyku to zwiekszamy jej ilosc
		cart.ksiazki[existBookIndex].ilosc+=ilosc;
		cart.ksiazki[existBookIndex].subtotal=cart.ksiazki[existBookIndex].ilosc*cart.ksiazki[existBookIndex].cena;
    } else{
		// jak jej nie ma to dodajemy
		cart.ksiazki.push({
			book_id: bookID,
			ilosc: ilosc,
			cena: book.cena,
			subtotal: book.cena*ilosc
		});
	}
	
	// wykonanie zapisu koszyka
	await cart.save();
	res.status(200).json({ message: 'Produkt został dodany.' });
  } catch (err) {
    res.status(500).json({ message: "Nie udało się dodać książki do koszyka." });
  }
});


// endpoint do zmniejszania ilosci ksiazki o 1 w koszyku
app.patch('/api/cart/zmniejsz-book/:bookID', authenticateToken, async (req, res) => {
	const { bookID } = req.params;
	try{
		const user = await User.findById(req.user.userId);
		if (!user) return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
		let cart=await Cart.findOne(
			{
				user_id: user._id,
				status: "otwarty",
				"ksiazki.book_id": bookID
			},
			{
				"ksiazki.$": 1
			}
		);
		if(!cart || cart.ksiazki.length===0){
			return res.status(404).json({ message: "Nie znaleziono książki w koszyku do zmniejszenia, lub użytkownik nie ma koszyka owtartego." });
		}
		const book=cart.ksiazki[0];
		if(book.ilosc>1){
			const newSubtotal=(book.ilosc-1)*book.cena;
			const updatedCart=await Cart.findOneAndUpdate(
				{
					user_id: user._id,
					status: "otwarty",
					"ksiazki.book_id": bookID
				},
				{
					$inc: { "ksiazki.$[elem].ilosc": -1 },
					$set: { "ksiazki.$[elem].subtotal": newSubtotal }
				},
				{
					arrayFilters: [{ "elem.book_id": new mongoose.Types.ObjectId(bookID) }],
					new: true
				}
			);
			if(!updatedCart){
				throw new Error("Nie udalo sie zaktualizowac koszyka.");
			}
			return res.status(200).json(updatedCart); // zmniejszono ilosc, ale nie do 0 czyli nie usunieto ksiazki calkowicie
		}
		else{
			const updatedCart=await Cart.findOneAndUpdate(
				{
					user_id: user._id,
					status: "otwarty"
				},
				{
					$pull: { "ksiazki": { book_id: new mongoose.Types.ObjectId(bookID) } }
				},
				{
					new: true
				}
			);
			if(!updatedCart){
				throw new Error("Nie udalo sie zaktualizowac koszyka.");
			}
			return res.status(200).json(updatedCart); // zmniejszono ilosc, ale nie do 0 czyli nie usunieto ksiazki calkowicie
		}
	} catch(err){
		console.log(err);
		res.status(500).json({ message: "Nie udało się zmniejszyć ilości książki w koszyku." });
	}
});

// endpoint do zwiekszana ilosci ksiazki o 1 w koszyku
app.patch('/api/cart/zwieksz-book/:bookID', authenticateToken, async(req, res) => {
	const { bookID } = req.params;
	try{
		const user=await User.findById(req.user.userId);
		if (!user) return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
		const cart=await Cart.findOne(
			{
			user_id: user._id,
			status: "otwarty",
			"ksiazki.book_id": bookID 
			},
			{
				"ksiazki.$": 1 // ta .$ daje to ze dostaniemy tylko ksiazke, ktora spelnia warunki wyszukiwania
			}
		);
		if(!cart || cart.ksiazki.length===0){
			return res.status(404).json({ message: "Nie znaleziono książki w koszyku do zmniejszenia, lub użytkownik nie ma koszyka owtartego." });
		}
		const book=cart.ksiazki[0];
		const newSubtotal = (book.ilosc+1) * book.cena;
		const updatedCart=await Cart.findOneAndUpdate(
			{
				user_id: user._id,
				status: "otwarty",
				"ksiazki.book_id": bookID
			},
			{
				$inc: { "ksiazki.$[elem].ilosc": 1 },
				$set: { "ksiazki.$[elem].subtotal": newSubtotal }
			},
			{
				arrayFilters: [{ "elem.book_id": new mongoose.Types.ObjectId(bookID) }],
				new: true
			}
		);
		if(!updatedCart){
			throw new Error("Nie udalo sie zaktualizowac koszyka.");
		}
		res.status(200).json(updatedCart);
	} catch(err){
		console.log(err);
		res.status(500).json({ message: "Nie udało się zwiększyć ilości książki w koszyku." })
	}
});

app.post('/api/cart-zamow', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
    // szukanie otwargego koszyka
    let cart = await Cart.findOne({ user_id: user._id, status: "otwarty" });
    if (!cart) {
      return res.status(404).json({ message: 'Otwarty koszyk nie został znaleziony' });
    }

    // Sprawdzenie dostępności książek
    for (const item of cart.ksiazki) {
      const { book_id, ilosc } = item;
      const book = await Book.findById(book_id);
      if (!book) {
        return res.status(404).json({ message: `Książka o ID ${book_id} nie została znaleziona.` });
      }
      if (book.ilosc < ilosc) {
        return res.status(400).json({
          message: `Brak wystarczającej ilości książki "${book.tytul}". Dostępne: ${book.ilosc}, zamówione: ${ilosc}.`
        });
      }
    }

	// wyznaczenie rabatu, aby go potem odbic z cen ksiazek
	let rabat = await User.aggregate([
		{
			$match: { _id: user._id }
		},
		{
			$lookup:{
				from:"books",
				localField: "_id",
				foreignField: "zamowienia.user_id",
				as: "user_orders"
			}
		},
		{$unwind: "$user_orders"},
		{$unwind: "$user_orders.zamowienia"},
		{
			$group:{
				_id: "$_id",
				wydana_kwota: {$sum: "$user_orders.zamowienia.kwota_zamowienia"}
			}
		},
		{
			$addFields:{
				rabat:{
					$switch: {
						branches:[
							{case:{$gt:["$wydana_kwota", 1000]},then:15},
							{case:{$and:[{$gte:["$wydana_kwota", 200]},{$lte:["$wydana_kwota",1000]}]},then:8},
							{case:{$and:[{$gte:["$wydana_kwota",125]},{$lt:["$wydana_kwota",200]}]},then:5}
						],
						default:0
					}
				}
			}
		},
		{
			$project:{
				_id: 0,
				wydana_kwota: 1,
				rabat: 1
			}
		}
		]);
	if (!rabat){
		return res.status(404).json({ message: 'Nie udało się wyznaczyć rabatu dla klienta.' });
	}
	if(rabat.length==0){
		rabat=[{wydana_kwota: 0, rabat: 0}];
	}
	
    // Jeśli wszystkie książki są dostępne, wykonaj zmiany
    for (const item of cart.ksiazki) {
	  // pole kwota_zamowienia to kwota po uwzglednieniu rabatu
      const { book_id, ilosc, subtotal } = item;
      const book = await Book.findById(book_id);
	  let kwotaPoRabat=(subtotal*((100-rabat[0].rabat)/100)).toFixed(2);
      // dodajemy szczegoly zamowienia do pola zamowienia w ksiazce
	  book.zamowienia.push({
		ilosc: ilosc,
		data_zamowienia: new Date(),
		kwota_przedrabatem: subtotal,
		rabat_procent: rabat[0].rabat,
		kwota_zamowienia: kwotaPoRabat,
		user_id: user._id,
		cart_id: cart._id
	  });
      book.ilosc -= ilosc;
      await book.save();
	  // dodajemy do koszyka cene po rabacie, jaka zaplacilismy za dana ksiazke
	  await Cart.updateOne(
		{
			_id: cart._id,
			"ksiazki.book_id": book_id
		},
		{
			$set: {
				"ksiazki.$.subtotal_porabacie": kwotaPoRabat
			}
		}
	  );
    }
    await Cart.updateOne({_id: cart._id },{$set: {status: "realizowane", data_zakupu: new Date()}});
    res.status(200).json({ message: 'Zamówienie zostało złożone pomyślnie.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Wystąpił błąd podczas składania zamówienia.' });
  }
});


/* endpoint do pobierania rabatu dla klienta
obliczany jest na podstawie łącznej kwoty wydanej na zamowienia(pole/tablica w kolekcji books)
*/
app.get('/api/klient-rabat', authenticateToken, async (req, res) => {
  try {
	// pobieranie danych użytkownika z bazy na podstawie jego ID (które jest w tokenie)
    const user = await User.findById(req.user.userId);
	//const user = await User.find({ login: "test" });
    if (!user) return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
	
	// agregacja ponizej policzy nam rabat dla konkretnego uzytkownika
	const rabat = await User.aggregate([
	{
		$match: { _id: user._id }
	},
	{
		$lookup:{
			from:"books",
			localField: "_id",
			foreignField: "zamowienia.user_id",
			as: "user_orders"
		}
	},
	{$unwind: "$user_orders"},
	{$unwind: "$user_orders.zamowienia"},
	{
		$group:{
			_id: "$_id",
			wydana_kwota: {$sum: "$user_orders.zamowienia.kwota_zamowienia"}
		}
	},
	{
		$addFields:{
			rabat:{
				$switch: {
					branches:[
						{case:{$gt:["$wydana_kwota", 1000]},then:15},
						{case:{$and:[{$gte:["$wydana_kwota", 200]},{$lte:["$wydana_kwota",1000]}]},then:8},
						{case:{$and:[{$gte:["$wydana_kwota",125]},{$lt:["$wydana_kwota",200]}]},then:5}
					],
					default:0
				}
			}
		}
	},
	{
		$project:{
			_id: 0,
			wydana_kwota: 1,
			rabat: 1
		}
	}
	]);
	if (!rabat){
      return res.status(404).json({ message: 'Nie udało się wyznaczyć rabatu dla klienta.' });
    }
	
    res.status(200).json(rabat);
  } catch (err){
	console.log(err);
    res.status(500).json({ message: "Błąd w api rabatowym." });
  }
});


// endpoint do pobrania informacji o tym czy uzytkownik to administrator
app.get('/api/isadmin', authenticateToken, async (req, res) => {
	//const token = req.user.userId to to samo co nizej
	const token = req.header('Authorization')?.split(' ')[1];
	const decoded = jwt.decode(token);
	const userid=decoded.userId;
	try {
		const user = await User.findById(userid);
		if (!user) {
			return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
		};
		if(user.rola=="Admin"){
			res.status(200).json({ message: 'Użytkownik jest administratorem.' });
		} 
		else {
			//res.status(403).json({ message: 'Użytkownik nie jest administratorem.' }); 
			// teraz nie ma errror w konsoli przegladarki
			res.status(222).json({ message: null });
		}
	} catch (err){
		res.status(500).json({ message: 'Wystąpił błąd podczas sprawdzania uprawnień.' });
	}
});


// endpoint do pobrania zamowien w trakcie realizacji i tych zrealizowanych
app.get('/api/client/realizowane-zamowienia', authenticateToken, async (req, res) => {
	try{
		const user = await User.findById(req.user.userId);
		if (!user) return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
		const zamowienia=await Cart.aggregate([
			{
				$match: {
					user_id: user._id,
					status: {$ne: "otwarty"}
				}
			},
			{
				$unwind: "$ksiazki"
			},
			{
				$lookup: {
					from: "books",
					localField: "ksiazki.book_id",
					foreignField: "_id",
					as: "dane_ksiazki"
				}
			},
			{
				$unwind: "$dane_ksiazki"
			},
			{
				$group: {
					_id: "$_id",
					//user_id: {$first: "$user_id"},
					status: {$first: "$status"},
					ksiazki: {
						$push: {
							book_id: "$ksiazki.book_id",
							tytul: "$dane_ksiazki.tytul",
							ilosc: "$ksiazki.ilosc",
							cena: "$ksiazki.cena",
							subtotal: "$ksiazki.subtotal",
							subtotal_porabacie: "$ksiazki.subtotal_porabacie"
						}
					},
					suma_subtotal: {$sum: "$ksiazki.subtotal_porabacie"},
					data_utworzenia: {$first: "$data_utworzenia"},
					data_zakupu: {$first: "$data_zakupu"}
				}
			},
			{
				$sort: {data_zakupu: -1} // sortowanie po dacie(najnowsze na poczatku)
			},
			{
				$project: {
					_id: 1,
					//user_id: 0,
					ksiazki: 1,
					status: 1,
					suma_subtotal: 1,
					data_utworzenia: 1,
					data_zakupu: 1
				}
			}
		]);
		res.status(200).json(zamowienia);
	} catch(err){
		console.error(err);
		res.status(500).json({ message: 'Błąd pobrania realizowanych zamowien' })
	}
});


// endpoint do dodawania nowej ksiazki do bazy
app.post('/api/admin/add-book', authenticateToken, async (req, res) => {
	try{
		const user = await User.findById(req.user.userId);
		if (!user) return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
		const newBook=new Book(req.body);
		const savedBook=await newBook.save();
		res.status(201).json(savedBook);
	} catch(err){
		console.error(err);
		res.status(500).json({ message: "Błąd dodawania ksiązki do bazy." });
	}
});


// endpoint do edycji ksiazki w bazie
app.put('/api/admin/update-book/:id', authenticateToken, async (req, res) => {
	try{
		const user = await User.findById(req.user.userId);
		if (!user) return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
		const { id } = req.params;
		const upgradedBook=await Book.findOneAndUpdate(
			{
				_id: id
			},
			req.body,
			{
				new: true
			}
		);
		res.status(200).json(upgradedBook);
	} catch(err){
		console.error(err);
		res.status(500).json({ message: "Błąd edycji książki w bazie." });
	}
});

// endpoint do usuwania ksiazki z bazy
app.delete('/api/admin/del-book/:id', authenticateToken, async (req, res) => {
	try{
		const { id } = req.params;
		const user = await User.findById(req.user.userId);
		if (!user) return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
		await Book.deleteOne({_id: id});
		res.status(200).json({ message: 'Książka została usunięta.' });
	} catch(error){
		console.log(error);
		res.status(500).json({ message: 'Błąd podczas usuwania książki.' });
	}
});


// endpoint do zwracania top 3 kupujących ksiazki
app.get('/api/admin/top-kupujacy', async (req, res) => {
	try {
	  // agregacja ponizej policzy ile kto wydal i zwróci listę
	  const topka = await User.aggregate([
	  {
		  $lookup:{
			  from:"books",
			  localField: "_id",
			  foreignField: "zamowienia.user_id",
			  as: "user_orders"
		  }
	  },
	  {$unwind: "$user_orders"},
	  {$unwind: "$user_orders.zamowienia"},
	  {
		  $group:{
			  _id: "$_id",
			  login: { $first: "$login" },
			  imie: { $first: "$imie" },
			  nazwisko: { $first: "$nazwisko" },
			  email: { $first: "$email" },
			  wydana_kwota: {$sum: "$user_orders.zamowienia.kwota_zamowienia"}
		  }
	  },
	  {
		  $project:{
			  _id: 1,
			  login: 1,
			  imie: 1,
			  nazwisko: 1,
			  email: 1,
			  wydana_kwota: 1
		  }
	  },
	  {
		$sort: { wydana_kwota: -1 }
	  },
	  {
		$limit: 3
	  }
	  ]);
	  if (!topka){
		return res.status(404).json({ message: 'Nie udało się wyznaczyć topki kupujacych.' });
	  }
	  res.status(200).json(topka);
	} catch (err){
	  console.log(err);
	  res.status(500).json({ message: "Błąd w api top listy kupujacych." });
	}
});


// endpoint do pobierania realizowanych zamówień w panelu admina
app.get('/api/admin/realizamowienia', authenticateToken, async(req, res)=>{
	try{
		const user = await User.findById(req.user.userId);
		if (!user) return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
		const orders=await Cart.aggregate([
			{
				$match: {
					status: "realizowane"
				}
			},
			{
				$lookup: {
					from: "users",
					localField: "user_id",
					foreignField: "_id",
					as: "user_details"
				}
			},
			{
				$unwind: "$user_details"
			},
			{
				$project: {
					_id: 1, // chyba zostaje
					imie: "$user_details.imie",
					nazwisko: "$user_details.nazwisko",
					subtotal_porabacie: { $sum: "$ksiazki.subtotal_porabacie" },
					data_utworzenia: 1,
					status: 1,
					data_zakupu: 1
				}
			},
			{
				$sort: { data_zakupu: -1 }
			}
		]);
		res.status(200).json(orders);
	} catch(err){
		console.log(err);
		res.status(500).json({ message: "Błąd w api pobierania realizowanych zamowien w admin." });
	}
});


// endpoint do pobierania już zrealizowanych zamówień w panelu admina
app.get('/api/admin/zrealizam', authenticateToken, async(req, res)=>{
	try{
		const user = await User.findById(req.user.userId);
		if (!user) return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
		const orders=await Cart.aggregate([
			{
				$match: {
					status: "zrealizowane"
				}
			},
			{
				$lookup: {
					from: "users",
					localField: "user_id",
					foreignField: "_id",
					as: "user_details"
				}
			},
			{
				$unwind: "$user_details"
			},
			{
				$project: {
					imie: "$user_details.imie",
					nazwisko: "$user_details.nazwisko",
					subtotal_porabacie: { $sum: "$ksiazki.subtotal_porabacie" },
					data_utworzenia: 1,
					status: 1,
					data_zakupu: 1
				}
			},
			{
				$sort: { data_zakupu: -1 }
			}
		]);
		res.status(200).json(orders);
	} catch(err){
		console.log(err);
		res.status(500).json({ message: "Błąd w api pobierania realizowanych zamowien w admin." });
	}
});


// endpoint do zmiany statusu zamowienia
app.post('/api/admin/oznacz/zrealiz/:id', authenticateToken, async(req, res)=>{
	try{
		const user = await User.findById(req.user.userId);
		if (!user) return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
		const orderID=req.params.id;
		await Cart.updateOne(
			{
				_id: orderID
			},
			{
				$set: { status: "zrealizowane" }
			}
		);
		res.status(200).json({message:"Udało się zmienic status zamowienia."});
	} catch(err){
		console.log(err);
		res.status(500).json({ message: "Błąd w api zmiany statusu." });
	}
});


// endpoint do anulowania zamówienia
app.post('/api/admin/anuluj/zamow/:id', authenticateToken, async(req, res)=>{
	try{
		const user = await User.findById(req.user.userId);
		if (!user) return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
		const orderID=req.params.id;
		const cart=await Cart.findById(orderID); // pobieramy koszyk z odpowiednim zamowieniem
		if(!cart){
			return res.status(404).json({message:"Zamownienie nie zostalo znalezione."});
		}
		// zmiana statusu zamowienia/koszyka na anulowane
		cart.status="anulowane";
		await cart.save();

		// usuwanie zamowienia z tablicy zawowien w kolekcji books i zmiana ilosci
		for(const item of cart.ksiazki){
			const bookId=item.book_id;
			const quantity=item.ilosc;
			await Book.updateOne(
				{
					_id: bookId
				},
				{
					$pull: {
						"zamowienia": {cart_id: orderID}
					},
					$inc: { "ilosc": quantity }
				}
			);
		}
		res.status(200).json({message:"Anulowano zamowienie poprawnie."});
	} catch(err){
		console.log(err);
		res.status(500).json({ message: "Błąd w api anulowanie zamowienia, admin." });
	}
});



// Uruchomienie serwera
app.listen(port, () => {
  console.log(`Serwer dziala na http://localhost:${port}`);
  console.log("localhost to 127.0.0.1 (mozna tym zastapic)");
});
