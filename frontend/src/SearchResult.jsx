import { MyNavbar } from "./MyNavbar";
import { MyFooter } from './MyFooter.jsx'
import { useLocation } from "react-router-dom";
import { Alert, Container } from "react-bootstrap";
import BookCard from "./BookCard";

function SearchResult(){
    const location=useLocation();
    const books=location.state?.wynik || []; // pobranie danych z przekazanego wczesniej stanu
    const searchType=location.state?.rodzajWyszukiwania; // pobranie rodzaju wyszukiwania od ktorego bedzie zalezal tekst, 
    // bo bedzie to 'wyniki wyszukiwania:' dla szukania po tytule lub autorze, a dla szukania po rodzaju (wybor z menu kategorii) bedzie to 'ksiazki z $kategorii:'
    const opcionalCategory=location.state?.kategoria; // opcjonalny parametr podawany przy wyszukiwaniu po kategorii, jest tak gdy searchType='poKategorii'

    return(
        <>
        <MyNavbar/>

        {books.length>0 ? <div className="mt-3">
            <h1 className="text-center mb-3">{searchType==="autorOrTytul" ? "Wyniki wyszukiwania:" : `Książki z kategorii ${opcionalCategory}:`}</h1>
            <Container className='d-flex flex-wrap justify-content-center align-items-center'>
                {books.map(book => (
                <div className="m-2" key={book._id.toString()}>
                    <BookCard book={book} />
                </div>
                ))}
            </Container>
        </div> : 
        <div className="container mt-3 text-center fs-3">
            <Alert variant="info">Nie znaleziono wyników spełniających podane kryterium.</Alert>
        </div>}

        <MyFooter/>
        </>
    )
}

export default SearchResult;
