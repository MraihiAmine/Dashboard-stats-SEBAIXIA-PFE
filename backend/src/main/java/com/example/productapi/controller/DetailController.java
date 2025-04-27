package com.example.productapi.controller;

import com.example.productapi.model.Detail;
import com.example.productapi.service.DetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Api(tags = "Detail API")  // Documentation pour ce contrôleur
@RestController
@RequestMapping("/api/details")
public class DetailController {

    @Autowired
    private DetailService detailService;

    @ApiOperation(value = "Créer un détail", notes = "Ajoute un nouveau détail pour un produit")
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "Détail créé avec succès"),
            @ApiResponse(code = 400, message = "Demande invalide")
    })
    @PostMapping
    public Detail createDetail(@RequestBody Detail detail) {
        return detailService.createDetail(detail);
    }

    @ApiOperation(value = "Obtenir un détail", notes = "Récupère un détail par son ID")
    @GetMapping("/{id}")
    public Detail getDetail(@PathVariable Long id) {
        return detailService.getDetail(id);
    }
}
