package com.lapeyre.dashboard.nectartools.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lapeyre.dashboard.nectartools.models.input_data.ProjectLine;
import com.lapeyre.dashboard.nectartools.repository.ProjectLineRepository;
import com.lapeyre.dashboard.nectartools.utils.statistics.ProjectLineStatsDto;

import java.sql.Blob;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.sql.rowset.serial.SerialBlob;

@Service
@Transactional
public class ProjectLineService {

    private final ProjectLineRepository projectLineRepository;
    private final ObjectMapper objectMapper;

    public ProjectLineService(ProjectLineRepository projectLineRepository, ObjectMapper objectMapper) {
        this.projectLineRepository = projectLineRepository;
        this.objectMapper = objectMapper;
    }

    public ProjectLine createProjectLine(ProjectLine projectLine) {
        try {
            if (projectLine.getResume() instanceof Map) {
                byte[] resumeBytes = objectMapper.writeValueAsBytes(projectLine.getResume());
                Blob resumeBlob = new SerialBlob(resumeBytes);
                projectLine.setResumeBlob(resumeBlob);
            }
            if (projectLine.getDecompo() instanceof Map) {
                byte[] decompoBytes = objectMapper.writeValueAsBytes(projectLine.getDecompo());
                Blob decompoBlob = new SerialBlob(decompoBytes);
                projectLine.setDecompoBlob(decompoBlob);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error while converting resume or decompo to Blob", e);
        }

        return projectLineRepository.save(projectLine);
    }

    public List<ProjectLine> getAllProjectLines() {
        return projectLineRepository.findAll();
    }


    public ProjectLine getProjectLineById(Long id) {
        ProjectLine projectLine = projectLineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
    
        if (projectLine.getResumeBlob() != null) {
            try {
                byte[] resumeBytes = projectLine.getResumeBlob().getBytes(1, (int) projectLine.getResumeBlob().length());
                Map<String, Object> resume = objectMapper.readValue(resumeBytes, Map.class);
                projectLine.setResume(resume);
            } catch (Exception e) {
                throw new RuntimeException("Error reading resume blob", e);
            }
        }
        if (projectLine.getDecompoBlob() != null) {
            try {
                byte[] decompoBytes = projectLine.getDecompoBlob().getBytes(1, (int) projectLine.getDecompoBlob().length());
                Map<String, Object> decompo = objectMapper.readValue(decompoBytes, Map.class);
                projectLine.setDecompo(decompo);
            } catch (Exception e) {
                throw new RuntimeException("Error reading decompo blob", e);
            }
        }
    
        return projectLine;
    }
    

    public ProjectLine updateProjectLine(Long id, ProjectLine updatedProjectLine) {
        return projectLineRepository.findById(id)
            .map(existing -> {
                existing.setDataCreation(updatedProjectLine.getDataCreation());
                existing.setDateModification(updatedProjectLine.getDateModification());
                existing.setIdProject(updatedProjectLine.getIdProject());
                existing.setCodeConfigurateur(updatedProjectLine.getCodeConfigurateur());
                existing.setResume(updatedProjectLine.getResume());
                existing.setDecompo(updatedProjectLine.getDecompo());
                return projectLineRepository.save(existing);
            })
            .orElseThrow(() -> new RuntimeException("ProjectLine not found with id " + id));
    }

    public void deleteProjectLine(Long id) {
        projectLineRepository.deleteById(id);
    }

    public List<ProjectLineStatsDto> getStats(OffsetDateTime start, OffsetDateTime end) {
    return projectLineRepository.findStatsByPeriod(start, end);
}

}

