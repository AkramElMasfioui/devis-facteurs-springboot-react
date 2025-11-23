package com.gestion_devis_factures_backend.devis_facteurs.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Entity
@Data
public class Devis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonBackReference
    private Client client;

    private Date date = new Date();
    private String statut = "EN_ATTENTE";

    @Column(name = "total_ht")
    private Double totalHT = 0.0;

    @Column(name = "total_ttc")
    private Double totalTTC = 0.0;

    @OneToMany(mappedBy = "devis", cascade = CascadeType.ALL)
    private List<DevisDetail> details;
}
