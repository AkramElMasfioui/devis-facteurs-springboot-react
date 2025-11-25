import React, { useState, useEffect } from "react";
import axios from "axios";

export default function DevisApp() {
  const [devisList, setDevisList] = useState([]);
  const [clients, setClients] = useState([]);
  const [produits, setProduits] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [details, setDetails] = useState([{ produitId: "", quantite: 1 }]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Charger tous les devis, clients et produits
  const fetchData = async () => {
    try {
      setLoading(true);
      const [devisRes, clientsRes, produitsRes] = await Promise.all([
        axios.get("/api/devis"),
        axios.get("/api/clients"),
        axios.get("/api/produits")
      ]);
      
      setDevisList(devisRes.data);
      setClients(clientsRes.data);
      setProduits(produitsRes.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDetailChange = (index, field, value) => {
    const newDetails = [...details];
    newDetails[index][field] = value;
    setDetails(newDetails);
  };

  const addDetail = () => setDetails([...details, { produitId: "", quantite: 1 }]);
  
  const removeDetail = (index) => {
    if (details.length > 1) {
      setDetails(details.filter((_, i) => i !== index));
    }
  };

  const createDevis = async () => {
    if (!selectedClient) {
      setError("Veuillez sélectionner un client");
      return;
    }

    const validDetails = details.filter(d => d.produitId && d.quantite > 0);
    if (validDetails.length === 0) {
      setError("Veuillez ajouter au moins un produit avec une quantité valide");
      return;
    }

    try {
      setLoading(true);
      const payload = validDetails.map(d => ({ 
        produitId: parseInt(d.produitId), 
        quantite: parseInt(d.quantite) 
      }));
      
      await axios.post(`/api/devis/create/${selectedClient}`, payload);
      
      setDetails([{ produitId: "", quantite: 1 }]);
      setSelectedClient("");
      setSuccess("Devis créé avec succès !");
      setError("");
      
      await fetchData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur lors de la création du devis");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  const validerDevis = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir valider ce devis ?")) return;
    
    try {
      await axios.put(`/api/devis/${id}/valider`);
      setSuccess("Devis validé avec succès !");
      setError("");
      await fetchData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur lors de la validation");
      setSuccess("");
    }
  };

  const deleteDevis = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce devis ?")) return;
    
    try {
      await axios.delete(`/api/devis/${id}`);
      setSuccess("Devis supprimé avec succès !");
      setError("");
      await fetchData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur lors de la suppression");
      setSuccess("");
    }
  };

  return (
    <div className="fade-in" style={{ minHeight: '100vh' }}>
      {/* Header moderne */}
      <div className="header-modern">
        <div className="container-fluid px-4">
          <div className="d-flex align-items-center gap-3">
            <i className="fas fa-file-alt icon-lg"></i>
            <h1 className="mb-0">Gestion des Devis</h1>
          </div>
        </div>
      </div>
        
      <div className="container-fluid p-4">
        {/* Messages */}
        {error && (
          <div className="alert-modern alert-danger mb-4">
            <i className="fas fa-exclamation-triangle"></i>
            <strong>Erreur :</strong> {error}
          </div>
        )}

        {success && (
          <div className="alert-modern alert-success mb-4">
            <i className="fas fa-check-circle"></i>
            <strong>Succès :</strong> {success}
          </div>
        )}

        {/* Formulaire de création de devis */}
        <div className="card-modern mb-4 hover-lift">
          <div className="card-header d-flex align-items-center gap-2">
            <i className="fas fa-plus-circle text-primary"></i>
            <h5 className="mb-0">Créer un Nouveau Devis</h5>
          </div>
          <div className="card-body">
            <div className="form-modern">
              {/* Sélection du client */}
              <div className="form-group mb-4">
                <label className="form-label">
                  <i className="fas fa-user"></i> Sélectionner un client *
                </label>
                <select 
                  className="form-input" 
                  value={selectedClient} 
                  onChange={e => setSelectedClient(e.target.value)}
                >
                  <option value="">-- Choisir un client --</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.nom}</option>
                  ))}
                </select>
              </div>

              {/* Détails des produits */}
              <div className="form-group mb-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <label className="form-label mb-0">
                    <i className="fas fa-shopping-cart"></i> Produits du devis
                  </label>
                  <button 
                    type="button" 
                    className="btn-modern btn-outline"
                    onClick={addDetail}
                  >
                    <i className="fas fa-plus"></i>
                    Ajouter produit
                  </button>
                </div>

                {details.map((detail, index) => (
                  <div key={index} className="card-modern mb-3" style={{ backgroundColor: '#f8f9fa' }}>
                    <div className="card-body">
                      <div className="row align-items-end g-3">
                        <div className="col-md-6">
                          <label className="form-label">Produit</label>
                          <select
                            className="form-input"
                            value={detail.produitId}
                            onChange={e => handleDetailChange(index, "produitId", e.target.value)}
                          >
                            <option value="">-- Sélectionner un produit --</option>
                            {produits.map(p => (
                              <option key={p.id} value={p.id}>
                                {p.nom} ({p.prixUnitaire} DH)
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">Quantité</label>
                          <input
                            type="number"
                            className="form-input"
                            min="1"
                            value={detail.quantite}
                            onChange={e => handleDetailChange(index, "quantite", e.target.value)}
                          />
                        </div>
                        <div className="col-md-3">
                          <button 
                            type="button" 
                            className="btn-modern btn-secondary w-100"
                            onClick={() => removeDetail(index)}
                            disabled={details.length === 1}
                            title="Supprimer cette ligne"
                          >
                            <i className="fas fa-trash"></i>
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bouton de création */}
              <div className="d-flex justify-content-end">
                <button 
                  type="button" 
                  className="btn-modern"
                  onClick={createDevis}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Création...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-file-plus"></i>
                      Créer le Devis
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des devis */}
        <div className="card-modern hover-lift">
          <div className="card-header d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <i className="fas fa-list text-primary"></i>
              <h5 className="mb-0">Liste des Devis</h5>
            </div>
            <span className="badge bg-primary">
              {devisList.length} devis
            </span>
          </div>
          <div className="card-body p-0">
            {devisList.length > 0 ? (
              <div className="row g-4 p-4">
                {devisList.map(devis => (
                  <div key={devis.id} className="col-md-6 col-lg-4">
                    <div className="card-modern hover-lift h-100">
                      <div className="card-header d-flex align-items-center justify-content-between">
                        <span className="fw-bold">
                          <i className="fas fa-hashtag"></i> {devis.id}
                        </span>
                        <span className={`badge ${
                          devis.statut === 'VALIDÉ' ? 'bg-success' : 
                          devis.statut === 'EN_ATTENTE' ? 'badge-warning' : 'bg-gray'
                        }`}>
                          {devis.statut === 'VALIDÉ' ? 'Validé' :
                           devis.statut === 'EN_ATTENTE' ? 'En attente' : devis.statut}
                        </span>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <i className="fas fa-user text-primary"></i>
                            <strong>Client:</strong>
                          </div>
                          <div className="text-muted">{devis.client?.nom || "Client non défini"}</div>
                        </div>

                        <div className="mb-3">
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <i className="fas fa-euro-sign text-primary"></i>
                            <strong>Montants:</strong>
                          </div>
                          <div className="row">
                            <div className="col-6">
                              <small className="text-muted">HT:</small>
                              <div className="fw-bold">{devis.totalHT} DH</div>
                            </div>
                            <div className="col-6">
                              <small className="text-muted">TTC:</small>
                              <div className="fw-bold text-primary">{devis.totalTTC} DH</div>
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <i className="fas fa-shopping-cart text-primary"></i>
                            <strong>Produits ({devis.details?.length || 0}):</strong>
                          </div>
                          <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                            {devis.details?.map(detail => (
                              <div key={detail.id} className="d-flex justify-content-between align-items-center py-1 border-bottom">
                                <span className="text-muted small">
                                  {detail.produit?.nom || `Produit ${detail.produitId}`}
                                </span>
                                <span className="fw-bold small">
                                  {detail.quantite}x {detail.prix} DH
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="d-flex gap-2">
                          {devis.statut !== "VALIDÉ" && (
                            <button
                              className="btn-modern btn-outline flex-grow-1"
                              onClick={() => validerDevis(devis.id)}
                              title="Valider ce devis"
                            >
                              <i className="fas fa-check"></i>
                              Valider
                            </button>
                          )}
                          <button 
                            className="btn-modern btn-secondary"
                            onClick={() => deleteDevis(devis.id)}
                            title="Supprimer ce devis"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <div className="d-flex flex-column align-items-center text-muted">
                  <i className="fas fa-file-alt" style={{ fontSize: '4rem', marginBottom: '1rem' }}></i>
                  <h5>Aucun devis créé</h5>
                  <p>Commencez par créer votre premier devis avec le formulaire ci-dessus.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
