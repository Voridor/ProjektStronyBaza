/*import './App.css' w main.jsx jest bootstrapowy css importowany, 
wiec ten tutaj sie naklada dodatkowo*/
import {HomePage} from './HomePage.jsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Kontakt from './Kontakt.jsx';
import Bestsellers from './Bestsellers.jsx';
import Logowanie from './Logowanie.jsx';
import Rejestracja from './Rejestracja.jsx';
import Koszyk from './Koszyk.jsx';
import SearchResult from './SearchResult.jsx';
import AllBooksPage from './AllBooksPage.jsx';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/bestsellers" element={<Bestsellers/>} />
          <Route path="/kontakt" element={<Kontakt/>} />
          <Route path="/logowanie" element={<Logowanie/>} />
          <Route path="/rejestracja" element={<Rejestracja/>}/>
          <Route path="/koszyk" element={<Koszyk/>}/>
          <Route path="/searchresult" element={<SearchResult/>}/>
          <Route path="/allbookspage" element={<AllBooksPage/>}/>
        </Routes>
      </Router>
      
    </>
  )
};

export default App

/*
<MyNavbar></MyNavbar>
      <div className="container mt-5">
        <h1 className='text-center'>Nowości:</h1>
        <BookList/>
      </div>
      <MyFooter/>
*/

/*
<div>
  <Navbar />
  <div className="container mt-5">
    <h1>Nasza Księgarnia</h1>
    <BookList />
  </div>
</div>
*/
