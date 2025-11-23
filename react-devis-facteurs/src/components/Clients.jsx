import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/clients";

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
      const res = await axios.get(API_URL);
      setClients(res.data);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement");
    }
  };

  // load on start
  useEffect(() => {
    let mounted = true;
    const loadClients = async () => {
      try {
        const res = await axios.get(API_URL);
        if (mounted) setClients(res.data);
      } catch (err) {
        console.error(err);
        if (mounted) setError("Erreur lors du chargement");
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
      if (editId) {
        await axios.put(`${API_URL}/update/${editId}`, {
          nom,
          email,
          telephone,
        });
      } else {
        await axios.post(`${API_URL}/createclient`, {
          nom,
          email,
          telephone,
        });
      }

      setNom("");
      setEmail("");
      setTelephone("");
      setEditId(null);
      fetchClients();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'enregistrement");
    }
  };

  // ------------------------- DELETE -------------------------
  const deleteClient = async (id) => {
    if (!window.confirm("Supprimer ?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchClients();
    } catch (err) {
      console.error(err);
      setError("Erreur de suppression");
    }
  };

  // ------------------------- SEARCH BY TELEPHONE -------------------------
  const searchByTelephone = async () => {
    try {
      const res = await axios.get(`${API_URL}/search`, {
        params: { telephone: searchPhone },
      });
      setSearchResult(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setSearchResult(null);
      setError("Aucun client trouvé");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Gestion des Clients</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
        <input
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Téléphone"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          required
        />

        <button type="submit">{editId ? "Modifier" : "Ajouter"}</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <hr />

      {/* SEARCH */}
      <h3>Recherche par téléphone</h3>
      <input
        placeholder="Téléphone"
        value={searchPhone}
        onChange={(e) => setSearchPhone(e.target.value)}
      />
      <button onClick={searchByTelephone}>Rechercher</button>

      {searchResult && (
        <p>
          {searchResult.nom} - {searchResult.email} - {searchResult.telephone}
        </p>
      )}

      <hr />

      {/* LISTE */}
      <h3>Liste des clients</h3>
      <ul>
        {clients.map((c) => (
          <li key={c.id}>
            {c.nom} - {c.email} - {c.telephone}
            <button className="btn-edit"
              onClick={() => {
                setEditId(c.id);
                setNom(c.nom);
                setEmail(c.email);
                setTelephone(c.telephone);
              }}
            >
              Modifier
            </button>
            <button className="btn-delete" onClick={() => deleteClient(c.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
