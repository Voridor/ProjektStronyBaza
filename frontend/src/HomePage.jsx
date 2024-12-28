//import { useState } from 'react'
/*import './App.css' w main.jsx jest bootstrapowy css importowany, 
wiec ten tutaj sie naklada dodatkowo*/
//import {Navbar} from './Navbar.jsx'
import { Carousel } from 'react-bootstrap';
import {BookList} from './BookList.jsx'
import { MyFooter } from './MyFooter.jsx'
import {MyNavbar} from './MyNavbar.jsx'

export function HomePage() {
  // lista zdjec do slidera
  const images = [
    'img/banner-books.jpg',
    'img/book-wall.jpg',
    'img/bookandglasses.jpg'
  ];

  return (
    <>

      <MyNavbar></MyNavbar>

      {/* slider na stronie glownej */}
      <div>
          <Carousel interval={3000} controls={true} indicators={true}>
              {images.map((image, index) => (
                  <Carousel.Item key={index}>
                      <img className="d-block w-100" src={image}/>
                  </Carousel.Item>
              ))}
          </Carousel>
      </div>

      <div className="container mt-5">
        <h1 className='text-center'>Nowości:</h1>
        <BookList/>
      </div>
      <MyFooter/>
      
    </>
  )
};

export default HomePage;



/*
<div>
  <Navbar />
  <div className="container mt-5">
    <h1>Nasza Księgarnia</h1>
    <BookList />
  </div>
</div>

<Container className="mt-5">
    <Carousel interval={3000} controls={true} indicators={true}>
        {images.map((image, index) => (
            <Carousel.Item key={index}>
                <img className="d-block w-100" src={image}/>
            </Carousel.Item>
        ))}
    </Carousel>
</Container>
*/
