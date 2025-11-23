package com.gestion_devis_factures_backend.devis_facteurs.service;

import com.gestion_devis_factures_backend.devis_facteurs.model.Devis;
import com.gestion_devis_factures_backend.devis_facteurs.model.DevisDetail;
import com.gestion_devis_factures_backend.devis_facteurs.model.Facture;
import com.gestion_devis_factures_backend.devis_facteurs.repository.FactureRepository;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.element.Paragraph;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.swing.text.Document;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.PdfDocument;

import com.itextpdf.layout.element.Paragraph;

@Service
@RequiredArgsConstructor
public class FactureService {

    private final FactureRepository factureRepository;

    // Génération directe d'une facture
    @Transactional
    public Facture createFactureDirect(Facture facture) {
        // Initialiser les totaux si null
        facture.setTotalHT(facture.getTotalHT() != null ? facture.getTotalHT() : 0.0);
        facture.setTotalTTC(facture.getTotalTTC() != null ? facture.getTotalTTC() : facture.getTotalHT() * 1.2);
        facture.setModePaiement(facture.getModePaiement() != null ? facture.getModePaiement() : "Non défini");
        facture.setDate(new Date());
        facture.setNumero("FAC-" + System.currentTimeMillis());
        facture.setStatut("En attente de paiement");
        return factureRepository.save(facture);
    }

    // Création d'une facture à partir d'un devis
    @Transactional
    public Facture createFactureFromDevis(Devis devis) {
        if (devis == null || devis.getDetails() == null || devis.getDetails().isEmpty()) {
            throw new IllegalArgumentException("Le devis n'a pas de détails !");
        }

        Facture facture = new Facture();
        facture.setClient(devis.getClient());
        facture.setNumero("F-001");

// Crée une nouvelle liste de détails pour la facture
        List<DevisDetail> factureDetails = new ArrayList<>();
        for (DevisDetail detail : devis.getDetails()) {
            DevisDetail newDetail = new DevisDetail();
            newDetail.setProduit(detail.getProduit());
            newDetail.setQuantite(detail.getQuantite());
            newDetail.setPrix(detail.getPrix());
            factureDetails.add(newDetail);
        }
        facture.setDetails(factureDetails);

        facture.setTotalHT(devis.getTotalHT());
        facture.setTotalTTC(devis.getTotalTTC());

        factureRepository.save(facture);

        return facture;
    }

    // Récupérer toutes les factures
    public List<Facture> getAllFactures() {
        return factureRepository.findAll();
    }

    // Récupérer une facture par son id
    public Facture getFacture(Long id) {
        Optional<Facture> facture = factureRepository.findById(id);
        return facture.orElseThrow(() -> new IllegalArgumentException("Facture non trouvée avec l'id : " + id));
    }

    // Supprimer une facture
    public void deleteFacture(Long id) {
        factureRepository.deleteById(id);
    }

    public Facture updateModePaiement(Long id, String modePaiement) {
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Facture non trouvée"));

        facture.setModePaiement(modePaiement);
        // Si le mode de paiement est choisi, on considère que la facture est payée
        facture.setStatut("PAYÉ");
        return factureRepository.save(facture);
    }



}
