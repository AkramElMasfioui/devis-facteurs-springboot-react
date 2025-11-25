# Gestion des Devis et Factures - Spring Boot, MySQL, React

Application permettant de gérer les clients, produits, devis et factures. Elle propose la création, modification, calcul HT/TVA/TTC, validation de devis, conversion en facture et génération PDF. Backend développé avec Spring Boot et MySQL, frontend réalisé avec React.

## Fonctionnalités
- Gestion des clients
- Gestion des produits
- Création et édition des devis
- Ajout de lignes (produit + quantité)
- Calcul automatique HT / TVA / TTC
- Validation des devis
- Conversion des devis en factures
- Génération PDF
- API REST pour le frontend React

## Technologies utilisées
Backend :
- Java 17
- Spring Boot
- Spring MVC
- Spring Data JPA
- MySQL
- Maven
Frontend :
- React JS
- Bootstrap / CSS
- Axios ou Fetch API

## Structure des entités
Client : id, nom, email, téléphone, adresse  
Produit : id, nom, prix_unitaire, stock, categorie  
Devis : id, client_id, date, total_ht, total_ttc, statut  
Devis détail : id, devis_id, produit_id, quantite, prix_unitaire  
Facture : id, client_id, date, montant_ttc, mode_paiement, statut  

## API REST (exemples)
GET /clients  
POST /clients  
PUT /clients/{id}  
DELETE /clients/{id}  

GET /produits  
POST /produits  
PUT /produits/{id}  
DELETE /produits/{id}  

POST /devis  
GET /devis/{id}  
PUT /devis/{id}  
PUT /devis/{id}/valider  

POST /factures  
GET /factures  
GET /factures/{id}  

## Installation backend
1. Créer la base MySQL :
   CREATE DATABASE gestion_devis_factures;

2. Configurer application.properties :
   spring.datasource.url=jdbc:mysql://localhost:3306/gestion_devis_factures  
   spring.datasource.username=root  
   spring.datasource.password=  
   spring.jpa.hibernate.ddl-auto=update  

3. Lancer le backend : mvn spring-boot:run

## Installation frontend
1. Installer les dépendances : npm install  
2. Lancer le projet : npm start

## Description courte (350 caractères)
Application de gestion des devis et factures : clients, produits, devis, factures, calcul HT/TVA/TTC, validation, conversion en facture et PDF. Backend Spring Boot + MySQL, frontend React.
