import React, { useState, useEffect } from "react";
import axios from "axios";

export default function FacturesApp() {
  const [factures, setFactures] = useState([]);
  const [modesPaiement] = useState(["Espèces", "Carte", "Virement"]);

  // Charger toutes les factures
  useEffect(() => {
    axios.get("/api/factures")
      .then(res => setFactures(res.data))
      .catch(err => console.error(err));
  }, []);

  // Changer le mode de paiement et mettre à jour le statut
  const handleModePaiement = (factureId, mode) => {
    axios.put(`/api/factures/${factureId}/paiement`, { modePaiement: mode })
      .then(res => {
        setFactures(factures.map(f => f.id === factureId ? res.data : f));
      })
      .catch(err => alert(err.response?.data?.message || err.message));
  };

  // Supprimer une facture
  const deleteFacture = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette facture ?")) {
      axios.delete(`/api/factures/${id}`)
        .then(() => setFactures(factures.filter(f => f.id !== id)))
        .catch(err => alert(err.response?.data?.message || err.message));
    }
  };

  // Télécharger PDF
  const downloadPdf = (factureId) => {
    fetch(`/api/factures/${factureId}/pdf`, {
      method: "GET",
      headers: { "Content-Type": "application/pdf" },
    })
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `facture_${factureId}.pdf`;
        a.click();
      })
      .catch(err => alert(err?.message ? `Erreur téléchargement PDF: ${err.message}` : "Erreur téléchargement PDF"));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Factures</h2>
      {factures.map(f => (
        <div key={f.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <p>ID: {f.id}</p>
          <p>Client: {f.client?.nom || "N/A"}</p>
          <p>Date: {new Date(f.date).toLocaleString()}</p>
          <p>Statut: {f.statut}</p>
          <p>Total HT: {f.totalHT} | Total TTC: {f.totalTTC}</p>
          <p>Détails:</p>
          <ul>
            {f.details.map(d => (
              <li key={d.id}>
                Produit: {d.produit?.nom || d.produitId}, Quantité: {d.quantite}, Prix: {d.prix}
              </li>
            ))}
          </ul>
          <div>
            <label>Mode de paiement: </label>
            <select
              value={f.modePaiement || ""}
              onChange={(e) => handleModePaiement(f.id, e.target.value)}
            >
              <option value="">Sélectionner</option>
              {modesPaiement.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {f.statut === "PAYÉ" && (
            <button onClick={() => downloadPdf(f.id)} style={{ marginTop: "5px" }}>
              Télécharger PDF
            </button>
          )}

          <button onClick={() => deleteFacture(f.id)} style={{ marginTop: "5px", marginLeft: "10px" }}>
            Supprimer
          </button>
        </div>
      ))}
    </div>
  );
}
