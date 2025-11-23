package com.gestion_devis_factures_backend.devis_facteurs.service;

import com.gestion_devis_factures_backend.devis_facteurs.dto.DevisDetailRequest;
import com.gestion_devis_factures_backend.devis_facteurs.model.*;
import com.gestion_devis_factures_backend.devis_facteurs.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DevisService {

    private final DevisRepository devisRepository;
    private final ProduitRepository produitRepository;
    private final ClientRepository clientRepository;
    private final FactureService factureService;

    private static final Double TVA = 0.20;

    // ------------------ CREATION DEVIS ------------------
    @Transactional
    public Devis createDevis(Long clientId, List<DevisDetailRequest> detailsRequest) {

        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client non trouvé: " + clientId));

        Devis devis = new Devis();
        devis.setClient(client);
        devis.setDate(new Date());
        devis.setStatut("EN_COURS");

        List<DevisDetail> details = new ArrayList<>();
        double totalHT = 0.0;

        for (DevisDetailRequest req : detailsRequest) {

            Produit produit = produitRepository.findById(req.getProduitId())
                    .orElseThrow(() -> new RuntimeException("Produit non trouvé: " + req.getProduitId()));

            double prixUnitaire = produit.getPrixUnitaire();
            double prixLigne = prixUnitaire * req.getQuantite();

            DevisDetail detail = new DevisDetail();
            detail.setProduit(produit);
            detail.setQuantite(req.getQuantite());
            detail.setPrixUnitaire(prixUnitaire);
            detail.setPrix(prixLigne);
            detail.setDevis(devis);

            details.add(detail);
            totalHT += prixLigne;
        }

        devis.setDetails(details);
        devis.setTotalHT(totalHT);
        devis.setTotalTTC(totalHT * 1.2);

        return devisRepository.save(devis);
    }

    // ------------------ VALIDATION DEVIS → CREATION FACTURE ------------------
    @Transactional
    public Devis validerDevis(Long devisId) {

        Devis devis = devisRepository.findById(devisId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Devis non trouvé"));

        devis.setStatut("VALIDÉ");
        devisRepository.save(devis);


// ⚡ Créer facture automatiquement
        factureService.createFactureFromDevis(devis);



        return devis;
    }

    public List<Devis> getAllDevis() {
        return devisRepository.findAll();
    }

    public Devis getDevis(Long id) {
        return devisRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Devis non trouvé"));
    }

    @Transactional
    public void deleteDevis(Long id) {
        if (!devisRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Devis non trouvé");
        }
        devisRepository.deleteById(id);
    }
}
