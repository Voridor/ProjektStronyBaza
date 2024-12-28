//import { useState } from 'react'
/*import './App.css' w main.jsx jest bootstrapowy css importowany, 
wiec ten tutaj sie naklada dodatkowo*/
//import {Navbar} from './Navbar.jsx'
//import {BookList} from './BookList.jsx'
//import { MyFooter } from './MyFooter.jsx'
//import {MyNavbar} from './MyNavbar.jsx'
import {HomePage} from './HomePage.jsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Kontakt from './Kontakt.jsx';
import Bestsellers from './Bestsellers.jsx';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/bestsellers" element={<Bestsellers />} />
          <Route path="/kontakt" element={<Kontakt />} />
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
