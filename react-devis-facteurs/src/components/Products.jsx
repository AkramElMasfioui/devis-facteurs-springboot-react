import React, { useState, useEffect } from "react";
import { API } from "../api";

export default function Produits() {
  const [produits, setProduits] = useState([]);
  const [nom, setNom] = useState("");
  const [prix, setPrix] = useState("");
  const [stock, setStock] = useState("");

  // Charger tous les produits
  useEffect(() => {
    API.get("/produits").then((res) => setProduits(res.data));
  }, []);

  // Ajouter un produit
  const addProduit = async (e) => {
    e.preventDefault();
    await API.post("/produits", { nom, prixUnitaire: parseFloat(prix), stock: parseInt(stock) });
    setNom("");
    setPrix("");
    setStock("");
    const res = await API.get("/produits");
    setProduits(res.data);
  };

  return (
    <div>
      <h2>Produits</h2>
      <form onSubmit={addProduit}>
        <input
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Prix Unitaire"
          value={prix}
          onChange={(e) => setPrix(e.target.value)}
          required
          step="0.01"
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
        <button type="submit">Ajouter</button>
      </form>
      <ul>
        {produits.map((p) => (
          <li key={p.id}>
            {p.nom} - {p.prixUnitaire} DH - Stock: {p.stock}
          </li>
        ))}
      </ul>
    </div>
  );
}
