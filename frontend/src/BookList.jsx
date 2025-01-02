import { Alert, Container, Spinner } from 'react-bootstrap';
import BookCard from './BookCard';
import { useEffect, useState } from 'react';

// jest to wykorzystywane na stronie glownej HomePage.jsx
// tutaj są pobierane z bazy danych ksiazki najnowsze, czyli nowosci w ofercie ksiegarni

/*
ta tablica byla potrzebna do statycznego pobierania z niej danych do wyswietlenie gdy jeszcze nie korzystano z bazy danych
const books = [
  { id: 1, title: 'Harry Potter i Kamień Filozoficzny', author: 'J. K. Rowling', price: '49.99', image: '/img/book.png' },
  { id: 2, title: 'Harry Potter i Komnata Tajemnic', author: 'J. K. Rowling', price: '29.99', image: '/img/book.png' },
  { id: 3, title: 'Hobbit, czyli tam i z powrotem', author: 'J.R.R. Tolkien', price: '39.99', image: '/img/book.png' },
  { id: 4, title: 'Zbrodnia i Kara', author: 'Fiodor Dostojewski', price: '44.99', image: '/img/book.png' },
  { id: 5, title: 'Zbrodnia i Kara', author: 'Fiodor Dostojewski', price: '44.99', image: '/img/book.png' },
  { id: 6, title: 'Zbrodnia i Kara', author: 'Fiodor Dostojewski', price: '44.99', image: '/img/book.png' },
  { id: 7, title: 'Zbrodnia i Kara', author: 'Fiodor Dostojewski', price: '44.99', image: '/img/book.png' },
  { id: 8, title: 'Zbrodnia i Kara', author: 'Fiodor Dostojewski', price: '44.99', image: '/img/book.png' },
];
*/

export function BookList() {
  const [books, setBooks]=useState([]);
  const [loading, setLoading]=useState(false);
  const [error, setError]=useState(null);

  useEffect(()=>{
    const fetchBooks=async()=>{
      setLoading(true);
      setError(null); // resetowanie bledu przed pobraniem danych
      try{
        const response=await fetch("http://localhost:5000/api/nowosci");
        if(!response.ok){ // gdy odpowiedz nie jest ok to wywalamy errora
          throw new Error("Błąd pobrania danych i tyle.");
        }
        const result=await response.json(); // konwertacja danych do obiketu JSON
        setBooks(result);
      } catch(error){
        setError(error.message);
      } finally{
        setLoading(false);
      }
    };

    fetchBooks();
  },[]); // [] to pusta tablica zaleznosci


  return (
    <>

    {loading ? 
    <div className="text-center">
      <Spinner animation="border" variant="primary" />
    </div> : null}
    {error ? <Alert variant="danger">Wystąpił błąd: {error}</Alert> : null}

    {books.length>0 ?
    <Container className='d-flex flex-wrap justify-content-center align-items-center'>
        {books.map(book => (
          <div className="m-2" key={book._id}>
            <BookCard book={book} />
          </div>
        ))}
    </Container> : <Alert variant="info">Brak nowości.</Alert>}

    {/* stary kod sprzed dodania bazy danych
    <Container className='d-flex flex-wrap justify-content-center align-items-center'>
        {books.map(book => (
          <div className="m-2" key={book.id}>
            <BookCard book={book} />
          </div>
        ))}
    </Container>
    */}

    </>
  );
}

export default BookList;

