package com.gestion_devis_factures_backend.devis_facteurs.repository;

import com.gestion_devis_factures_backend.devis_facteurs.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByTelephone(String telephone);
}


