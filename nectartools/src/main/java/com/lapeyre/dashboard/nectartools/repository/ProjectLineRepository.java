package com.lapeyre.dashboard.nectartools.repository;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.lapeyre.dashboard.nectartools.models.input_data.ProjectLine;
import com.lapeyre.dashboard.nectartools.utils.statistics.ProjectLineStatsDto;

@Repository
public interface ProjectLineRepository extends JpaRepository<ProjectLine, Long> {

       @Query("""
        SELECT pl.codeConfigurateur AS codeConfigurateur,
               COUNT(pl.idProjectLine) AS count,
               MIN(pl.dataCreation) AS minDateCreation,
               MAX(pl.dateModification) AS maxDateModification
        FROM ProjectLine pl
        WHERE pl.dataCreation BETWEEN :startDate AND :endDate
        GROUP BY pl.codeConfigurateur
    """)
    List<ProjectLineStatsDto> findStatsByPeriod(
        @Param("startDate") OffsetDateTime startDate,
        @Param("endDate") OffsetDateTime endDate
    );
}
