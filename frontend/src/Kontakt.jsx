import { MyFooter } from "./MyFooter";
import { MyNavbar } from "./MyNavbar";
import { Container } from 'react-bootstrap';

export function Kontakt() {

    return (
        <>
        
        <div className="bg-light">
        <MyNavbar/>
        <Container className="justify-content-center p-1 mt-4 fs-5">
            <h1>Kontakt</h1>
            <p>Witaj na stronie naszej księgarni! Jesteśmy do Państwa dyspozycji i chętnie pomożemy 
                w kwestiach dotyczących naszych produktów, zamówień czy dostępności książek. 
                Jeśli masz pytania, skontaktuj się z nami za pomocą poniższych danych.</p>
            <h2>Adres</h2>
            <p>Księgarnia Skrzat</p>
            <p>ul. Kwiatowa 34</p>
            <p>11-115 Warszawa, Polska</p>

            <h2>Godziny otwarcia</h2>
            <ul>
                <li>Poniedziałek - Piątek 8:00 - 20:00</li>
                <li>Sobota 8:00 - 16:30</li>
            </ul>

            <h2>Telefon</h2>
            <p>Masz pytania dotyczące zakupu przez stronę internetową lub odnośnie naszej oferty? Zadzwoń do nas:</p>
            <p className="fw-bold">+48 123 456 789</p>

            <h2>Email</h2>
            <p>Masz pytania? Skontaktuj się z nami pod adresem kontakt@ksiegarniaskrzat.pl</p>

        </Container>
        <MyFooter/>
        </div>
        
        </>
    );
}
  
export default Kontakt;