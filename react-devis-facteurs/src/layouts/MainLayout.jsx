import React from 'react';

const MainLayout = ({ children, title = "Gestion Devis & Factures" }) => {
  return (
    <div className="min-vh-100 bg-light">
      <header className="bg-white shadow-sm border-bottom">
        <div className="container-fluid py-3">
          <h1 className="h4 mb-0 text-primary">{title}</h1>
        </div>
      </header>
      
      <main className="container-fluid py-4">
        {children}
      </main>
      
      <footer className="bg-white border-top mt-auto">
        <div className="container-fluid py-3">
          <div className="text-center text-muted small">
            © 2025 Gestion Devis & Factures - Version 1.0
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;