import React, { useState, useEffect } from "react";
import clientService from "../services/clientService";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [editId, setEditId] = useState(null);

  const [searchPhone, setSearchPhone] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const [error, setError] = useState("");

  // ------------------------- FETCH CLIENTS -------------------------
  const fetchClients = async () => {
    try {
      const data = await clientService.getAll();
      setClients(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // load on start
  useEffect(() => {
    let mounted = true;
    const loadClients = async () => {
      try {
        const data = await clientService.getAll();
        if (mounted) setClients(data);
      } catch (err) {
        console.error(err);
        if (mounted) setError(err.message);
      }
    };

    loadClients();

    return () => {
      mounted = false;
    };
  }, []);

  // ------------------------- ADD OR UPDATE -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const clientData = { nom, email, telephone };
      
      if (editId) {
        await clientService.update(editId, clientData);
      } else {
        await clientService.create(clientData);
      }

      setNom("");
      setEmail("");
      setTelephone("");
      setEditId(null);
      fetchClients();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // ------------------------- DELETE -------------------------
  const deleteClient = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) return;
    try {
      await clientService.delete(id);
      fetchClients();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // ------------------------- SEARCH BY TELEPHONE -------------------------
  const searchByTelephone = async () => {
    try {
      const result = await clientService.searchByPhone(searchPhone);
      setSearchResult(result);
      setError("");
    } catch (err) {
      console.error(err);
      setSearchResult(null);
      setError(err.message);
    }
  };

  return (
    <div className="fade-in" style={{ minHeight: '100vh' }}>
      {/* Header moderne */}
      <div className="header-modern">
        <div className="container-fluid px-4">
          <div className="d-flex align-items-center gap-3">
            <i className="fas fa-users icon-lg"></i>
            <h1 className="mb-0">Gestion des Clients</h1>
          </div>
        </div>
      </div>
        
      <div className="container-fluid p-4">
        {/* Messages d'erreur */}
        {error && (
          <div className="alert-modern alert-danger mb-4">
            <i className="fas fa-exclamation-triangle"></i>
            <strong>Erreur :</strong> {error}
          </div>
        )}

        {/* Formulaire moderne */}
        <div className="card-modern mb-4 hover-lift">
          <div className="card-header d-flex align-items-center gap-2">
            <i className="fas fa-user-plus text-primary"></i>
            <h5 className="mb-0">{editId ? 'Modifier Client' : 'Nouveau Client'}</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="form-modern">
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-label">
                      <i className="fas fa-user"></i> Nom complet *
                    </label>
                    <input
                      className="form-input"
                      placeholder="Entrez le nom complet"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-label">
                      <i className="fas fa-envelope"></i> Email *
                    </label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="exemple@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-label">
                      <i className="fas fa-phone"></i> Téléphone *
                    </label>
                    <input
                      className="form-input"
                      placeholder="0123456789"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="d-flex gap-2 mt-3">
                <button type="submit" className="btn-modern">
                  <i className={`fas fa-${editId ? 'edit' : 'plus'}`}></i>
                  {editId ? 'Modifier' : 'Ajouter'}
                </button>
                {editId && (
                  <button 
                    type="button" 
                    className="btn-modern btn-secondary"
                    onClick={() => {
                      setEditId(null);
                      setNom("");
                      setEmail("");
                      setTelephone("");
                    }}
                  >
                    <i className="fas fa-times"></i>
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Recherche moderne */}
        <div className="card-modern mb-4 hover-lift">
          <div className="card-header d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <i className="fas fa-search text-primary"></i>
              <h5 className="mb-0">Recherche Rapide</h5>
            </div>
            <span className="badge bg-primary">
              {clients.length} client{clients.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="card-body">
            <div className="d-flex gap-2">
              <input
                className="form-input flex-grow-1"
                placeholder="Rechercher par numéro de téléphone..."
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
              />
              <button 
                type="button" 
                className="btn-modern" 
                onClick={searchByTelephone}
              >
                <i className="fas fa-search"></i>
                Rechercher
              </button>
            </div>
          </div>
        </div>        {/* Résultat de recherche */}
        {searchResult && (
          <div className="alert-modern alert-success mb-4">
            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="fas fa-check-circle"></i>
              <strong>Client trouvé !</strong>
            </div>
            <div className="row">
              <div className="col-md-4">
                <i className="fas fa-user"></i> <strong>Nom :</strong> {searchResult.nom}
              </div>
              <div className="col-md-4">
                <i className="fas fa-envelope"></i> <strong>Email :</strong> {searchResult.email}
              </div>
              <div className="col-md-4">
                <i className="fas fa-phone"></i> <strong>Téléphone :</strong> {searchResult.telephone}
              </div>
            </div>
          </div>
        )}

        {/* Liste moderne des clients */}
        <div className="card-modern hover-lift">
          <div className="card-header d-flex align-items-center gap-2">
            <i className="fas fa-list text-primary"></i>
            <h5 className="mb-0">Liste des Clients</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>#</th>
                    <th>
                      <i className="fas fa-user"></i> Nom
                    </th>
                    <th>
                      <i className="fas fa-envelope"></i> Email
                    </th>
                    <th>
                      <i className="fas fa-phone"></i> Téléphone
                    </th>
                    <th className="text-center" style={{ width: '200px' }}>
                      <i className="fas fa-cogs"></i> Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {clients.length > 0 ? clients.map((c, index) => (
                    <tr key={c.id}>
                      <td className="text-muted fw-bold">{index + 1}</td>
                      <td className="fw-semibold">{c.nom}</td>
                      <td>
                        <a href={`mailto:${c.email}`} className="text-primary">
                          {c.email}
                        </a>
                      </td>
                      <td>
                        <a href={`tel:${c.telephone}`} className="text-primary">
                          {c.telephone}
                        </a>
                      </td>
                      <td className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          <button
                            type="button"
                            className="btn-modern btn-outline"
                            title="Modifier ce client"
                            onClick={() => {
                              setEditId(c.id);
                              setNom(c.nom);
                              setEmail(c.email);
                              setTelephone(c.telephone);
                            }}
                          >
                            <i className="fas fa-edit me-2"></i>
                            Modifier
                          </button>
                          <button 
                            type="button" 
                            className="btn-modern btn-secondary" 
                            title="Supprimer ce client"
                            onClick={() => deleteClient(c.id)}
                          >
                            <i className="fas fa-trash me-2"></i>
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="text-center py-5">
                        <div className="d-flex flex-column align-items-center text-muted">
                          <i className="fas fa-users" style={{ fontSize: '4rem', marginBottom: '1rem' }}></i>
                          <h5>Aucun client enregistré</h5>
                          <p>Commencez par ajouter votre premier client avec le formulaire ci-dessus.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
