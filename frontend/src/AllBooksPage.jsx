import { MyNavbar } from "./MyNavbar";
import { MyFooter } from './MyFooter.jsx'
import { Alert, Container, Spinner } from "react-bootstrap";
import BookCard from "./BookCard";
import { useEffect, useState } from "react";

function AllBooksPage(){
    const [books, setBooks]=useState([]);
    const [loading, setLoading]=useState(false);
    const [error, setError]=useState(null);
    
    useEffect(()=>{
        const wszystkieKsiazki=async()=>{
            setLoading(true);
            setError(null); // resetowanie bledu przed pobraniem danych
            try{
                const response=await fetch("http://localhost:5000/api/ksiazki-all", {method: "GET" , 
                    headers: { "Cache-Control": "no-cache" }
                });
                if(!response.ok){ // gdy odpowiedz nie jest ok to wywalamy errora
                    throw new Error("Błąd pobrania danych");
                }
                const result=await response.json(); // konwertacja danych do obiketu JSON
                setBooks(result);
            } catch(error){
                setError(error.message);
            } finally{
                setLoading(false);
            }
        };
        wszystkieKsiazki();
    },[]); // [] to pusta tablica zaleznosci


    return(
        <>
        <MyNavbar/>

        {loading ? 
        <div className="text-center">
            <Spinner animation="border" variant="primary" />
        </div> : null}
        {error ? <Alert variant="danger">Wystąpił błąd: {error}</Alert> : null}
        {books.length>0 ? <div className="mt-3">
            <h1 className="text-center mb-3">Lista wszystkich książek:</h1>
            <Container className='d-flex flex-wrap justify-content-center align-items-center'>
                {books.map(book => (
                <div className="m-2" key={book._id.toString()}>
                    <BookCard book={book} />
                </div>
                ))}
            </Container>
        </div> : 
        <div className="container mt-3 text-center fs-3">
            <Alert variant="info">Nie znaleziono listy książek.</Alert>
        </div>}

        <MyFooter/>
        </>
    )
}

export default AllBooksPage;
