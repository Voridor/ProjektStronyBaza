import { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Form, FormControl, Button, Dropdown, DropdownMenu, Image, Col, Alert} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';


export function MyNavbar(){
    const [searchText, setSearchText]=useState(""); // wyszukiwany tekst z pola
    const [searchingType, setSearchingType]=useState(""); // rodzaj wyszukiwania wybrany z listy
    const [loading, setLoading]=useState(false);
    //const [books, setBooks]=useState([]); // te zmienne mialy przechoywac ksiazki pobrane z danych ale ze wzgledu na 
    // asynchroniczność setBooks to nie nadąża przypisać dane do books i przekazuje czaasmi pustą tablice
    const [error, setError]=useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate=useNavigate(); // hook potrzebny do nawigacji, czyli do pozniejszego przekierowanie na strone wynikow

    useEffect(()=>{
        const token=localStorage.getItem('token');
        setIsLoggedIn(!!token);
    },[]);


    // funkcja, ktora obsluguje wyszukiwanie z pola tekstowego
    const wyszukuj=async()=>{
        if(!searchText || loading){
            return;
        }
        setError(null); // ustawiamy brak bledu, aby znikal blad wygenerowany wczesniej bez odświeżania strony
        setLoading(true);
        try{
            let url="";
            if(searchingType==="tytul"){
                url=`http://localhost:5000/api/ksiazki-tytul?tytul=${searchText}`;
            } else if(searchingType==="autorek"){
                url=`http://localhost:5000/api/ksiazki-autor?autor=${searchText}`;
            } else{
                throw new Error("Wybierz rodzaj wyszukiwania.");
            }

            const response=await fetch(url, {method: "GET", headers: {
                'Cache-Control': 'no-cache' // wylaczenie cache
            }});
            if(!response.ok){ // gdy odpowiedz nie jest ok to wywalamy errora
                throw new Error("Błąd pobrania danych.");
            }
            const result=await response.json(); // konwertacja danych do obiketu JSON

            //setBooks(result); to nie chce dzialac, bo setBooks jest asynchroniczne i nie nadąża z aktualizacją danych przed wyslaniem, 
            // dlatego lepiej przekazac od razu result i po problemie

            setLoading(false);

            // po uzyskaniu wynikow z bazy przekierowujemy na strone z reprezentacja tych wynikow
            navigate("/searchresult", { state: { wynik: result, rodzajWyszukiwania: "autorOrTytul" } });
        } catch(error){
            setLoading(false); // w razie bledu tez zmieniamy stan loading
            setError(error.message);
        }
    };


    // funkcja do obslugi wyszukiwania z menu kategorii, wyszukuje po kategoriach książki
    const wyszukajPoKategorii=async(category)=>{
        if(loading){
            return;
        }
        setError(null); // ustawiamy brak bledu, aby znikal blad wygenerowany wczesniej bez odświeżania strony
        setLoading(true);
        try{
            const response=await fetch(`http://localhost:5000/api/ksiazki-kategoria?kategoria=${category}`, {
                method: "GET",
                headers: { "Cache-Control": "no-cache" }
            });
            if(!response.ok){
                throw new Error("Błąd pobrania danych.");
            }
            const result=await response.json(); // konwertujemy dane na obiekt JSON
            setLoading(false);
            // przekierowujemy do strony, ktora zaprezentuje wyniki
            navigate("/searchresult", { state: { wynik: result, rodzajWyszukiwania: "poKategorii", kategoria: category } });
        } catch(error){
            setLoading(false);
            setError(error.message);
        }
    };

    
    const wyloguj=async()=>{
        try{
            localStorage.removeItem('token');
            setIsLoggedIn(false);
            // mozna dodac wyslanie zadania wylogowania do backendu
            // np. await fetch('/logout', { method: 'POST' });
        } catch(error){
            setError(error.message);
        }
    };


    return (
        <>

        {/* prziciski logowanie, rejestracja, koszyk nad paskiem nawigacyjnym */}
        <div className="d-flex flex-row justify-content-end bg-dark px-4 pt-3">
            {/* przycisk koszyka wraz z ikona */}
            <Link to="/koszyk" className="btn btn-outline-light me-2 d-flex align-items-center justify-content-center">
                <Image src="/img/icons8-basket-48.png" />Koszyk
            </Link>

            {/* przyciski logowania i rejestracji sa widoczne, gdy nie jestesmy zalogowani */}
            {isLoggedIn ? 
            <Button variant="outline-light" className='d-flex align-items-center justify-content-center' onClick={wyloguj}>Wyloguj</Button>
            :(<>
            <Link to="/logowanie" className="btn btn-outline-light me-2 d-flex align-items-center justify-content-center">Logowanie</Link>
            <Link to="/rejestracja" className="btn btn-outline-light d-flex align-items-center justify-content-center">Rejestracja</Link>
            </>)}
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
                        value={searchText}
                        onChange={(e)=>setSearchText(e.target.value)}
                    />
                    
                    <Col xs={2} className='me-2'>
                        <Form.Select
                            value={searchingType}
                            onChange={(e)=>setSearchingType(e.target.value)} >
                            <option value="">Szukaj po</option>
                            <option value="tytul">Tytuł książki</option>
                            <option value="autorek">Nazwisko autora</option>
                        </Form.Select>
                    </Col>

                    <Button variant="primary" onClick={wyszukuj} disabled={loading}>{loading ? "Wyszukiwanie..." : "Szukaj"}</Button>
                </Form>
            </Container>
            
             
            {error ? 
            <Container className='d-flex flex-column align-items-center'>
                <Alert variant="danger" onClose={() => setError(null)} dismissible>Wystąpił błąd: {error}</Alert>
            </Container> : null}


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
                                {/* te nazwy kategorii tutaj podawane w wywołaniu funkcji muszą być pisane małą literą */}
                                <Dropdown.Item onClick={()=>wyszukajPoKategorii("fantastyka")}>Fantastyka</Dropdown.Item>
                                <Dropdown.Item onClick={()=>wyszukajPoKategorii("przygodowa")}>Przygodowa</Dropdown.Item>
                                <Dropdown.Item onClick={()=>wyszukajPoKategorii("nauka")}>Nauka</Dropdown.Item>
                                <Dropdown.Item onClick={()=>wyszukajPoKategorii("młodzieżowa")}>Młodzieżowa</Dropdown.Item>
                                <Dropdown.Item onClick={()=>wyszukajPoKategorii("historia")}>Historia</Dropdown.Item>
                                <Dropdown.Item onClick={()=>wyszukajPoKategorii("kryminał")}>Kryminał</Dropdown.Item>
                                <Dropdown.Item onClick={()=>wyszukajPoKategorii("biograficzne")}>Biograficzne</Dropdown.Item>
                                <Dropdown.Item onClick={()=>wyszukajPoKategorii("thriller")}>Thriller</Dropdown.Item>
                                <Dropdown.Item onClick={()=>wyszukajPoKategorii("sensacja")}>Sensacja</Dropdown.Item>
                            </DropdownMenu>
                        </Dropdown>
                        <Nav.Link as={Link} to="/bestsellers">Bestsellery</Nav.Link>
                        <Nav.Link as={Link} to="/allbookspage">Wszystkie książki</Nav.Link>
                        <Nav.Link as={Link} to="/kontakt">Kontakt</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>

        </>
    );
}

