package com.gestion_devis_factures_backend.devis_facteurs.service;

import com.gestion_devis_factures_backend.devis_facteurs.model.Client;
import com.gestion_devis_factures_backend.devis_facteurs.repository.ClientRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;

    public List<Client> getAll() {
        return clientRepository.findAll();
    }

    public Client getById(Long id) {
        return clientRepository.findById(id).orElseThrow();
    }

    public Client save(Client client) {
        return clientRepository.save(client);
    }

    public void delete(Long id) {
        clientRepository.deleteById(id);
    }

    public Client update(Long id, Client newClient) {
        Client c = clientRepository.findById(id).orElseThrow();
        c.setNom(newClient.getNom());
        c.setEmail(newClient.getEmail());
        c.setTelephone(newClient.getTelephone());
        return clientRepository.save(c);
    }

    public Client searchByTelephone(String phone) {
        return clientRepository.findByTelephone(phone)
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));
    }

}
