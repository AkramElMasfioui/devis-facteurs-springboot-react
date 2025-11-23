package com.gestion_devis_factures_backend.devis_facteurs.repository;

import com.gestion_devis_factures_backend.devis_facteurs.model.DevisDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DevisDetailRepository extends JpaRepository<DevisDetail, Long> {
}

