package com.example.productapi.service;

import com.example.productapi.model.Detail;
import com.example.productapi.repository.DetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DetailService {

    @Autowired
    private DetailRepository detailRepository;

    public Detail createDetail(Detail detail) {
        return detailRepository.save(detail);
    }

    public Detail getDetail(Long id) {
        return detailRepository.findById(id).orElseThrow(() -> new RuntimeException("Détail non trouvé"));
    }
}