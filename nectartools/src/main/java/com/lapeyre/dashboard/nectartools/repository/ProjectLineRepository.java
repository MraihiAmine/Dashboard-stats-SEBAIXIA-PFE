package com.lapeyre.dashboard.nectartools.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lapeyre.dashboard.nectartools.models.input_data.ProjectLine;

@Repository
public interface ProjectLineRepository extends JpaRepository<ProjectLine, Long> {
}
