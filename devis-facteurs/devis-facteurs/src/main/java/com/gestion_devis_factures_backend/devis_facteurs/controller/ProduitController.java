package com.gestion_devis_factures_backend.devis_facteurs.controller;

import com.gestion_devis_factures_backend.devis_facteurs.model.Client;
import com.gestion_devis_factures_backend.devis_facteurs.model.Produit;
import com.gestion_devis_factures_backend.devis_facteurs.service.ProduitService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produits")
@RequiredArgsConstructor
@CrossOrigin
public class ProduitController {

    private final ProduitService produitService;

    @GetMapping
    public List<Produit> getAll() {
        return produitService.getAll();
    }

    @PostMapping
    public Produit save(@RequestBody Produit produit) {
        return produitService.save(produit);
    }



    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        produitService.delete(id);
    }
}
