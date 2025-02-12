import { useState } from 'react';
import { Button, Form, Container, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export function Logowanie() {
    // deklaracja zmiennych stanowych wraz z ich 'setterami'
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); /* poczatkowa wartosc zmiennej stanowej to bedzie false,
    loading to aktualna wartosc zmiennej stanowej, a setLoading to setter (funkcja ktora ja aktualizuje) dla niej
    */
    const [successLogin, setSuccessLogin] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); // ustawienie zmiannej stanowej loading na true, aby zablokowac przycisk w kodzie nizej
        setError(null); // resetowanie bledu przed wyslaniem danych
        setSuccessLogin(false);
        // przygotowanie danych do wyslania (tworzymy obiekt z danymi)
        const daneLogowania = {
            username: username,
            password: password
        };

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(daneLogowania),
            });

            if (!response.ok) {
                throw new Error('Podałeś nieprawidłowy login lub hasło. Popraw to!');
            }

            // gdy logowanie sie uda ustawiamy token
            const data = await response.json();
            localStorage.setItem('token', data.token);
            setSuccessLogin(true);
            //onLogin(); - to raczej do kasacji
        } catch (error) {
            setError(error.message); // ustawienie bledu w przypadku niepowodzenia
        } finally {
            setLoading(false);
        }
    };

  return (
    <>
    <div className='bg-dark text-white'>
        <Container className="justify-content-center align-items-center py-5 w-25" style={{height:'100vh'}}>
            <h1 className="text-center mb-3">Logowanie</h1>
            {/* gdy blad istnieje to renderujemy alert, jak go nie ma to nic nie robimy*/}
            {error ? <Alert variant="danger" dismissible>{error}</Alert> : null}
            {/* gdy poprawnie zalogowano to renderujemy alert, ktory o tym informuje */}
            {successLogin ? <Alert variant="success" dismissible>Poprawnie zalogowano.</Alert> : null}

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formUsername">
                    <Form.Label className='fs-4'>Login:</Form.Label>
                    <Form.Control
                    type="text"
                    placeholder="Podaj login"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mt-3">
                    <Form.Label className='fs-4'>Hasło:</Form.Label>
                    <Form.Control
                    type="password"
                    placeholder="Podaj hasło do konta"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-4 fw-bold" disabled={loading || successLogin}>
                    {loading ? 'Logowanie...' : 'Zaloguj się'}
                </Button>

                {/* przycisk powrotu do strony glownej */}
                <Link to="/" className="btn btn-outline-light w-100 mt-4 fw-bold">Powrót do strony księgarni</Link>
            </Form>
        </Container>
    </div>
    </>
  );
};

export default Logowanie;

