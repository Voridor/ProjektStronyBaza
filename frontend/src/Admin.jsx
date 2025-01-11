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
                    if(response.status==200){
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
            <h1 className='text-white text-center py-3'>Panel Administracyjny</h1>
            <div className="d-flex justify-content-center">
                <Link to="/" className="btn btn-outline-light w-25">Strona główna</Link>
            </div>
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
    const [showModal2, setshowModal2] = useState(false);
    const [bookToEdit, setBookToEdit] = useState(null);
    const [updatedBook, setUpdatedBook] = useState({
        tytul: '',
        kategorie: '',
        autorzy: '',
        cena: '',
        ilosc: '',
        isbn: '',
        data_wydania: '',
        okladka_adres: ''
    });


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


    const handleEdit = (id) => {
        const book = AllBoks.find(book => book._id === id);
        setBookToEdit(book);
        setUpdatedBook({
            tytul: book.tytul,
            kategorie: book.kategorie.join(', '), // konwertowanie tablicy na stringa z odzielajacym przecinkiem kategorie
            autorzy: book.autorzy.map(autor => `${autor.imie} ${autor.nazwisko}`).join(', '),
            cena: book.cena,
            ilosc: book.ilosc,
            isbn: book.isbn,
            data_wydania: new Date(book.data_wydania).toISOString().split('T')[0], // format daty yyyy-mm-dd
            okladka_adres: book.okladka_adres
        });

        setshowModal2(true);
    };


    const handleCloseModal = () => {
        setshowModal2(false);
        setUpdatedBook({
            tytul: '',
            kategorie: '',
            autorzy: '',
            cena: '',
            ilosc: '',
            isbn: '',
            data_wydania: '',
            okladka_adres: ''
        });
    };


    const handleSaveChanges = async () => {
        const { tytul, kategorie, autorzy, cena, ilosc, isbn, data_wydania, okladka_adres } = updatedBook;
        const processedAutorzy = autorzy
        .split(',') // Podziel na autorów przy przecinkach
        .map(autor => autor.trim()) // Usuń spacje na początku i końcu każdego elementu
        .map(autor => {
            const [imie, nazwisko] = autor.split(' '); // Podziel imię i nazwisko
            return { imie, nazwisko };
        });
        
        const updatedBookData = {
            tytul,
            kategorie: kategorie.split(',').map(kat => kat.trim()),
            autorzy: processedAutorzy,
            cena,
            ilosc,
            isbn,
            data_wydania,
            okladka_adres
        };

        const token = localStorage.getItem('token');
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/admin/update-book/${bookToEdit._id}`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(updatedBookData)
            });
            if (!response.ok) {
                throw new Error('Błąd podczas edytowania książki.');
            }
            const data = await response.json();
            setAllBooks(prevBooks =>
                prevBooks.map(book => book._id === bookToEdit._id ? data : book)
            );
        } catch (error) {
            setError(error.message);
        } finally{
            setLoading(false);
            handleCloseModal();
        }
    };


    return (
        <>
        {/*modal do edycji ksiazki w bazie*/}
        <Modal show={showModal2} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Edytuj książkę</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formTytul">
                        <Form.Label>Tytuł</Form.Label>
                        <Form.Control
                            type="text"
                            value={updatedBook.tytul}
                            onChange={(e) => setUpdatedBook({ ...updatedBook, tytul: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group controlId="formKategorie">
                        <Form.Label>Kategorie</Form.Label>
                        <Form.Control
                            type="text"
                            value={updatedBook.kategorie}
                            onChange={(e) => setUpdatedBook({ ...updatedBook, kategorie: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group controlId="formAutorzy">
                        <Form.Label>Autorzy</Form.Label>
                        <Form.Control
                            type="text"
                            value={updatedBook.autorzy}
                            onChange={(e) => setUpdatedBook({ ...updatedBook, autorzy: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group controlId="formCena">
                        <Form.Label>Cena</Form.Label>
                        <Form.Control
                            type="number"
                            value={updatedBook.cena}
                            onChange={(e) => setUpdatedBook({ ...updatedBook, cena: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group controlId="formIlosc">
                        <Form.Label>Ilość</Form.Label>
                        <Form.Control
                            type="number"
                            value={updatedBook.ilosc}
                            onChange={(e) => setUpdatedBook({ ...updatedBook, ilosc: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group controlId="formIsbn">
                        <Form.Label>ISBN</Form.Label>
                        <Form.Control
                            type="text"
                            value={updatedBook.isbn}
                            onChange={(e) => setUpdatedBook({ ...updatedBook, isbn: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group controlId="formDataWydania">
                        <Form.Label>Data Wydania</Form.Label>
                        <Form.Control
                            type="date"
                            value={updatedBook.data_wydania}
                            onChange={(e) => setUpdatedBook({ ...updatedBook, data_wydania: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group controlId="formOkladka">
                        <Form.Label>Link do Okładki</Form.Label>
                        <Form.Control
                            type="text"
                            value={updatedBook.okladka_adres}
                            onChange={(e) => setUpdatedBook({ ...updatedBook, okladka_adres: e.target.value })}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>Zamknij</Button>
                <Button variant="primary" onClick={()=>handleSaveChanges()}>Zapisz zmiany</Button>
            </Modal.Footer>
        </Modal>



        {/* modal do usuwania ksiazki z bazy */}
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
                            <Button variant="warning" size="sm" className="me-2" onClick={()=>handleEdit(book._id)}>Edytuj</Button>
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [topka, setTopka] = useState([]);

    useEffect(()=>{
        const fetchTopka=async()=>{
            setLoading(true);
            setError(null);
            try{
                const response=await fetch('http://localhost:5000/api/admin/top-kupujacy', {
                    method: 'GET'
                });
                if(!response.ok){
                    throw new Error('Błąd pobrania topki kupujacych.');
                }
                const data=await response.json();
                setTopka(data);
            } catch(error){
                setError(error.message);
            } finally{
                setLoading(false);
            }
        };

        fetchTopka();
    },[]);



    return(
        <>
        {error ? <Alert variant="danger">{error}</Alert> : (
        loading ? (
        <div className="text-center">
            <Spinner animation="border" variant="primary"></Spinner>
        </div>) : (
        <div className='pb-3'>
        <h4 className='text-center py-2'>Top 3 kupujących</h4>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Login</th>
                    <th>Imię</th>
                    <th>Nazwisko</th>
                    <th>Email</th>
                    <th>Wydana kwota</th>
                </tr>
            </thead>
            <tbody>
                {topka.map((item, index)=>{
                    return(
                        <tr key={item._id}>
                            <td>{index+1}</td>
                            <td>{item.login}</td>
                            <td>{item.imie}</td>
                            <td>{item.nazwisko}</td>
                            <td>{item.email}</td>
                            <td>{item.wydana_kwota}</td>
                        </tr>
                    )
                })}
            </tbody>
        </Table>
        </div> ))}
        </>
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

