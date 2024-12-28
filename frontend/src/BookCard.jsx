//import React from 'react';

export function BookCard({ book }) {
  return (
    <div className="card" style={{ width: '18rem', height: '31rem' }}>
      <img src={book.image} className="card-img-top image-fluid" alt={`Okładka książki ${book.title} `} />
      <div className="card-body text-center">
        <h5 className="card-title text-center">{book.title}</h5>
        <p className="card-text"><strong>Autor:</strong> {book.author}</p>
        <p className="card-text"><strong>Cena:</strong> {book.price} zł</p>
        <button className="btn btn-primary">Dodaj do koszyka</button>
      </div>
    </div>
  );
}

export default BookCard;

//<div className="card-body text-center d-flex flex-column justify-content-center align-items-center">