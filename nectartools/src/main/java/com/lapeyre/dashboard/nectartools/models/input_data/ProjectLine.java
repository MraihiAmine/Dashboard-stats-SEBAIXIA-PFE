package com.lapeyre.dashboard.nectartools.models.input_data;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.sql.Blob;

@Entity
@Table(name = "project_line")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Auto-generate IDs
    private Long idProjectLine;


    @Column(name = "data_creation")
    private OffsetDateTime dataCreation;

    @Column(name = "date_modification")
    private OffsetDateTime dateModification;

    @Column(name = "id_project")
    private Long idProject;

    @Column(name = "code_configurateur")
    private String codeConfigurateur;

    @Transient
    private Map<String, Object> resume;

    @Transient
    private Map<String, Object> decompo;

    // fields that are persisted
    @Lob
    @JsonIgnore
    private Blob resumeBlob;

    @Lob
    @JsonIgnore
    private Blob decompoBlob;
}

