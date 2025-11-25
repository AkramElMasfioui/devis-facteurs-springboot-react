import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";

import Clients from "./components/Clients";
import Produits from "./components/Products";
import Devis from "./components/Devis";
import Factures from "./components/Facturs";

import "bootstrap/dist/css/bootstrap.min.css";

// Composant Dashboard d'accueil
const Dashboard = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="jumbotron bg-gradient text-white text-center py-5 mb-4 rounded-4 shadow-lg" 
               style={{ 
                 background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 25%, #45B7D1 50%, #96CEB4 75%, #FFEAA7 100%)',
                 boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
               }}>
            <div className="container">
              <div className="mb-4">
                <span style={{ fontSize: '4rem', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>🏢</span>
              </div>
              <h1 className="display-3 fw-bold mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                Gestion Devis & Factures
              </h1>
              <p className="lead fs-4 mb-4" style={{ color: '#000000', textShadow: '1px 1px 3px rgba(255,255,255,0.9)' }}>
                Solution complète pour gérer vos clients, devis et factures
              </p>
              <div className="d-flex justify-content-center mb-4">
                <div className="bg-white bg-opacity-25 rounded-pill px-4 py-2">
                  <span className="fw-semibold" style={{ color: '#000000', textShadow: '1px 1px 2px rgba(255,255,255,0.8)' }}>✨ Interface Moderne & Intuitive ✨</span>
                </div>
              </div>
              <p className="mb-0 fs-5" style={{ color: '#000000', textShadow: '1px 1px 2px rgba(255,255,255,0.7)' }}>Choisissez une section dans le menu pour commencer</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row g-4">
        <div className="col-md-3">
          <div className="card h-100 border-0 hover-card" style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)', color: 'white' }}>
            <div className="card-body text-center">
              <div className="mb-3" style={{ fontSize: '3.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>📄</div>
              <h5 className="card-title text-white fw-bold">Clients</h5>
              <p className="card-text text-white-50">Gérez votre base de clients</p>
              <Link to="/clients" className="btn btn-light btn-lg fw-semibold">
                🚀 Accéder
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card h-100 border-0 hover-card" style={{ background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)', color: 'white' }}>
            <div className="card-body text-center">
              <div className="mb-3" style={{ fontSize: '3.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>📮</div>
              <h5 className="card-title text-white fw-bold">Produits</h5>
              <p className="card-text text-white-50">Cataloguez vos produits</p>
              <Link to="/produits" className="btn btn-light btn-lg fw-semibold">
                📦 Accéder
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card h-100 border-0 hover-card" style={{ background: 'linear-gradient(135deg, #FFEAA7 0%, #FDCB6E 100%)', color: 'white' }}>
            <div className="card-body text-center">
              <div className="mb-3" style={{ fontSize: '3.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>📝</div>
              <h5 className="card-title text-white fw-bold">Devis</h5>
              <p className="card-text text-white-50">Créez des devis professionnels</p>
              <Link to="/devis" className="btn btn-light btn-lg fw-semibold">
                ✨ Accéder
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card h-100 border-0 hover-card" style={{ background: 'linear-gradient(135deg, #A29BFE 0%, #6C5CE7 100%)', color: 'white' }}>
            <div className="card-body text-center">
              <div className="mb-3" style={{ fontSize: '3.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>🧾</div>
              <h5 className="card-title text-white fw-bold">Factures</h5>
              <p className="card-text text-white-50">Émettez vos factures</p>
              <Link to="/factures" className="btn btn-light btn-lg fw-semibold">
                💰 Accéder
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant Sidebar
const Sidebar = ({ isOpen, toggle }) => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', icon: '🏠', label: 'Accueil', color: 'primary' },
    { path: '/clients', icon: '📄', label: 'Clients', color: 'primary' },
    { path: '/produits', icon: '📮', label: 'Produits', color: 'success' },
    { path: '/devis', icon: '📝', label: 'Devis', color: 'warning' },
    { path: '/factures', icon: '🧾', label: 'Factures', color: 'danger' },
  ];

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div 
          className="position-fixed w-100 h-100 bg-dark bg-opacity-50 d-lg-none" 
          style={{ zIndex: 1040 }}
          onClick={toggle}
        ></div>
      )}
      
      {/* Sidebar */}
      <nav 
        className={`position-fixed top-0 start-0 h-100 bg-white shadow-lg border-end transition-all ${
          isOpen ? 'translate-x-0' : '-translate-x-100'
        } d-lg-block`}
        style={{ 
          width: '280px', 
          zIndex: 1050,
          transform: isOpen || window.innerWidth >= 992 ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        <div className="d-flex flex-column h-100">
          {/* Header */}
          <div className="p-4 border-bottom bg-gradient" 
               style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <div className="text-center">
              <div className="mb-2" style={{ fontSize: '2rem' }}>🏢</div>
              <h5 className="mb-0 fw-bold" style={{ color: '#000000', textShadow: '1px 1px 3px rgba(255,255,255,0.8)' }}>Menu Principal</h5>
            </div>
          </div>
          
          {/* Menu Items */}
          <div className="flex-grow-1 p-3">
            <ul className="nav flex-column gap-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path} className="nav-item">
                    <Link
                      to={item.path}
                      className={`nav-link px-3 py-3 rounded-3 d-flex align-items-center gap-3 transition-all ${
                        isActive 
                          ? `bg-${item.color} text-white shadow-sm` 
                          : `text-dark hover-bg-light border border-light`
                      }`}
                      onClick={() => window.innerWidth < 992 && toggle()}
                      style={{ textDecoration: 'none' }}
                    >
                      <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                      <span className="fw-semibold">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          
          {/* Footer */}
          <div className="p-3 border-top bg-light">
            <small className="text-muted d-block text-center">
              © 2025 Gestion Devis
            </small>
          </div>
        </div>
      </nav>
    </>
  );
};

// Composant TopBar
function TopBar({ onToggleSidebar }) {
  return (
    <header className="bg-white shadow-sm border-bottom position-sticky top-0" style={{ zIndex: 1030 }}>
      <div className="container-fluid px-4 py-3">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-outline-secondary d-lg-none"
              onClick={onToggleSidebar}
            >
              <span>☰</span>
            </button>
            <h6 className="mb-0 text-muted d-none d-md-block">
              Tableau de bord - Gestion Devis & Factures
            </h6>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-success">En ligne</span>
            <div className="d-flex align-items-center gap-2 d-none d-md-flex">
              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '40px', height: '40px' }}>
                <span className="text-white fw-bold">A</span>
              </div>
              <small className="text-muted">Admin</small>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <div className="d-flex min-vh-100 bg-light">
        <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
        
        <div className="flex-grow-1" style={{ marginLeft: window.innerWidth >= 992 ? '280px' : '0' }}>
          <TopBar onToggleSidebar={toggleSidebar} />
          
          <main className="p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/produits" element={<Produits />} />
              <Route path="/devis" element={<Devis />} />
              <Route path="/factures" element={<Factures />} />
            </Routes>
          </main>
        </div>
      </div>
      
      <style>{`
        .hover-card {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        .hover-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2) !important;
        }
        .hover-bg-light:hover {
          background-color: #f8f9fa !important;
        }
        .transition-all {
          transition: all 0.3s ease;
        }
        @media (min-width: 992px) {
          .sidebar-desktop {
            transform: translateX(0) !important;
          }
        }
        .btn {
          transition: all 0.3s ease;
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        .jumbotron {
          animation: fadeInUp 1s ease-out;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Router>
  );
}

export default App;
