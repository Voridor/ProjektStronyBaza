//import React from 'react';

export function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">Księgarnia</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/">Strona główna</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/about">O nas</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/contact">Kontakt</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
