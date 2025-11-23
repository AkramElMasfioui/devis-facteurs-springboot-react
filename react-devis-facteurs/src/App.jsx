import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./styles.css";

import Clients from "./components/Clients";
import Produits from "./components/Products";
import Devis from "./components/Devis";
import Factures from "./components/Facturs";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      {/* NAVBAR BOOTSTRAP */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Gestion Devis & Factures</Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">

              <li className="nav-item">
                <Link className="btn btn-primary me-2" to="/clients">Clients</Link>
              </li>

              <li className="nav-item">
                <Link className="btn btn-primary me-2" to="/produits">Produits</Link>
              </li>

              <li className="nav-item">
                <Link className="btn btn-primary me-2" to="/devis">Devis</Link>
              </li>

              <li className="nav-item">
                <Link className="btn btn-primary" to="/factures">Factures</Link>
              </li>

            </ul>
          </div>
        </div>
      </nav>

      {/* CONTENU DES PAGES */}
      <div className="container" style={{ paddingTop: "100px" }}>
        <Routes>
          <Route path="/clients" element={<Clients />} />
          <Route path="/produits" element={<Produits />} />
          <Route path="/devis" element={<Devis />} />
          <Route path="/factures" element={<Factures />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
