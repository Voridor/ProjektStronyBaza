//import React from 'react';
import { Container } from 'react-bootstrap';
import BookCard from './BookCard';

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

export function BookList() {
  return (
    <>
    <Container className='d-flex flex-wrap justify-content-center align-items-center'>
        {books.map(book => (
          <div className="m-2" key={book.id}>
            <BookCard book={book} />
          </div>
        ))}
    </Container>
    </>
  );
}

export default BookList;

/*
<div className="row">
  {books.map(book => (
    <div className="col-12 col-sm-4 col-md-3 mb-4" key={book.id}>
      <BookCard book={book} />
    </div>
  ))}
</div>
*/
