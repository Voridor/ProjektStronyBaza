import { useState, useEffect } from 'react';
import { Container, Button, Alert, Spinner, Table, Image, Modal, Row, Col, Nav, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Admin() {
    const [selectedSection, setSelectedSection] = useState("viewBooks");
    const handleSectionChange = (section) => {
        setSelectedSection(section);
    };
    

    return(
        <>
        <Container fluid>
            <Row>
                <Col md={3} className="bg-light p-3">
                <h4>Panel Administracyjny</h4>
                <Nav className="flex-column">
                    <Nav.Link onClick={() => handleSectionChange("addBook")}>Dodaj książkę</Nav.Link>
                    <Nav.Link onClick={() => handleSectionChange("viewBooks")}>Wyświetl książki</Nav.Link>
                    <Nav.Link onClick={() => handleSectionChange("topBuyers")}>Top 3 kupujących</Nav.Link>
                    <Nav.Link onClick={() => handleSectionChange("viewOrders")}>Podgląd zamówień</Nav.Link>
                </Nav>
                </Col>

                <Col md={9} className="p-3">
                {selectedSection === "addBook" && <AddBookSection />}
                {selectedSection === "viewBooks" && <ViewBooksSection />}
                {selectedSection === "topBuyers" && <TopBuyersSection />}
                {selectedSection === "viewOrders" && <ViewOrdersSection />}
                </Col>
            </Row>
        </Container>
        </>
    );
};


const AddBookSection = () => {
    return (
      <div>
        <h4>Dodaj książkę</h4>
        <Form>
          <Form.Group controlId="bookTitle">
            <Form.Label>Tytuł</Form.Label>
            <Form.Control type="text" placeholder="Wprowadź tytuł książki" />
          </Form.Group>
          <Form.Group controlId="bookAuthor">
            <Form.Label>Autor</Form.Label>
            <Form.Control type="text" placeholder="Wprowadź autora" />
          </Form.Group>
          <Form.Group controlId="bookPrice">
            <Form.Label>Cena</Form.Label>
            <Form.Control type="number" placeholder="Wprowadź cenę" />
          </Form.Group>
          <Button variant="primary" className="mt-3">
            Dodaj książkę
          </Button>
        </Form>
      </div>
    );
  };
  
const ViewBooksSection = () => {
    return (
        <div>
        <h4>Lista książek</h4>
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>#</th>
                <th>Tytuł</th>
                <th>Autor</th>
                <th>Cena</th>
                <th>Akcje</th>
            </tr>
            </thead>
            <tbody>
            {/* Przykładowe dane */}
            <tr>
                <td>1</td>
                <td>Książka 1</td>
                <td>Autor 1</td>
                <td>50 zł</td>
                <td>
                <Button variant="warning" size="sm" className="me-2">Edytuj</Button>
                <Button variant="danger" size="sm">Usuń</Button>
                </td>
            </tr>
            </tbody>
        </Table>
        </div>
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

