package com.gestion_devis_factures_backend.devis_facteurs.repository;

import com.gestion_devis_factures_backend.devis_facteurs.model.Devis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DevisRepository extends JpaRepository<Devis,Long> {
}
