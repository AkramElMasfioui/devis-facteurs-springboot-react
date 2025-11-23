package com.gestion_devis_factures_backend.devis_facteurs.service;

import com.gestion_devis_factures_backend.devis_facteurs.model.Produit;
import com.gestion_devis_factures_backend.devis_facteurs.repository.ProduitRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ProduitService {

    private final ProduitRepository produitRepository;

    public List<Produit> getAll() {
        return produitRepository.findAll();
    }

    public Produit getById(Long id) {
        return produitRepository.findById(id).orElseThrow();
    }

    public Produit save(Produit produit) {
        return produitRepository.save(produit);
    }

    public void delete(Long id) {
        produitRepository.deleteById(id);
    }
}
