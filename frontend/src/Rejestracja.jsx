import { useState } from 'react';
import { Button, Form, Container, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export function Rejestracja() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successRegister, setSuccessRegister] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        // walidacja hasełka
        if (password !== confirmPassword) {
            setError('Hasła nie są identyczne.');
            return;
        }
        // walidacja formatu e-maila
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(email)) {
            setError('Proszę wprowadzić prawidłowy adres e-mail.');
            return;
        }
        setLoading(true);
        setError(null); // resetowanie błędu przed wysłaniem
        setSuccessRegister(false);
        // przygotowanie danych do wysłania (pakowanie ich w obiekt)
        const userData = {
            username: username,
            password: password,
            email: email,
            name: name,
            surname: surname
        };
        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST', // ta metoda wysyla dane na serwer
                headers: {
                'Content-Type': 'application/json', // to jest zdefiniowany naglowek jaki jest wysylany
                },
                body: JSON.stringify(userData), // dane sa wysylane w formacie JSON
            });

            if (!response.ok){
                const blad=await response.json();
                throw new Error(blad.message);
                //throw new Error('Wystąpił błąd podczas rejestracji.');
            }
            setSuccessRegister(true);
            // można dodac przekierowanie na strone główną
        } catch (error) {
            setError(error.message); // ustawienie błędu w przypadku niepowodzenia
        } finally {
            setLoading(false);
        }
    };

  return (
    <>
    <div className='bg-dark text-white'>
        <Container className="justify-content-center align-items-center py-5 w-25" style={{minHeight: '100vh'}}>
            <h1 className="text-center mb-3">Rejestracja</h1>
            {/* gdy blad istnieje to renderujemy alert, jak go nie ma to nic nie robimy, bo po co */}
            {error ? <Alert variant="danger" dismissible>{error}</Alert> : null}
            {/* gdy poprawnie zalogowano to renderujemy alert, ktory o tym informuje */}
            {successRegister ? <Alert variant="success" dismissible>Utworzono konto.</Alert> : null}
            
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

                <Form.Group controlId="formEmail" className="mt-3">
                    <Form.Label className='fs-4'>E-mail:</Form.Label>
                    <Form.Control
                    type="email"
                    placeholder="Podaj adres e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                </Form.Group>

                <Form.Group controlId="formName" className="mt-3">
                    <Form.Label className='fs-4'>Imie:</Form.Label>
                    <Form.Control
                    type="text"
                    placeholder="Podaj imie"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    />
                </Form.Group>

                <Form.Group controlId="formSurname" className="mt-3">
                    <Form.Label className='fs-4'>Nazwisko:</Form.Label>
                    <Form.Control
                    type="text"
                    placeholder="Podaj nazwisko"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    required
                    />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mt-3">
                    <Form.Label className='fs-4'>Hasło:</Form.Label>
                    <Form.Control
                    type="password"
                    placeholder="Podaj hasło"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                </Form.Group>

                <Form.Group controlId="formConfirmPassword" className="mt-3">
                    <Form.Label className='fs-4'>Powtórz hasło:</Form.Label>
                    <Form.Control
                    type="password"
                    placeholder="Powtórz hasło"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-4 fw-bold" disabled={loading}>
                    {loading ? 'Rejestrowanie...' : 'Zarejestruj się'}
                </Button>
                
                {/* przycisk powrotu do strony glownej */}
                <Link to="/" className="btn btn-outline-light w-100 mt-4 fw-bold">Powrót do strony księgarni</Link>
            </Form>
        </Container>
    </div>
    </>
  );
};

export default Rejestracja;

