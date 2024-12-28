import {Container} from "react-bootstrap";

export function MyFooter(){
    return(
        <>
            {/* Stopka */}
            <footer className="bg-dark text-white p-4 mt-4">
            <Container className="text-center">
                <p><a href="#privacy" className="text-light">Polityka prywatności</a> | <a href="#regulamin" className="text-light">Regulamin sklepu</a></p>
                <p>Księgarnia Skrzat</p> 
                <p>Wszystkie prawa zastrzeżone &copy;2024.</p>
            </Container>
            </footer>
        </>
    );
};