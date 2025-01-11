import { useEffect, useState } from "react";
import { Accordion, Alert, Container, Spinner, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

// historia zakupow klienta
function ShoppingHistory(){
    const [realiZamow, setRealiZamow]=useState([]); // tablica na realizowane zamowienia
    const [error, setError]=useState(null);
    const [loading, setLoading]=useState(false);
    const [isLoggedIn, setIsLoggedIn]=useState(false);

    useEffect(()=>{
        const token=localStorage.getItem('token');
        setIsLoggedIn(!!token);

        const fetchActiveZamow=async()=>{
            setLoading(true);
            setError(null);
            try{
                const response=await fetch('http://localhost:5000/api/client/realizowane-zamowienia', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                if(!response.ok){
                    throw new Error('Błąd pobrania zamowien w trakcje realizacji.');
                }
                const data=await response.json();
                setRealiZamow(data);
            } catch(error){
                setError(error.message);
            } finally{
                setLoading(false);
            }
        };

        if(!!token===true){
            fetchActiveZamow();
        }
    },[]);


    const [activeKey, setActiveKey] = useState(null); // to rozwijanych accordiconow
    const handleAccordionClick = (key) => {
        // Przełączanie aktywnego klucza (rozwiń lub zwijaj)
        setActiveKey(activeKey === key ? null : key);
    };



    return(
        <>
        <div className='bg-dark text-white' style={{minHeight: '100vh'}}>
            <Container>
                <h2 className="py-4">Twoje zamówienia:</h2>

                {error && <Alert variant="danger">{error}</Alert>}

                {isLoggedIn ?
                (loading ? (
                    <div className="text-center">
                        <Spinner animation="border" variant="primary"></Spinner>
                    </div>
                ) : realiZamow.length > 0 ? (
                    <>
                    <Accordion alwaysOpen style={{backgroundColor: "black"}}>
                        {realiZamow.map((item, index)=>{
                            return(
                                <Accordion.Item key={item._id} eventKey={String(index)} onClick={() => handleAccordionClick(String(index))}>
                                    <Accordion.Header>Data złożenia zamówienia: {new Date(item.data_utworzenia).getDate()}.{new Date(item.data_utworzenia).getMonth()+1}.{new Date(item.data_utworzenia).getFullYear()} {new Date(item.data_utworzenia).getUTCHours()}:{new Date(item.data_utworzenia).getUTCMinutes()} Status zamówienia: {item.status}</Accordion.Header>
                                    <Accordion.Body>
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr className="text-center">
                                                <th>Tytuł:</th>
                                                <th>Cena za sztukę:</th>
                                                <th>Ilość:</th>
                                                <th>Cena łączna:</th>
                                                <th>Cena po rabacie:</th>
                                                <th>Status:</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {item.ksiazki.map(book=>{
                                                return(
                                                <tr key={book.book_id}>
                                                    <td className="text-center align-middle">{book.tytul}</td>
                                                    <td className="text-center align-middle">{book.cena}</td>
                                                    <td className="text-center align-middle">{book.ilosc}</td>
                                                    <td className="text-center align-middle">{book.subtotal}</td>
                                                    <td className="text-center align-middle">{book.subtotal_porabacie}</td>
                                                    <td className="text-center align-middle">{item.status}</td>
                                                </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                    <div className="text-end">
                                        <h4>Koszt zamówienia: {item.suma_subtotal}</h4>
                                    </div>
                                    </Accordion.Body>
                                </Accordion.Item>)
                        })}
                    </Accordion>
                    </>
                ) : (<Alert variant="info">Twoja historia zamówień jest pusta</Alert>))
                : <Alert variant="info">Nie jesteś zalogowany.</Alert>}
                {/* przyciski do powrotu na strone glowna i do koszyka */}
                <Link to="/koszyk" className="btn btn-outline-light w-100 mt-4 fw-bold mb-3">Powrót do koszyka</Link>
                <Link to="/" className="btn btn-outline-light w-100 fw-bold mb-4">Powrót do strony głównej</Link>
            </Container>
        </div>
        </>
    );
};


export default ShoppingHistory;

