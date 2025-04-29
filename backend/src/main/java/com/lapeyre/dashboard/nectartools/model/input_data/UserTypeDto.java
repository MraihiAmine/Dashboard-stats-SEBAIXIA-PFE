package com.lapeyre.dashboard.nectartools.model.input_data;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserTypeDto {
    private String name;
    private String description;
}
