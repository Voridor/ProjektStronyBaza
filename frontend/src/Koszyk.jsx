import { useState, useEffect } from 'react';
import { Container, Button, Alert, Spinner, Table, Image, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';


// filozofia jest taka, że każdy użytkownik ma tylko jeden koszyk (o statusie otwartym) w bazie danych i tam w tabeli sa przechowywane ksiazki

function Koszyk(){
    const [cart, setCart] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showModal, setShowModal]=useState(false);
    const navigate=useNavigate();
    // pobieranie zawartości koszyka
    /* useEffect jest uzywane do uruchomienia funkcji po pierwszym renderowaniu komponentu,
    poniewaz tablica zaleznosci jest pusta, efekt zostanie uruchomiony tylko raz, co dobrze
    pasuje do jednorazowego pobrania danych z API po zaladowaniu komponentu
    */
    const [rabatProcent, setRabatProcent]=useState(0);

    useEffect(() => {
        const token=localStorage.getItem('token');
        setIsLoggedIn(!!token);

        const fetchCart = async () => {
            setLoading(true);
            setError(null); // resetowanie bledu przed wysłaniem
            try {
                const response = await fetch('http://localhost:5000/api/cart', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                if (!response.ok) {
                    const errorCode=response.status;
                    if(errorCode!=404){
                        throw new Error('Nie udało się pobrać zawartości koszyka.');
                    }
                }
                const data = await response.json(); // konwertowanie odpowiedzi na obiekt JSON
                setCart(data); // Ustawienie koszyka w stanie 
            } catch (error) {
                setError(error.message); // Ustawienie błędu w przypadku niepowodzenia
            } finally {
                setLoading(false);
            }
        };

        if(!!token === true){ // wykona sie tylko gdy uzytkownik jest zalogowany
            fetchCart(); // wywolanie funkcji, która pobiera dane koszyka
            if(cart.length>0){
                dawajRabat();
            }
        }
    }, [cart.length]);



    // Usuwanie produktu z koszyka
    const removeFromCart = async (productId) => {
        const token=localStorage.getItem('token');
        setLoading(true);
        setError(null); // Resetowanie błędu przed wysłaniem
        try {
            const response = await fetch(`http://localhost:5000/api/cart/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error('Nie udało się usunąć produktu z koszyka.');
            }
            const updatedCart = await response.json(); // Zaktualizowany koszyk
            setCart(updatedCart); // Ustawienie nowego koszyka
            navigate(0); // po usunieciu przeladowuje strone, aby sie obrazki na nowo wczytaly
        } catch (error) {
            setError(error.message); // Ustawienie błędu w przypadku niepowodzenia
        } finally {
            setLoading(false);
        }
    };


    // zmniejszanie ilosci danej ksiazki w koszyku
    const mniejKsiazki = async (productId) => {
        const token=localStorage.getItem('token');
        setLoading(true);
        setError(null); // Resetowanie błędu przed wysłaniem
        try {
            const response = await fetch(`http://localhost:5000/api/cart/zmniejsz-book/${productId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error(response.message);
            }
            const updatedCart = await response.json(); // Zaktualizowany koszyk
            setCart(updatedCart); // Ustawienie nowego koszyka
            navigate(0); // przeladowuje strone, aby sie obrazki na nowo wczytaly
        } catch (error) {
            setError(error.message); // Ustawienie błędu w przypadku niepowodzenia
        } finally {
            setLoading(false);
        }
    };


    // zwiekszanie ilosci ksiazki w koszyku
    const wiecejKsiazki = async (productId) => {
        const token=localStorage.getItem('token');
        setLoading(true);
        setError(null); // Resetowanie błędu przed wysłaniem
        try {
            const response = await fetch(`http://localhost:5000/api/cart/zwieksz-book/${productId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error(response.message);
            }
            const updatedCart = await response.json(); // Zaktualizowany koszyk
            setCart(updatedCart); // Ustawienie nowego koszyka
            navigate(0); // przeladowuje strone, aby sie obrazki na nowo wczytaly
        } catch (error) {
            setError(error.message); // Ustawienie błędu w przypadku niepowodzenia
        } finally {
            setLoading(false);
        }
    };



    // Skladanie zamowienia
    const zlozZamowienie=async()=>{
        const token=localStorage.getItem('token');
        setLoading(true);
        setError(null); // Resetowanie błędu przed wysłaniem
        try {
            const response = await fetch("http://localhost:5000/api/cart-zamow", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (!response.ok) {
                throw new Error('Nie udało się złożyć zamówienia.');
            }
            const updatedCart = await response.json(); // Zaktualizowany koszyk
            setCart(updatedCart); // Ustawienie nowego koszyka
        } catch (error) {
            setError(error.message); // Ustawienie błędu w przypadku niepowodzenia
        } finally {
            setLoading(false);
            handleClose();
        }
    };



    // pobranie wielkosci w % rabatu z backendu
    const dawajRabat=async()=>{
        const token=localStorage.getItem('token');
        setError(null);
        try{
            const response=await fetch("http://localhost:5000/api/klient-rabat", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (!response.ok) {
                throw new Error('Nie udało się pobrać rabatu.');
            }
            const wielkoscRabatu=await response.json();
            setRabatProcent(wielkoscRabatu[0].rabat);
        } catch(error){
            setError(error.message);
        }
    };



    const cenaAllProdukty=()=>{
        let suma=0;
        cart.forEach((item)=>{
            suma+=item.cena*item.ilosc;
        });
        return suma.toFixed(2);
        //return cart.reduce((total, item) => total + item.cena * item.ilosc, 0).toFixed(2);
    };


    const cenaPoRabacie=()=>{
        let oldCena=Number(cenaAllProdukty());
        let newCena=oldCena*((100-rabatProcent)/100);
        return newCena.toFixed(2);
    };


    const handleShow=()=>{
        setShowModal(true);
    };
    
    const handleClose=()=>{
        setShowModal(false);
    };


    return (
        <>

        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Podejmij decyzje</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Czy chcesz dokonać zamówienia co wiąże się z obowiązkiem zapłaty?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Zamknij</Button>
                <Button variant="primary" onClick={zlozZamowienie}>Tak, płace</Button>
            </Modal.Footer>
        </Modal>




        <div className='bg-dark text-white' style={{minHeight: '100vh'}}>
            <Container>
                <div className='d-flex justify-content-between w-100 py-4'>
                    <h1>Twój Koszyk:</h1>
                    {isLoggedIn ?
                    <Link to="/shophistory" className="btn btn-outline-light d-flex align-items-center justify-content-center">Historia zamówień</Link>
                    : null}
                </div>
                

                {/* wyswietlenie alertu o potencjalnym problemie/bledzie */}
                {error && <Alert variant="danger">{error}</Alert>}

                {/* wyswietlanie produktow dodanych do koszyka tylko dla zalogowanych */}
                {isLoggedIn ?
                (loading ? (
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : cart.length > 0 ? (

                    <>
                    <Table striped bordered hover>
                        <thead>
                            <tr className='text-center'>
                                <th>Zdjęcie okładki:</th>
                                <th>Tytuł:</th>
                                <th>Cena za sztukę:</th>
                                <th>Ilość:</th>
                                <th>Cena łączna:</th>
                                <th>Opcja:</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map(item => (
                                <tr key={item.book_id}>
                                    <td className='text-center'>
                                        <Image src={item.okladka_adres} alt={item.tytul} thumbnail style={{ width: '150px' }} />
                                    </td>
                                    <td className='text-center align-middle'>{item.tytul}</td>
                                    <td className='text-center align-middle'>{item.cena} zł</td>
                                    <td className='text-center align-middle'>
                                        <Button variant="danger" className='me-3' onClick={() => mniejKsiazki(item.book_id)} disabled={loading}>-</Button>
                                        <span className='me-3'>{item.ilosc}</span>
                                        <Button variant="success" onClick={() => wiecejKsiazki(item.book_id)} disabled={loading}>+</Button>
                                    </td>
                                    <td className='text-center align-middle'>{(item.cena * item.ilosc).toFixed(2)} zł</td>
                                    <td className='text-center align-middle'>
                                        <Button variant="danger" onClick={() => removeFromCart(item.book_id)} disabled={loading}>Usuń</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <div className="text-end">
                        <h4>Suma: {cenaAllProdukty()} zł</h4>
                        <h4>Rabat: {rabatProcent}%</h4>
                        <h4>Kwota po rabacie: {cenaPoRabacie()}</h4>
                        <Button variant="primary" className='fw-bold w-25 mt-2' onClick={handleShow}>Zapłać</Button>
                    </div>
                    </>

                ) : (<Alert variant="info">Twój koszyk jest pusty.</Alert>))
                : <Alert variant="info">Aby korzystać z koszyka zaloguj się.</Alert>}

                {/* przycisk powrotu do strony glownej */}
                <Link to="/" className="btn btn-outline-light w-100 mt-4 fw-bold mb-4">Powrót do strony księgarni</Link>
            </Container>
        </div>
        </>
    );
}


export default Koszyk;
