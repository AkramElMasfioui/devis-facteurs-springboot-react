import React, { useState, useEffect } from "react";
import { API } from "../api";

export default function Produits() {
  const [produits, setProduits] = useState([]);
  const [nom, setNom] = useState("");
  const [prix, setPrix] = useState("");
  const [stock, setStock] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Charger tous les produits
  const fetchProduits = async () => {
    try {
      console.log('Chargement des produits...');
      const res = await API.get("/produits");
      console.log('Produits reçus:', res.data);
      setProduits(res.data);
      setError("");
    } catch (err) {
      console.error('Erreur chargement produits:', err);
      let errorMessage = "Erreur lors du chargement des produits";
      
      if (err.response) {
        errorMessage = `Erreur ${err.response.status}: ${err.response.data?.message || 'Erreur serveur'}`;
      } else if (err.request) {
        errorMessage = "Impossible de contacter le serveur pour charger les produits";
      }
      
      setError(errorMessage);
    }
  };

  useEffect(() => {
    // Defer the initial fetch to avoid calling setState synchronously inside the effect
    const timer = setTimeout(() => {
      fetchProduits();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Ajouter ou modifier un produit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation des données
    if (!nom.trim()) {
      setError("Le nom du produit est obligatoire");
      return;
    }
    
    if (!prix || isNaN(parseFloat(prix)) || parseFloat(prix) <= 0) {
      setError("Le prix doit être un nombre positif");
      return;
    }
    
    if (!stock || isNaN(parseInt(stock)) || parseInt(stock) < 0) {
      setError("Le stock doit être un nombre entier positif ou zéro");
      return;
    }

    // Vérification spéciale pour la modification
    if (editId && (!editId || editId <= 0)) {
      setError("ID de produit invalide pour la modification");
      console.error('ID de modification invalide:', editId);
      return;
    }

    try {
      const produitData = { 
        nom: nom.trim(), 
        prixUnitaire: parseFloat(prix), 
        stock: parseInt(stock) 
      };

      console.log('Envoi des données produit:', produitData);

      if (editId) {
        console.log('Modification du produit ID:', editId, 'avec données:', produitData);
        // Ajouter l'ID au produitData pour la modification
        const produitAvecId = { ...produitData, id: editId };
        try {
          // Essayer PUT d'abord
          const response = await API.put(`/produits/${editId}`, produitAvecId);
          console.log('Réponse modification PUT:', response.data);
          setSuccess(`Produit "${produitData.nom}" modifié avec succès !`);
        } catch (putError) {
          console.log('PUT échoué, essai avec POST:', putError.message);
          // Si PUT échoue, essayer avec POST (certains backends utilisent POST pour tout)
          const response = await API.post("/produits", produitAvecId);
          console.log('Réponse modification POST:', response.data);
          setSuccess(`Produit "${produitData.nom}" modifié avec succès !`);
        }
      } else {
        console.log('Ajout nouveau produit avec données:', produitData);
        const response = await API.post("/produits", produitData);
        console.log('Réponse ajout:', response.data);
        setSuccess(`Produit "${produitData.nom}" ajouté avec succès !`);
      }

      // Réinitialiser le formulaire
      setNom("");
      setPrix("");
      setStock("");
      setEditId(null);
      setError("");
      
      // Recharger la liste
      await fetchProduits();

      // Masquer le message de succès après 3 secondes
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error('Erreur complète:', err);
      console.error('Réponse du serveur:', err.response);
      
      let errorMessage = "Erreur lors de l'enregistrement du produit";
      
      if (err.response) {
        // Erreur de réponse du serveur
        const status = err.response.status;
        const data = err.response.data;
        
        switch (status) {
          case 400:
            errorMessage = `Données invalides: ${data.message || 'Vérifiez les informations saisies'}`;
            break;
          case 404:
            errorMessage = "Produit non trouvé pour la modification";
            break;
          case 409:
            errorMessage = "Un produit avec ce nom existe déjà";
            break;
          case 500:
            errorMessage = "Erreur interne du serveur";
            break;
          default:
            errorMessage = `Erreur ${status}: ${data.message || 'Erreur inconnue'}`;
        }
      } else if (err.request) {
        // Erreur de réseau
        errorMessage = "Impossible de contacter le serveur. Vérifiez votre connexion.";
      } else {
        // Autre erreur
        errorMessage = `Erreur: ${err.message}`;
      }
      
      setError(errorMessage);
      setSuccess("");
    }
  };

  // Supprimer un produit
  const deleteProduit = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;
    
    try {
      console.log('Suppression du produit ID:', id);
      await API.delete(`/produits/${id}`);
      setSuccess("Produit supprimé avec succès !");
      setError("");
      await fetchProduits();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error('Erreur suppression:', err);
      
      let errorMessage = "Erreur lors de la suppression du produit";
      
      if (err.response) {
        const status = err.response.status;
        switch (status) {
          case 404:
            errorMessage = "Produit non trouvé, il a peut-être déjà été supprimé";
            break;
          case 409:
            errorMessage = "Impossible de supprimer ce produit car il est utilisé dans des devis/factures";
            break;
          default:
            errorMessage = `Erreur ${status}: ${err.response.data?.message || 'Erreur serveur'}`;
        }
      } else if (err.request) {
        errorMessage = "Impossible de contacter le serveur pour supprimer le produit";
      }
      
      setError(errorMessage);
      setSuccess("");
    }
  };

  // Éditer un produit
  const editProduit = (produit) => {
    console.log('Édition du produit:', produit);
    
    if (!produit || !produit.id) {
      setError("Erreur: Données du produit invalides");
      return;
    }
    
    setError(""); // Effacer les erreurs précédentes
    setSuccess(""); // Effacer les messages de succès
    
    setEditId(produit.id);
    setNom(produit.nom || '');
    setPrix(produit.prixUnitaire ? produit.prixUnitaire.toString() : '');
    setStock(produit.stock ? produit.stock.toString() : '0');
    
    console.log('Formulaire mis à jour pour édition:', {
      id: produit.id,
      nom: produit.nom,
      prix: produit.prixUnitaire,
      stock: produit.stock
    });
  };

  // Annuler l'édition
  const cancelEdit = () => {
    console.log('Annulation de l\'édition');
    setEditId(null);
    setNom("");
    setPrix("");
    setStock("");
    setError("");
    setSuccess("");
  };

  return (
    <div className="fade-in" style={{ minHeight: '100vh' }}>
      {/* Header ultra-moderne */}
      <div className="header-modern">
        <div className="container-fluid px-4">
       
        
        
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

        {/* Formulaire ultra-moderne */}
        <div className="card-modern mb-4 hover-lift" style={{ border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', borderRadius: '1rem' }}>
          <div className="card-header" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', borderRadius: '1rem 1rem 0 0' }}>
            <div className="d-flex align-items-center gap-3 text-white">
              <div className="bg-white bg-opacity-20 rounded-circle p-2">
                <i className={`fas fa-${editId ? 'edit' : 'plus-circle'}`}></i>
              </div>
              <div>
                <h5 className="mb-0 text-white fw-semibold">{editId ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}</h5>
                <small className="text-white" style={{ opacity: 0.85 }}>{editId ? 'Mettre à jour les informations' : 'Remplissez les champs ci-dessous'}</small>
              </div>
            </div>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit} className="form-modern">
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-label fw-semibold mb-2">
                      <i className="fas fa-tag text-primary me-2"></i>
                      Nom du produit *
                    </label>
                    <input
                      className="form-input"
                      placeholder="Ex: Ordinateur portable Dell"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      required
                      style={{ padding: '0.75rem 1rem', fontSize: '1rem' }}
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-label fw-semibold mb-2">
                      <i className="fas fa-coins text-primary me-2"></i>
                      Prix unitaire (DH) *
                    </label>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-input"
                        placeholder="1250.00"
                        value={prix}
                        onChange={(e) => setPrix(e.target.value)}
                        required
                        step="0.01"
                        min="0"
                        style={{ padding: '0.75rem 1rem', fontSize: '1rem' }}
                      />
                      <span className="input-group-text bg-primary text-white border-0" style={{ borderRadius: '0 0.375rem 0.375rem 0' }}>DH</span>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-label fw-semibold mb-2">
                      <i className="fas fa-warehouse text-primary me-2"></i>
                      Stock disponible *
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="25"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      required
                      min="0"
                      style={{ padding: '0.75rem 1rem', fontSize: '1rem' }}
                    />
                  </div>
                </div>
              </div>

              <hr className="my-4" style={{ border: 'none', height: '1px', background: 'linear-gradient(90deg, transparent, var(--border-color), transparent)' }} />

              <div className="d-flex gap-3 justify-content-end">
                <button type="submit" className="btn-modern px-4 py-2" style={{ borderRadius: '0.5rem', fontWeight: '500' }}>
                  <i className={`fas fa-${editId ? 'save' : 'plus'} me-2`}></i>
                  {editId ? 'Sauvegarder les modifications' : 'Ajouter le produit'}
                </button>
                {editId && (
                  <button 
                    type="button" 
                    className="btn-modern btn-outline px-4 py-2"
                    onClick={cancelEdit}
                    style={{ borderRadius: '0.5rem', fontWeight: '500' }}
                  >
                    <i className="fas fa-times me-2"></i>
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Catalogue de produits en cartes ultra-modernes */}
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-primary rounded-circle p-2">
                <i className="fas fa-th-large text-white"></i>
              </div>
              <div>
                <h4 className="mb-0 fw-bold">Catalogue des Produits</h4>
                <p className="text-muted mb-0">Gérez votre inventaire facilement</p>
              </div>
            </div>
            <div className="d-flex gap-2">
              <span className="badge bg-success px-3 py-2">
                <i className="fas fa-check-circle me-1"></i>
                {produits.filter(p => p.stock > 10).length} En stock
              </span>
              <span className="badge bg-warning px-3 py-2">
                <i className="fas fa-exclamation-triangle me-1"></i>
                {produits.filter(p => p.stock > 0 && p.stock <= 10).length} Stock faible
              </span>
              <span className="badge bg-danger px-3 py-2">
                <i className="fas fa-times-circle me-1"></i>
                {produits.filter(p => p.stock === 0).length} Rupture
              </span>
            </div>
          </div>

          {produits.length > 0 ? (
            <div className="row g-4">
              {produits.map((produit, index) => (
                <div key={produit.id} className="col-lg-4 col-md-6">
                  <div className="card-modern hover-lift h-100" 
                       style={{ 
                         border: 'none', 
                         boxShadow: '0 8px 30px rgba(0,0,0,0.08)', 
                         borderRadius: '1rem',
                         transition: 'all 0.3s ease'
                       }}>
                    
                    {/* Header de la carte avec statut */}
                    <div className={`card-header border-0 text-white`}
                         style={{ 
                           background: produit.stock > 10 ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
                                      produit.stock > 0 ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
                                      'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                           borderRadius: '1rem 1rem 0 0'
                         }}>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2">
                          <div className="bg-white bg-opacity-20 rounded-circle p-2">
                            <i className="fas fa-box text-white"></i>
                          </div>
                          <span className="fw-semibold">#{index + 1}</span>
                        </div>
                        <div className="text-end">
                          <div className="h5 mb-0 fw-bold">{produit.stock}</div>
                          <small className="text-white" style={{ opacity: 0.9 }}>unités</small>
                        </div>
                      </div>
                    </div>

                    {/* Corps de la carte */}
                    <div className="card-body p-4">
                      <div className="mb-3">
                        <h5 className="fw-bold mb-2" style={{ color: 'var(--gray-dark)' }}>
                          {produit.nom}
                        </h5>
                        <div className="d-flex align-items-center gap-2 mb-3">
                          <div className="bg-primary rounded-pill px-3 py-1">
                            <i className="fas fa-coins text-white me-1"></i>
                            <span className="text-white fw-bold">{produit.prixUnitaire.toFixed(2)} DH</span>
                          </div>
                        </div>
                      </div>

                      {/* Indicateur de stock détaillé */}
                      <div className="mb-4 p-3 rounded" style={{ backgroundColor: 'var(--gray-light)' }}>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <span className="fw-semibold">
                            <i className="fas fa-warehouse text-primary me-2"></i>
                            Stock disponible
                          </span>
                          {produit.stock > 10 ? (
                            <span className="badge bg-success">
                              <i className="fas fa-check-circle me-1"></i>
                              Suffisant
                            </span>
                          ) : produit.stock > 0 ? (
                            <span className="badge bg-warning">
                              <i className="fas fa-exclamation-triangle me-1"></i>
                              Faible
                            </span>
                          ) : (
                            <span className="badge bg-danger">
                              <i className="fas fa-times-circle me-1"></i>
                              Rupture
                            </span>
                          )}
                        </div>
                        <div className="text-muted small">
                          {produit.stock === 0 ? 'Aucune unité en stock' : 
                           produit.stock === 1 ? '1 unité disponible' : 
                           `${produit.stock} unités disponibles`}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="d-flex gap-2">
                        <button
                          className="btn-modern btn-outline flex-grow-1"
                          onClick={() => editProduit(produit)}
                          style={{ borderRadius: '0.5rem' }}
                        >
                          <i className="fas fa-edit me-2"></i>
                          Modifier
                        </button>
                        <button 
                          className="btn-modern btn-secondary px-3"
                          onClick={() => deleteProduit(produit.id)}
                          title="Supprimer ce produit"
                          style={{ borderRadius: '0.5rem' }}
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
            <div className="card-modern text-center p-5" style={{ border: '2px dashed var(--border-color)', borderRadius: '1rem' }}>
              <div className="mb-4">
                <i className="fas fa-box-open text-muted" style={{ fontSize: '5rem', opacity: 0.3 }}></i>
              </div>
              <h4 className="text-muted mb-3">Aucun produit dans votre catalogue</h4>
              <p className="text-muted mb-4">
                Commencez par ajouter votre premier produit pour construire votre inventaire.
              </p>
              <button 
                className="btn-modern px-4 py-2"
                onClick={() => document.querySelector('input[placeholder*="nom"]').focus()}
                style={{ borderRadius: '0.5rem' }}
              >
                <i className="fas fa-plus me-2"></i>
                Ajouter un produit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
