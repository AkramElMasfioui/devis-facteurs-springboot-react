import React, { useState, useEffect } from "react";
import axios from "axios";

export default function FacturesApp() {
  const [factures, setFactures] = useState([]);
  const [modesPaiement] = useState(["Espèces", "Carte", "Virement", "Chèque"]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Charger toutes les factures
  const fetchFactures = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/factures");
      setFactures(res.data);
      setError("");
    } catch (err) {
      console.error('Erreur chargement factures:', err);
      setError("Erreur lors du chargement des factures");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFactures();
  }, []);

  // Changer le mode de paiement et mettre à jour le statut
  const handleModePaiement = async (factureId, mode) => {
    try {
      setLoading(true);
      const res = await axios.put(`/api/factures/${factureId}/paiement`, { modePaiement: mode });
      setFactures(factures.map(f => f.id === factureId ? res.data : f));
      setSuccess(`Mode de paiement mis à jour: ${mode}`);
      setError("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error('Erreur mode paiement:', err);
      setError(err.response?.data?.message || "Erreur lors de la mise à jour du mode de paiement");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une facture
  const deleteFacture = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette facture ?")) return;
    
    try {
      setLoading(true);
      await axios.delete(`/api/factures/${id}`);
      setFactures(factures.filter(f => f.id !== id));
      setSuccess("Facture supprimée avec succès !");
      setError("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error('Erreur suppression:', err);
      setError(err.response?.data?.message || "Erreur lors de la suppression de la facture");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  // Télécharger PDF
  const downloadPdf = async (factureId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/factures/${factureId}/pdf`, {
        method: "GET",
        headers: { "Content-Type": "application/pdf" },
      });
      
      if (!response.ok) throw new Error('Erreur téléchargement');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `facture_${factureId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      setSuccess("PDF téléchargé avec succès !");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error('Erreur PDF:', err);
      setError("Erreur lors du téléchargement du PDF");
    } finally {
      setLoading(false);
    }
  };

  // Obtenir la couleur du badge selon le statut
  const getStatusBadge = (statut) => {
    switch (statut) {
      case 'PAYÉ': return 'bg-success';
      case 'EN_ATTENTE': return 'bg-warning';
      case 'ANNULÉ': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="fade-in" style={{ minHeight: '100vh' }}>
      {/* Header ultra-moderne */}
      <div className="header-modern">
        <div className="container-fluid px-4">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-white bg-opacity-25 rounded-circle p-3">
                <i className="fas fa-receipt icon-lg text-white"></i>
              </div>
              <div>
                <h1 className="mb-0 text-white fw-bold">Gestion des Factures</h1>
                <p className="mb-0 text-white" style={{ opacity: 0.8 }}>Suivez vos paiements et téléchargez vos PDF</p>
              </div>
            </div>
            <div className="d-flex gap-4 text-white">
              <div className="text-center">
                <div className="h4 mb-0 fw-bold">{factures.length}</div>
                <small className="text-white" style={{ opacity: 0.9 }}>Factures</small>
              </div>
              <div className="text-center">
                <div className="h4 mb-0 fw-bold">{factures.filter(f => f.statut === 'PAYÉ').length}</div>
                <small className="text-white" style={{ opacity: 0.9 }}>Payées</small>
              </div>
              <div className="text-center">
                <div className="h4 mb-0 fw-bold">{factures.filter(f => f.statut === 'EN_ATTENTE').length}</div>
                <small className="text-white" style={{ opacity: 0.9 }}>En attente</small>
              </div>
            </div>
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

        {loading && (
          <div className="alert-modern alert-info mb-4">
            <i className="fas fa-spinner fa-spin"></i>
            <strong>Chargement en cours...</strong>
          </div>
        )}

        {/* Catalogue de factures en cartes ultra-modernes */}
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-primary rounded-circle p-2">
                <i className="fas fa-file-invoice text-white"></i>
              </div>
              <div>
                <h4 className="mb-0 fw-bold">Liste des Factures</h4>
                <p className="text-muted mb-0">Gérez vos factures et paiements</p>
              </div>
            </div>
            <div className="d-flex gap-2">
              <span className="badge bg-success px-3 py-2">
                <i className="fas fa-check-circle me-1"></i>
                {factures.filter(f => f.statut === 'PAYÉ').length} Payées
              </span>
              <span className="badge bg-warning px-3 py-2">
                <i className="fas fa-clock me-1"></i>
                {factures.filter(f => f.statut === 'EN_ATTENTE').length} En attente
              </span>
              <span className="badge bg-danger px-3 py-2">
                <i className="fas fa-times-circle me-1"></i>
                {factures.filter(f => f.statut === 'ANNULÉ').length} Annulées
              </span>
            </div>
          </div>

          {factures.length > 0 ? (
            <div className="row g-4">
              {factures.map((facture) => (
                <div key={facture.id} className="col-lg-6 col-xl-4">
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
                           background: facture.statut === 'PAYÉ' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
                                      facture.statut === 'EN_ATTENTE' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
                                      'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                           borderRadius: '1rem 1rem 0 0'
                         }}>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2">
                          <div className="bg-white bg-opacity-20 rounded-circle p-2">
                            <i className="fas fa-file-invoice text-white"></i>
                          </div>
                          <span className="fw-semibold">Facture #{facture.id}</span>
                        </div>
                        <span className={`badge ${getStatusBadge(facture.statut)}`}>
                          {facture.statut === 'PAYÉ' ? 'Payée' :
                           facture.statut === 'EN_ATTENTE' ? 'En attente' :
                           facture.statut === 'ANNULÉ' ? 'Annulée' : facture.statut}
                        </span>
                      </div>
                    </div>

                    {/* Corps de la carte */}
                    <div className="card-body p-4">
                      <div className="mb-3">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <i className="fas fa-user text-primary"></i>
                          <strong>Client:</strong>
                        </div>
                        <div className="text-muted">{facture.client?.nom || "Client non défini"}</div>
                      </div>

                      <div className="mb-3">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <i className="fas fa-calendar text-primary"></i>
                          <strong>Date:</strong>
                        </div>
                        <div className="text-muted">{new Date(facture.date).toLocaleString('fr-FR')}</div>
                      </div>

                      <div className="mb-3">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <i className="fas fa-euro-sign text-primary"></i>
                          <strong>Montants:</strong>
                        </div>
                        <div className="row">
                          <div className="col-6">
                            <small className="text-muted">HT:</small>
                            <div className="fw-bold">{facture.totalHT} DH</div>
                          </div>
                          <div className="col-6">
                            <small className="text-muted">TTC:</small>
                            <div className="fw-bold text-primary">{facture.totalTTC} DH</div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <i className="fas fa-shopping-cart text-primary"></i>
                          <strong>Produits ({facture.details?.length || 0}):</strong>
                        </div>
                        <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
                          {facture.details?.map(detail => (
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

                      {/* Mode de paiement */}
                      <div className="mb-4">
                        <label className="form-label fw-semibold mb-2">
                          <i className="fas fa-credit-card text-primary me-2"></i>
                          Mode de paiement:
                        </label>
                        <select
                          className="form-input"
                          value={facture.modePaiement || ""}
                          onChange={(e) => handleModePaiement(facture.id, e.target.value)}
                          disabled={loading}
                        >
                          <option value="">-- Sélectionner --</option>
                          {modesPaiement.map(mode => (
                            <option key={mode} value={mode}>{mode}</option>
                          ))}
                        </select>
                      </div>

                      {/* Actions */}
                      <div className="d-flex gap-2">
                        {facture.statut === "PAYÉ" && (
                          <button
                            className="btn-modern btn-outline flex-grow-1"
                            onClick={() => downloadPdf(facture.id)}
                            disabled={loading}
                            style={{ borderRadius: '0.5rem' }}
                          >
                            <i className="fas fa-download me-2"></i>
                            PDF
                          </button>
                        )}
                        <button 
                          className="btn-modern btn-secondary px-3"
                          onClick={() => deleteFacture(facture.id)}
                          disabled={loading}
                          title="Supprimer cette facture"
                          style={{ borderRadius: '0.5rem' }}
                        >
                          <i className="fas fa-trash me-2"></i>
                          Supprimer
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
                <i className="fas fa-file-invoice text-muted" style={{ fontSize: '5rem', opacity: 0.3 }}></i>
              </div>
              <h4 className="text-muted mb-3">Aucune facture trouvée</h4>
              <p className="text-muted mb-4">
                Les factures apparaîtront ici une fois générées à partir des devis validés.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
