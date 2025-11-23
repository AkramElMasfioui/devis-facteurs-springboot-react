package com.gestion_devis_factures_backend.devis_facteurs.repository;

import com.gestion_devis_factures_backend.devis_facteurs.model.Produit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProduitRepository extends JpaRepository<Produit, Long> {
}
