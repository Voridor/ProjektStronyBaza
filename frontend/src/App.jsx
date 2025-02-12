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
import Admin from "./Admin.jsx";
import ShoppingHistory from './ShoppingHistory.jsx';

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
          <Route path="/admin" element={<Admin/>}/>
          <Route path="/shophistory" element={<ShoppingHistory/>}/>
        </Routes>
      </Router>
      
    </>
  )
};

export default App

