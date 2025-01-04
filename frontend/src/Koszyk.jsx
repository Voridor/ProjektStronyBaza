import { useState, useEffect } from 'react';
import { Container, ListGroup, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Koszyk(){
    const [cart, setCart] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // pobieranie zawartości koszyka
    /* useEffect jest uzywane do uruchomienia funkcji po pierwszym renderowaniu komponentu,
    poniewaz tablica zaleznosci jest pusta, efekt zostanie uruchomiony tylko raz, co dobrze
    pasuje do jednorazowego pobrania danych z API po zaladowaniu komponentu
    */

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
                    throw new Error('Nie udało się pobrać zawartości koszyka.');
                }
                const data = await response.json(); // konwertowanie odpowiedzi na obiekt JSON

                //console.log(data);

                setCart(data); // Ustawienie koszyka w stanie 
            } catch (error) {
                setError(error.message); // Ustawienie błędu w przypadku niepowodzenia
            } finally {
                setLoading(false);
            }
        };

        if(!!token === true){ // wykona sie tylko gdy uzytkownik jest zalogowany
            fetchCart(); // wywolanie funkcji, która pobiera dane koszyka
        }
    }, []);



    // Usuwanie produktu z koszyka
    const removeFromCart = async (productId) => {
        setLoading(true);
        setError(null); // Resetowanie błędu przed wysłaniem

        try {
            const response = await fetch(`http://localhost:5000/api/cart/${productId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Nie udało się usunąć produktu z koszyka.');
            }
            const updatedCart = await response.json(); // Zaktualizowany koszyk
            setCart(updatedCart); // Ustawienie nowego koszyka
        } catch (error) {
            setError(error.message); // Ustawienie błędu w przypadku niepowodzenia
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <div className='bg-dark text-white' style={{minHeight: '100vh'}}>
            <Container>
                <h1 className="py-4">Twój Koszyk</h1>

                {/* wyswietlenie alertu o potencjalnym problemie/bledzie */}
                {error && <Alert variant="danger">{error}</Alert>}

                {/* wyswietlanie produktow dodanych do koszyka tylko dla zalogowanych */}
                {isLoggedIn ?
                (loading ? (
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : cart.length > 0 ? (
                    <ListGroup>


                    {/** tu sie dzieje przerabianie */}

                    {cart.map(item => (
                        <ListGroup.Item key={item.productId} className='bg-primary'>
                        <Row>
                            <Col md={8}>
                                <strong>{item.name}</strong> - {item.price}$
                            </Col>
                            <Col md={4} className="text-right">
                                <Button variant="danger" onClick={() => removeFromCart(item.productId)} disabled={loading}>Usuń</Button>
                            </Col>
                        </Row>
                        </ListGroup.Item>
                    ))}






                    </ListGroup>
                ) : (<Alert variant="info">Twój koszyk jest pusty.</Alert>))
                : <Alert variant="info">Aby korzystać z koszyka zaloguj się.</Alert>}

                {/* przycisk powrotu do strony glownej */}
                <Link to="/" className="btn btn-outline-light w-100 mt-4 fw-bold">Powrót do strony księgarni</Link>
            </Container>
        </div>
        </>
    );
}


export default Koszyk;
