package com.gestion_devis_factures_backend.devis_facteurs.controller;

import com.gestion_devis_factures_backend.devis_facteurs.dto.ModePaiementRequest;
import com.gestion_devis_factures_backend.devis_facteurs.model.Devis;
import com.gestion_devis_factures_backend.devis_facteurs.model.Facture;
import com.gestion_devis_factures_backend.devis_facteurs.service.DevisService;
import com.gestion_devis_factures_backend.devis_facteurs.service.FactureService;
import com.gestion_devis_factures_backend.devis_facteurs.service.PdfService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/factures")
@RequiredArgsConstructor
public class FactureController {

    private final FactureService factureService;
    private final DevisService devisService;
    private final PdfService pdfService;

    // Récupérer toutes les factures
    @GetMapping
    public List<Facture> getAllFactures() {
        return factureService.getAllFactures();
    }

    // Récupérer une facture par id
    @GetMapping("/{id}")
    public Facture getFacture(@PathVariable Long id) {
        return factureService.getFacture(id);
    }
    // Modifier le mode de paiement et mettre à jour le statut
    @PutMapping("/{id}/paiement")
    public Facture updateModePaiement(@PathVariable Long id,
                                      @RequestBody ModePaiementRequest request) {
        return factureService.updateModePaiement(id, request.getModePaiement());
    }

    // Supprimer une facture
    @DeleteMapping("/{id}")
    public void deleteFacture(@PathVariable Long id) {
        factureService.deleteFacture(id);
    }

    // Générer une facture directement
    @PostMapping("/create")
    public Facture createFactureDirect(@RequestBody Facture facture) {
        return factureService.createFactureDirect(facture);
    }

    // Générer une facture à partir d'un devis validé
    @PostMapping("/from-devis/{devisId}")
    public Facture createFactureFromDevis(@PathVariable Long devisId) {
        Devis devis = devisService.getDevis(devisId);
        if (!"VALIDE".equalsIgnoreCase(devis.getStatut())) {
            throw new IllegalArgumentException("Le devis doit être validé pour générer une facture !");
        }
        return factureService.createFactureFromDevis(devis);
    }
    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> generatePdf(@PathVariable Long id) {
        Facture facture = factureService.getFacture(id);

        // Vérifier que la facture est payée
        if (!"PAYÉ".equalsIgnoreCase(facture.getStatut())) {
            throw new IllegalArgumentException("La facture doit être payée pour générer le PDF !");
        }

        // Génération du PDF via PdfService
        byte[] pdfBytes = pdfService.generatePdf(facture);

        // Retourner le PDF avec le bon header
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=facture_" + facture.getId() + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
