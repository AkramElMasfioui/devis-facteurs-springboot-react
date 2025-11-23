package com.gestion_devis_factures_backend.devis_facteurs.controller;


import com.gestion_devis_factures_backend.devis_facteurs.model.Client;
import com.gestion_devis_factures_backend.devis_facteurs.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
@CrossOrigin
public class ClientController {

    private final ClientService clientService;

    @GetMapping
    public List<Client> getAll() {
        return clientService.getAll();
    }

    @GetMapping("/{id}")
    public Client getById(@PathVariable Long id) {
        return clientService.getById(id);
    }

    @GetMapping("/search")
    public Client searchByTelephone(@RequestParam String telephone) {
        return clientService.searchByTelephone(telephone);
    }

    @PostMapping("/createclient")
    public Client save(@RequestBody Client client) {
        return clientService.save(client);
    }

    @PutMapping("/update/{id}")
    public Client update(@PathVariable Long id, @RequestBody Client newClient) {
        return clientService.update(id, newClient);
    }


    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        clientService.delete(id);
    }
}

