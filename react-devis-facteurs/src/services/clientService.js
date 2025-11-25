import axios from 'axios';
import { API_ENDPOINTS } from '../utils/config';

const clientService = {
  // Récupérer tous les clients
  getAll: async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.CLIENTS);
      return response.data;
    } catch {
      throw new Error('Erreur lors du chargement des clients');
    }
  },

  // Créer un nouveau client
  create: async (clientData) => {
    try {
      const response = await axios.post(`${API_ENDPOINTS.CLIENTS}/createclient`, clientData);
      return response.data;
    } catch {
      throw new Error('Erreur lors de la création du client');
    }
  },

  // Mettre à jour un client
  update: async (id, clientData) => {
    try {
      const response = await axios.put(`${API_ENDPOINTS.CLIENTS}/update/${id}`, clientData);
      return response.data;
    } catch {
      throw new Error('Erreur lors de la mise à jour du client');
    }
  },

  // Supprimer un client
  delete: async (id) => {
    try {
      await axios.delete(`${API_ENDPOINTS.CLIENTS}/${id}`);
      return true;
    } catch {
      throw new Error('Erreur lors de la suppression du client');
    }
  },

  // Rechercher par téléphone
  searchByPhone: async (telephone) => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.CLIENTS}/search`, {
        params: { telephone }
      });
      return response.data;
    } catch {
      throw new Error('Aucun client trouvé');
    }
  },
};

export default clientService;