package com.gestion_devis_factures_backend.devis_facteurs.dto;



import lombok.Data;

@Data
public class FactureDetailRequest {
    private Long produitId;
    private int quantite;
}

