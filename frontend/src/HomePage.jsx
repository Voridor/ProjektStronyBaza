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

        {/* lista nowosci wsrod ksiazek */}
        <div className="container mt-3">
          <h1 className='text-center mb-3'>Nowości w naszej ofercie:</h1>
          <BookList/>
        </div>
        <MyFooter/>
        
      </>
    )
};

export default HomePage;

