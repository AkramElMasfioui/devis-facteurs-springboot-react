import React, { useState, useEffect } from "react";
import axios from "axios";

export default function DevisApp() {
  const [devisList, setDevisList] = useState([]);
  const [clients, setClients] = useState([]);
  const [produits, setProduits] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [details, setDetails] = useState([{ produitId: "", quantite: 1 }]);

  // Charger tous les devis, clients et produits
  useEffect(() => {
    axios.get("/api/devis").then(res => setDevisList(res.data));
    axios.get("/api/clients").then(res => setClients(res.data));
    axios.get("/api/produits").then(res => setProduits(res.data));
  }, []);

  const handleDetailChange = (index, field, value) => {
    const newDetails = [...details];
    newDetails[index][field] = value;
    setDetails(newDetails);
  };

  const addDetail = () => setDetails([...details, { produitId: "", quantite: 1 }]);
  const removeDetail = (index) => setDetails(details.filter((_, i) => i !== index));

  const createDevis = () => {
    const payload = details.map(d => ({ produitId: d.produitId, quantite: d.quantite }));
    axios.post(`/api/devis/create/${selectedClient}`, payload)
      .then(() => {
        setDetails([{ produitId: "", quantite: 1 }]);
        setSelectedClient("");
        axios.get("/api/devis").then(res => setDevisList(res.data));
      })
      .catch(err => alert(err.response?.data?.message || err.message));
  };

  const validerDevis = (id) => {
    axios.put(`/api/devis/${id}/valider`)
      .then(() => axios.get("/api/devis").then(res => setDevisList(res.data)))
      .catch(err => alert(err.response?.data?.message || err.message));
  };

  const deleteDevis = (id) => {
    axios.delete(`/api/devis/${id}`)
      .then(() => axios.get("/api/devis").then(res => setDevisList(res.data)))
      .catch(err => alert(err.response?.data?.message || err.message));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Créer un nouveau devis</h2>
      <div>
        <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)}>
          <option value="">Sélectionner un client</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
        </select>

        {details.map((d, index) => (
          <div key={index} style={{ marginBottom: "5px" }}>
            <select
              value={d.produitId}
              onChange={e => handleDetailChange(index, "produitId", e.target.value)}
            >
              <option value="">Sélectionner un produit</option>
              {produits.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
            </select>
            <input
              type="number"
              min="1"
              value={d.quantite}
              onChange={e => handleDetailChange(index, "quantite", e.target.value)}
            />
            <button onClick={() => removeDetail(index)}>Supprimer</button>
          </div>
        ))}

        <button onClick={addDetail}>Ajouter un produit</button>
        <button onClick={createDevis}>Créer Devis</button>
      </div>

      <h2>Liste des devis</h2>
      {devisList.map(d => (
        <div key={d.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <p>ID: {d.id}</p>
          <p>Client: {d.client?.nom || "N/A"}</p>
          <p>Statut: {d.statut}</p>
          <p>Total HT: {d.totalHT} | Total TTC: {d.totalTTC}</p>
          <p>Détails:</p>
          <ul>
            {d.details.map(detail => (
              <li key={detail.id}>
                Produit: {detail.produit?.nom || detail.produitId}, Quantité: {detail.quantite}, Prix: {detail.prix}
              </li>
            ))}
          </ul>
          {d.statut !== "VALIDÉ" && <button onClick={() => validerDevis(d.id)}>Valider</button>}
          <button onClick={() => deleteDevis(d.id)}>Supprimer</button>
        </div>
      ))}
    </div>
  );
}
