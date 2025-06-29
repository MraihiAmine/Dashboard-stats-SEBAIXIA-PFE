package com.lapeyre.dashboard.nectartools.controller;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lapeyre.dashboard.nectartools.models.input_data.ProjectLine;
import com.lapeyre.dashboard.nectartools.services.ProjectLineService;
import com.lapeyre.dashboard.nectartools.utils.statistics.ProjectLineStatsDto;

import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/project-lines")
public class ProjectLineController {

    private final ProjectLineService projectLineService;

    public ProjectLineController(ProjectLineService projectLineService) {
        this.projectLineService = projectLineService;
    }

    @PostMapping
    public ResponseEntity<ProjectLine> create(@RequestBody ProjectLine projectLine) {
        return ResponseEntity.ok(projectLineService.createProjectLine(projectLine));
    }

    @GetMapping
    public ResponseEntity<List<ProjectLine>> getAll() {
        return ResponseEntity.ok(projectLineService.getAllProjectLines());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectLine> getProjectLineById(@PathVariable Long id) {
        ProjectLine projectLine = projectLineService.getProjectLineById(id);
        if (projectLine == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(projectLine);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectLine> update(@PathVariable Long id, @RequestBody ProjectLine projectLine) {
        return ResponseEntity.ok(projectLineService.updateProjectLine(id, projectLine));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        projectLineService.deleteProjectLine(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public List<ProjectLineStatsDto> getStats(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime end
    ) {
        return projectLineService.getStats(start, end);
    }    
}

