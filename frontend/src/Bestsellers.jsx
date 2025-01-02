import { Alert, Container, Spinner } from "react-bootstrap";
import { MyFooter } from "./MyFooter";
import { MyNavbar } from "./MyNavbar";
import { BookCard } from "./BookCard";
import { useEffect, useState } from "react";


/*
z tej tablic pobierano kiedys statycznie dane jak nie korzystano z bazy danych
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

export function Bestsellers(){
    const [data, setData]=useState([]); // stan poczatkowy to pusty obiekt bo funkcja zwroci odpowiedz w formie obiektu
    const [loading, setLoading]=useState(false);
    const [error, setError]=useState(null);
    // kod do pobrania danych z api
    /* useEffect jest uzywane do uruchomienia funkcji po pierwszym renderowaniu komponentu,
    poniewaz tablica zaleznosci jest pusta, efekt zostanie uruchomiony tylko raz, co dobrze
    pasuje do jednorazowego pobrania danych z API po zaladowaniu komponentu
    */
    useEffect(()=>{
        const fetchData=async()=>{
            setLoading(true);
            setError(null); // resetowanie bledu przed pobraniem danych
            try{
                const response=await fetch("http://localhost:5000/api/bestsellery"); // await wstrzymuje wykonywanie funkcji do momentu pobrania danych
                if(!response.ok){ // gdy odpowiedz nie jest ok to wywalamy errora
                    throw new Error("Błąd pobrania danych i tyle.");
                }
                const result=await response.json(); // konwertacja danych do obiketu JSON
                setData(result);
            } catch(error){
                setError(error.message);
            } finally{
                setLoading(false);
            }
        };

        fetchData();
    },[]); // [] to pusta tablica zaleznosci


    return(
        <>
        <MyNavbar/>
        
        {/* pobranie danych z bazy */}
        {loading ? 
        <div className="text-center">
            <Spinner animation="border" variant="primary" />
        </div> : null}
        {error ? 
        <div className="container mt-3">
            <Alert variant="danger">Wystąpił błąd: {error}</Alert> 
        </div> : null}

        {data.length>0 ? <div className="mt-3">
            <h1 className="text-center mb-3">Bestsellery w naszej księgarni pobrane z bazy:</h1>
            <Container className='d-flex flex-wrap justify-content-center align-items-center'>
                {data.map(book => (
                <div className="m-2" key={book._id.toString()}>
                    <BookCard book={book} />
                </div>
                ))}

                {/* 
                {data.map(book => (
                <div className="m-2" key={book._id.toString()}>
                    <div className="card" style={{ width: '18rem', height: '33rem' }}>
                        <img src={book.okladka_adres} className="card-img-top image-fluid" alt={`Okładka książki ${book.tytul} `} />
                        <div className="card-body text-center">
                            <h5 className="card-title text-center">{book.tytul}</h5>
                            <p className="card-text"><strong>Autor:</strong> {
                                book.autorzy.map(autor => (autor.imie+" "+autor.nazwisko))
                            }</p>
                            <p className="card-text"><strong>Kategorie:</strong> {
                            book.kategorie.map(kat => (kat+" "))
                            }</p>
                            <p className="card-text"><strong>Cena:</strong> {book.cena} zł</p>
                            <button className="btn btn-primary">Dodaj do koszyka</button>
                        </div>
                    </div>
                </div>
                ))}
                */}


            </Container>
        </div> : 
        <div className="container mt-3">
            <Alert variant="info">Brak bestsellerów.</Alert>
        </div>}
        


        {/* 
        <div className="mt-3">
            <h1 className="text-center mb-3">Bestsellery w naszej księgarni:</h1>
            <Container className='d-flex flex-wrap justify-content-center align-items-center'>
                {books.map(book => (
                <div className="m-2" key={book.id}>
                    <BookCard book={book} />
                </div>
                ))}
            </Container>
        </div>
        */}


        <MyFooter/>
        </>
    );
}

export default Bestsellers;