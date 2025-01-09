import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

export function BookCard({ book }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal]=useState(false);
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState(null);

  useEffect(()=>{
      const token=localStorage.getItem('token');
      setIsLoggedIn(!!token);
  },[]);

  const handleShow=()=>{
    setShowModal(true);
  };

  const handleClose=()=>{
    setShowModal(false);
    setInputValue("");
    setResult(null);
  };

  const handleSubmit=async(event)=>{
    event.preventDefault();
    if(!isNaN(inputValue) && inputValue.trim()!==""){
      let ilosc=parseInt(inputValue);
      const token=localStorage.getItem('token');
      const obj={
        ilosc: ilosc
      };
      try{
        const response=await fetch(`http://localhost:5000/api/cart-add/${book._id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(obj),
        });
        if(!response.ok){
          const blad=await response.json();
          throw new Error(blad.message);
        }
        setResult("Produkt został dodany do koszyka");
      } catch(error){
        setResult(error.message);
      }
    }
    else{
      setResult("Podaj liczbę sztuk.");
    }
  };

  return (
    <>

    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        {isLoggedIn ? (
        <Modal.Title>Podaj ilość książek</Modal.Title>
        ) : (<Modal.Title>Komunikat</Modal.Title>)}
      </Modal.Header>
      <Modal.Body>
        {isLoggedIn ? (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Podaj liczbę:</Form.Label>
            <Form.Control
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ile sztuk?"
            />
          </Form.Group>
          {result && <p>{result}</p>}
        </Form>
        ) : (
          <p>Ta akcja wymaga zalogowania.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Zamknij</Button>
        {isLoggedIn ? (
        <Button variant="primary" onClick={handleSubmit}>Dodaj do koszyka</Button>
        ) : null}
      </Modal.Footer>
    </Modal>


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
      </div>
      <div className="text-center mb-4">
        <Button variant="primary" onClick={handleShow} className="" >Dodaj do koszyka</Button>
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