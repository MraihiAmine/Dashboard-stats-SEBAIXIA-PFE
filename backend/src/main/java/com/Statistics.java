package com.example.productapi.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Statistics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String metric;
    private Long value;
    private LocalDateTime timestamp;

    public Statistics() {
        this.timestamp = LocalDateTime.now();
    }

    public Statistics(String metric, Long value) {
        this.metric = metric;
        this.value = value;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMetric() {
        return metric;
    }

    public void setMetric(String metric) {
        this.metric = metric;
    }

    public Long getValue() {
        return value;
    }

    public void setValue(Long value) {
        this.value = value;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}