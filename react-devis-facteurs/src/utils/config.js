// Configuration de l'API
export const API_BASE_URL = "http://localhost:8080/api";

export const API_ENDPOINTS = {
  CLIENTS: `${API_BASE_URL}/clients`,
  PRODUITS: `${API_BASE_URL}/produits`,
  DEVIS: `${API_BASE_URL}/devis`,
  FACTURES: `${API_BASE_URL}/factures`,
};

// Configuration générale
export const APP_CONFIG = {
  APP_NAME: "Gestion Devis & Factures",
  VERSION: "1.0.0",
  ITEMS_PER_PAGE: 10,
};