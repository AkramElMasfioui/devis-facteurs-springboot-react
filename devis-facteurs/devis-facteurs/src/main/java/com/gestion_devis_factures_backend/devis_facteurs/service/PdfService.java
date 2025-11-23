// PdfService.java
package com.gestion_devis_factures_backend.devis_facteurs.service;

import com.gestion_devis_factures_backend.devis_facteurs.model.Facture;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PdfService {

    public byte[] generatePdf(Facture facture) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            document.add(new Paragraph("Facture N°" + facture.getNumero()));
            document.add(new Paragraph("Date: " + facture.getDate()));
            document.add(new Paragraph("Client: " + facture.getClient().getNom()));

            facture.getDetails().forEach(d -> {
                Double prixUnitaire = d.getPrixUnitaire() != null ? d.getPrixUnitaire() : d.getProduit().getPrixUnitaire();
                document.add(new Paragraph(
                        d.getProduit().getNom() + " - " + d.getQuantite() + " x " + prixUnitaire + " = " + d.getPrix()
                ));
            });

            document.add(new Paragraph("Total HT: " + facture.getTotalHT()));
            document.add(new Paragraph("Total TTC: " + facture.getTotalTTC()));

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur génération PDF", e);
        }
    }
}
