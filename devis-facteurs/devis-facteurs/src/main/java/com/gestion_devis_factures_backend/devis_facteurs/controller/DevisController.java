package com.gestion_devis_factures_backend.devis_facteurs.controller;

import com.gestion_devis_factures_backend.devis_facteurs.dto.DevisDetailRequest;
import com.gestion_devis_factures_backend.devis_facteurs.model.Devis;
import com.gestion_devis_factures_backend.devis_facteurs.service.DevisService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devis")
@RequiredArgsConstructor
public class DevisController {

    private final DevisService devisService;

    @PostMapping("/create/{clientId}")
    public Devis createDevis(@PathVariable Long clientId,
                             @RequestBody List<DevisDetailRequest> details) {
        return devisService.createDevis(clientId, details);
    }

    @PutMapping("/{id}/valider")
    public Devis validerDevis(@PathVariable Long id) {
        return devisService.validerDevis(id);
    }

    @GetMapping
    public List<Devis> getAll() {
        return devisService.getAllDevis();
    }



    @GetMapping("/{id}")
    public Devis getDevis(@PathVariable Long id) {
        return devisService.getDevis(id);
    }

    @DeleteMapping("/{id}")
    public void deleteDevis(@PathVariable Long id) {
        devisService.deleteDevis(id);
    }
}
