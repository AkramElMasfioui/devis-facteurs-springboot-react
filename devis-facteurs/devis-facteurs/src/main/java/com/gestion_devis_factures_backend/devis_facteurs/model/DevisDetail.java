package com.gestion_devis_factures_backend.devis_facteurs.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class DevisDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonIgnore
    private Devis devis;



    @ManyToOne
    private Produit produit;

    private int quantite;
    private Double prixUnitaire;


    private Double prix; // total ligne
}
