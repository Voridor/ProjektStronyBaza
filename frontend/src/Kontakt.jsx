import { MyFooter } from "./MyFooter";
import { MyNavbar } from "./MyNavbar";
import { Container, Carousel } from 'react-bootstrap';

export function Kontakt() {

    // Lista zdjęć w sliderze
    const images = [
        'https://mdbootstrap.com/img/Photos/Slides/img%20(35).jpg',
        'https://mdbootstrap.com/img/Photos/Slides/img%20(33).jpg',
    ];

    return (
        <>
        <MyNavbar/>
        <div>
            <h2>Kontakt</h2>
            <p>Masz pytania? Skontaktuj się z nami pod adresem kontakt@ksiegarnia.pl</p>

            <Container className="mt-5">
                <Carousel interval={3000} controls={true} indicators={true}>
                    {images.map((image, index) => (
                        <Carousel.Item key={index}>
                            <img className="d-block w-100" src={image}/>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </Container>

        </div>
        <MyFooter/>
        </>
    );
}
  
export default Kontakt;