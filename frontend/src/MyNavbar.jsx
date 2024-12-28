import { Navbar, Nav, Container, Form, FormControl, Button, Dropdown, DropdownMenu, Image} from 'react-bootstrap';
import { Link } from 'react-router-dom';

/*
{ Nagłówek strony }
<Container className="text-center my-4">
<h1 className="text-white">Księgarnia Online</h1>
<Form className="d-flex justify-content-center mt-3">
    <FormControl
        type="search"
        placeholder="Szukaj książek..."
        className="me-2"
        aria-label="Search"
        style={{ maxWidth: '500px' }}
    />
    <Button variant="outline-success">Szukaj</Button>
    <Button variant="primary">Szukaj</Button>
</Form>
</Container>
*/

export function MyNavbar(){
    return (
        <>

        {/* prziciski logowanie, rejestracja, koszyk nad paskiem nawigacyjnym */}
        <div className="d-flex flex-row justify-content-end bg-dark px-4 pt-3">
            {/* przycisk koszyka wraz z ikona */}
            <Link to="/koszyk" className="btn btn-outline-light me-2 d-flex align-items-center justify-content-center">
                <Image src="/img/icons8-basket-48.png" />Koszyk
            </Link>
            {/* przycisk do strony logowania */}
            <Link to="/logowanie" className="btn btn-outline-light me-2 d-flex align-items-center justify-content-center">Logowanie</Link>
            {/* przycisk do strony rejestracji */}
            <Link to="/rejestracja" className="btn btn-outline-light d-flex align-items-center justify-content-center">Rejestracja</Link>
        </div>

        {/* pasek nawigacyjny */}
        <Navbar bg="dark" variant="dark" expand="lg" className='flex-column'>
            <Container className='d-flex flex-column align-items-center mt-3 mb-3'>
                <h1 className="text-white">Księgarnia Skrzat <Image src="/img/icons8-dwarf-64.png" fluid></Image></h1>
            </Container>
            <Container className='d-flex flex-column align-items-center mt-3 mb-3'>
                <Form className="d-flex justify-content-center w-100">
                    <FormControl
                        type="search"
                        placeholder="Szukaj książek..."
                        className="me-2"
                        aria-label="Search"
                        style={{ width: '50%' }}
                    />
                    <Button variant="primary">Szukaj</Button>
                </Form>
            </Container>
            

            <Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto">
                        <Nav.Link as={Link} to="/">Strona Główna</Nav.Link>
                        <Dropdown>
                            <Dropdown.Toggle as={Nav.Link} id="dropdown-categories">
                                Kategorie
                            </Dropdown.Toggle>
                            <DropdownMenu>
                                <Dropdown.Item href="#fantasy">Fantastyka</Dropdown.Item>
                                <Dropdown.Item href="#przygoda">Przygodowa</Dropdown.Item>
                                <Dropdown.Item href="#nauka">Nauka</Dropdown.Item>
                                <Dropdown.Item href="#historia">Historia</Dropdown.Item>
                                <Dropdown.Item href="#kryminal">Kryminał</Dropdown.Item>
                                <Dropdown.Item href="#biografie">Biograficzne</Dropdown.Item>
                            </DropdownMenu>
                        </Dropdown>
                        <Nav.Link as={Link} to="/bestsellers">Bestsellery</Nav.Link>
                        <Nav.Link as={Link} to="/kontakt">Kontakt</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>

        </>
    );
}

/*
export function MyNavbar(){
    return(
        <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="#home">Księgarnia Supreme</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
            <Nav.Link href="#opcja1">Opcja 1</Nav.Link>
            <Nav.Link href="#opcja2">Opcja 2</Nav.Link>
            <Nav.Link href="#opcja3">Opcja 3</Nav.Link>
            <Nav.Link href="https://www.google.com">Opcja 4</Nav.Link>
            </Nav>
        </Navbar.Collapse>
        </Navbar>
    );
}


{ Treść strony głównej }
<Container className="mt-4">
<h1>Witamy w naszej księgarni!</h1>
<p>
    Znajdź książki, które pokochasz. Przeglądaj nasze kategorie, bestsellerowe pozycje, 
    a także nowości wydawnicze.
</p>
<h2>Kategorie</h2>
<p>Przykładowe kategorie: Literatura piękna, Fantastyka, Nauka, Książki dla dzieci...</p>

<h2>Bestsellery</h2>
<p>Sprawdź, co czytelnicy wybierają najczęściej!</p>

<h2>Kontakt</h2>
<p>Masz pytania? Skontaktuj się z nami pod adresem kontakt@ksiegarnia.pl.</p>
</Container>
*/