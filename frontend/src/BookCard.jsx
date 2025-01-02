
export function BookCard({ book }) {
  return (
    <>
    <div className="card" style={{ width: '18rem', height: '28rem', maxHeight: '28rem' }}>
      <img src={book.okladka_adres} className="card-img-top image-fluid" alt={`Okładka książki ${book.tytul} `} style={{height: '200px', width: '100%'}}/>
      <div className="card-body text-center">
        <h5 className="card-title text-center">{book.tytul}</h5>
        <p className="card-text mb-0"><strong>Autor:</strong> {
          book.autorzy.map(autor => (autor.imie+" "+autor.nazwisko))
        }</p>
        <p className="card-text mb-0" style={{maxHeight: '4rem', overflow: 'auto'}}><strong>Kategorie:</strong> {
          book.kategorie.map(kat => (kat+" "))
        }</p>
        <p className="card-text"><strong>Cena:</strong> {book.cena} zł</p>
        <button className="btn btn-primary">Dodaj do koszyka</button>
      </div>
    </div>
    </>
  );
}

// pozycje przycisku mozna na sztywno sprobowac ustawic

export default BookCard;

/*
stara struktura do statycznego wyswietlania gdy nie korzystano jeszcze z bazy danych

<div className="card" style={{ width: '18rem', height: '31rem' }}>
  <img src={book.image} className="card-img-top image-fluid" alt={`Okładka książki ${book.title} `} />
  <div className="card-body text-center">
    <h5 className="card-title text-center">{book.title}</h5>
    <p className="card-text"><strong>Autor:</strong> {book.author}</p>
    <p className="card-text"><strong>Cena:</strong> {book.price} zł</p>
    <button className="btn btn-primary">Dodaj do koszyka</button>
  </div>
</div>

*/