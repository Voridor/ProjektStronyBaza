import { MyFooter } from "./MyFooter";
import { MyNavbar } from "./MyNavbar";
import { Container } from 'react-bootstrap';

export function Kontakt() {

    // Lista zdjęć w sliderze

    return (
        <>
        <MyNavbar/>

        <div className="bg-primary">
        <Container className="text-center">
            <h2 className="text-center">Kontakt</h2>
            <p>Masz pytania? Skontaktuj się z nami pod adresem kontakt@ksiegarnia.pl</p>

        </Container>
        </div>
        <div>
            <h2>Kontakt</h2>
            <p>Masz pytania? Skontaktuj się z nami pod adresem kontakt@ksiegarnia.pl</p>

            

        </div>
        <MyFooter/>
        </>
    );
}
  
export default Kontakt;