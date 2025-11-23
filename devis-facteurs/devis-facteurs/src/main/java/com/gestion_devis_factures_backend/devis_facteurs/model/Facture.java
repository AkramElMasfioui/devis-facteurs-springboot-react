package com.gestion_devis_factures_backend.devis_facteurs.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Facture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Client client;

    @Temporal(TemporalType.TIMESTAMP)
    private Date date = new Date();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DevisDetail> details;

    private String numero;

    private Double totalHT = 0.0;   // initialisé à 0.0
    private Double totalTTC = 0.0;  // initialisé à 0.0

    private String modePaiement;
    private String statut = "En attente de paiement";
}
