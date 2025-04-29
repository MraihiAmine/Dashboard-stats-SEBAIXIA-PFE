package com.lapeyre.dashboard.nectartools.utils.statistics;

import java.time.OffsetDateTime;

public interface ProjectLineStatsDto {
    String getCodeConfigurateur();
    Long getCount();
    OffsetDateTime getMinDateCreation();
    OffsetDateTime getMaxDateModification();
}
