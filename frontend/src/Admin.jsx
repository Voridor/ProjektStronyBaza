import { useEffect, useState } from 'react';
import { Container, Button, Spinner, Table, Form, Tabs, Tab, Alert, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Admin() {
    // trzeba sprawdzac czy uzytkownik to administrator, bo jak nie to ma nic nie widziec
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdministrator, setIsAdministrator] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    

    // funkcja do sprawdzenia czy uzytkownik to admin, bo jak nie to nie powinien widziec tej strony
    const checkAdmin = async () => {
        const token = localStorage.getItem('token');
        if (token !== null) {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:5000/api/isadmin`, {
                    method: 'GET',
                    headers: {'Authorization': `Bearer ${token}`,},
                });
                if (response.ok) {
                    if(response.statusText!=200){
                        setIsAdministrator(true);
                    }
                    // mozna zrobic, ze gdy nie admin to przekierowujemy na strone glowna
                    // setIsAdministrator(true); byl error w tym przypadku w konsoli przegladarki
                }
            } catch (error) {
                setError(error.message);
            } finally{
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
        checkAdmin(); // sprawdzamy czy uzytkownik jest administratorem
    }, []);


    




    return(
        <>
        <div className='bg-dark text-white' style={{minHeight: '100vh'}}>
            {error && <Alert variant="danger">{error}</Alert>}
            {isLoggedIn ? (isAdministrator ?
            (loading ? 
            <div className="text-center">
                <Spinner animation="border" variant="primary"></Spinner>
            </div>
            : 
            <>
            <div className='d-flex justify-content-between w-100 py-4'>
                <h1 className=''>Panel Administracyjny</h1>
                <Link to="/" className="btn btn-outline-light d-flex align-items-center justify-content-center">Strona główna</Link>
            </div>
            
            <Link to="/" className="btn btn-outline-light ">Strona główna</Link>
            <h1 className='text-white text-center py-3'>Panel Administracyjny</h1>
            <Container fluid className="px-4">
                <h2 className='pb-2'>Dostępne opcje:</h2>
                <Tabs defaultActiveKey="addBook" id="admin-panel-tabs" className="mb-3">
                    <Tab eventKey="addBook" title="Dodaj książkę">
                    <AddBookSection />
                    </Tab>
                    <Tab eventKey="viewBooks" title="Wyświetl książki">
                    <ViewBooksSection />
                    </Tab>
                    <Tab eventKey="topBuyers" title="Top 3 kupujących">
                    <TopBuyersSection />
                    </Tab>
                    <Tab eventKey="viewOrders" title="Podgląd zamówień">
                    <ViewOrdersSection />
                    </Tab>
                </Tabs>
            </Container>
            </>
            ) : <h2>nie jestes adminem i przeniesienie na strone glowna</h2>) : <h2>Nie jestes zalogowany i nie masz dostepu.</h2>}
        </div>
        </>
    );
};


const AddBookSection = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tytul, setTytul] = useState('');
    const [autorzy, setAutorzy] = useState([{ firstName: "", lastName: "" }]);
    const [cena, setCena]=useState(0);
    const [kategorie, setKategorie]=useState([""]);
    const [isbn, setIsbn]=useState('');
    const [ilosc, setIlosc]=useState(0);
    const [linkOkladka, setLinkOkladka]=useState('');
    const [dataWydania, setDataWydania]=useState('');
    const [show, setShow]=useState(false);


    const handleAddCategoryField=()=>{
        setKategorie([...kategorie, ""]);
    };

    const handleCategoryChange=(index, value)=>{
        const newCategories=[...kategorie];
        newCategories[index]=value;
        setKategorie(newCategories);
    };

    const handleAddAuthorField = () => {
        setAutorzy([...autorzy, { firstName: "", lastName: "" }]);
    };

    const handleAuthorChange = (index, field, value) => {
        const newAuthors = [...autorzy];
        newAuthors[index][field] = value;
        setAutorzy(newAuthors);
    };

    const handleSubmit=async(event)=>{
        event.preventDefault();
        const bookData={
            tytul: tytul,
            autorzy: autorzy.map((author) => ({ imie: author.firstName, nazwisko: author.lastName })),
            kategorie: kategorie,
            isbn: isbn,
            data_wydania: dataWydania,
            cena: cena,
            ilosc: ilosc,
            okladka_adres: linkOkladka,
            zamowienia: []
        };
        const token = localStorage.getItem('token');
        try{
            setLoading(true);
            const response=await fetch("http://localhost:5000/api/admin/add-book", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bookData),
            });
            if(!response.ok){
                throw new Error("Nie udało się dodać książki.");
            }
            else if(response.ok){
                setShow(true);
            }
        } catch(error){
            setError(error.message);
        } finally{
            setLoading(false);
        }
    };

    return(
        <>
        {error && <Alert variant="danger">{error}</Alert>}
        {show && <Alert variant='success' onClose={()=>setShow(false)} dismissible>Książka została dodana do bazy</Alert>}

        <div className='pb-3'>
            <h4>Dodaj książkę</h4>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="bookTitle">
                    <Form.Label>Tytuł</Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="Wprowadź tytuł książki"
                    value={tytul}
                    onChange={(e)=>setTytul(e.target.value)}
                    required
                    />
                </Form.Group>

                
                {autorzy.map((author, index) => (
                <Form.Group key={index} className="">
                    <Form.Label>Autor imie</Form.Label>
                    <Form.Control
                    type="text"
                    placeholder="Imię"
                    value={author.firstName}
                    onChange={(e) => handleAuthorChange(index, "firstName", e.target.value)}
                    required
                    />
                    <Form.Label>Autor nazwisko</Form.Label>
                    <Form.Control
                    type="text"
                    placeholder="Nazwisko"
                    value={author.lastName}
                    onChange={(e) => handleAuthorChange(index, "lastName", e.target.value)}
                    required
                    />
                </Form.Group>
                ))}
                <Button variant="secondary" onClick={handleAddAuthorField} className="my-2">
                    Dodaj kolejnego autora
                </Button>

                
                {kategorie.map((kategoria, index) => (
                <Form.Group key={index} controlId={`bookCategory${index}`}>
                    <Form.Label>Kategoria {index+1}</Form.Label>
                    <Form.Control
                    type="text"
                    placeholder="Podaj kategorie"
                    value={kategoria}
                    onChange={(e) => handleCategoryChange(index, e.target.value)}
                    required
                    />
                </Form.Group>
                ))}
                <Button variant="secondary" onClick={handleAddCategoryField} className="my-2">
                    Dodaj kolejną kategorie
                </Button>

                <Form.Group controlId="bookPrice">
                    <Form.Label>Cena</Form.Label>
                    <Form.Control 
                    type="number" 
                    placeholder="Wprowadź cenę"
                    value={cena}
                    onChange={(e)=>setCena(e.target.value)}
                    required
                    />
                </Form.Group>

                <Form.Group controlId="bookISBN">
                    <Form.Label>ISBN</Form.Label>
                    <Form.Control 
                    type="text"
                    placeholder="Wprowadź numer ISBN np. 978-83-1234567-8"
                    value={isbn}
                    onChange={(e)=>setIsbn(e.target.value)}
                    required
                    />
                </Form.Group>
                
                <Form.Group controlId="bookIlosc">
                    <Form.Label>Ilość</Form.Label>
                    <Form.Control 
                    type="number"
                    placeholder="Wprowadź ilość"
                    value={ilosc}
                    onChange={(e)=>setIlosc(e.target.value)}
                    required
                    />
                </Form.Group>

                <Form.Group controlId="bookTitlePage">
                    <Form.Label>Link do okładki</Form.Label>
                    <Form.Control 
                    type="text"
                    placeholder="Wprowadź link"
                    value={linkOkladka}
                    onChange={(e)=>setLinkOkladka(e.target.value)}
                    required
                    />
                </Form.Group>

                <Form.Group controlId="bookDate">
                    <Form.Label>Data wydania</Form.Label>
                    <Form.Control 
                    type="date"
                    placeholder="Wprowadź date wydania"
                    value={dataWydania}
                    onChange={(e)=>setDataWydania(e.target.value)}
                    required
                    />
                </Form.Group>


                <Button variant="primary" type='submit' className="mt-3" disabled={loading}>
                    {loading ? 'Dodawanie...' : 'Dodaj książkę'}
                </Button>
            </Form>
        </div>
        </>
    );
  };
  
const ViewBooksSection = () => {
    const [AllBoks, setAllBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal]=useState(false);
    const [ksiazkaID, setKsiazkaID]=useState(null);

    useEffect(()=>{
        const fetchAllBoks=async()=>{
            setLoading(true);
            setError(null);
            try{
                const response=await fetch('http://localhost:5000/api/ksiazki-all', {
                    method: 'GET'
                });
                if(!response.ok){
                    throw new Error('Błąd pobrania listy ksiazek.');
                }
                const data=await response.json();
                setAllBooks(data);
            } catch(error){
                setError(error.message);
            } finally{
                setLoading(false);
            }
        };

        fetchAllBoks();
    },[]);


    const handleShow=(id)=>{
        setShowModal(true);
        setKsiazkaID(id);
    };

    const handleClose=()=>{
        setShowModal(false);
    };


    const usunBook=async(id)=>{
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        try{
            const response=await fetch(`http://localhost:5000/api/admin/del-book/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            if(!response.ok){
                throw new Error("Nie udało się usunać książki.");
            }
            setAllBooks(prevBooks => prevBooks.filter(book => book._id !== id));
        } catch(error){
            setError(error);
        } finally{
            setLoading(false);
            setShowModal(false);
        }
    };


    return (
        <>
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Komunikat</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Czy na pewno chcesz usunąć tą książkę z bazy danych?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Zamknij</Button>
                <Button variant="primary" onClick={()=>usunBook(ksiazkaID)}>Tak, usuń</Button>
            </Modal.Footer>
        </Modal>


        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
        <div className="text-center">
            <Spinner animation="border" variant="primary"></Spinner>
        </div>) : (
        <div className='pb-3'>
        <h3 className='p-1 text-center'>Lista książek</h3>
        <Table striped bordered hover>
            <thead>
                <tr className='text-center'>
                    <th>#</th>
                    <th>Tytuł</th>
                    <th>Kategorie</th>
                    <th>Autorzy</th>
                    <th>Cena</th>
                    <th>Ilość w magazynie</th>
                    <th>Ilość zamówień</th>
                    <th>ISBN</th>
                    <th>Data wydania</th>
                    <th>Link do okładki</th>
                    <th>Opcja</th>
                </tr>
            </thead>
            <tbody>
                {AllBoks.map((book, index)=>{
                    return(
                        <tr key={book._id}>
                            <td>{index+1}</td>
                            <td>{book.tytul}</td>
                            <td>{book.kategorie.map(kat=>(kat+" "))}</td>
                            <td>{book.autorzy.map(autor=>(autor.imie+" "+autor.nazwisko+" "))}</td>
                            <td>{book.cena}</td>
                            <td>{book.ilosc}</td>
                            <td>{book.zamowienia.length}</td>
                            <td>{book.isbn}</td>
                            <td>{new Date(book.data_wydania).getUTCDate()}.{new Date(book.data_wydania).getUTCMonth()+1}.{new Date(book.data_wydania).getFullYear()}</td>
                            <td>{book.okladka_adres}</td>
                            <td>
                            <Button variant="warning" size="sm" className="me-2">Edytuj</Button>
                            <Button variant="danger" size="sm" onClick={()=>handleShow(book._id)}>Usuń</Button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </Table>
        </div>
        )}
        </>
    );
};

const TopBuyersSection = () => {
    return (
        <div>
        <h4>Top 3 kupujących</h4>
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>#</th>
                <th>Imię i nazwisko</th>
                <th>Liczba zamówień</th>
                <th>Wartość zamówień</th>
            </tr>
            </thead>
            <tbody>
            {/* Przykładowe dane */}
            <tr>
                <td>1</td>
                <td>Jan Kowalski</td>
                <td>10</td>
                <td>1000 zł</td>
            </tr>
            <tr>
                <td>2</td>
                <td>Anna Nowak</td>
                <td>8</td>
                <td>800 zł</td>
            </tr>
            <tr>
                <td>3</td>
                <td>Piotr Wiśniewski</td>
                <td>5</td>
                <td>500 zł</td>
            </tr>
            </tbody>
        </Table>
        </div>
    );
};

const ViewOrdersSection = () => {
    return (
        <div>
        <h4>Podgląd zamówień</h4>
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>#</th>
                <th>Numer zamówienia</th>
                <th>Data</th>
                <th>Klient</th>
                <th>Status</th>
            </tr>
            </thead>
            <tbody>
            {/* Przykładowe dane */}
            <tr>
                <td>1</td>
                <td>ZAM123</td>
                <td>2025-01-01</td>
                <td>Jan Kowalski</td>
                <td>W realizacji</td>
            </tr>
            </tbody>
        </Table>
        </div>
    );
};



export default Admin;

