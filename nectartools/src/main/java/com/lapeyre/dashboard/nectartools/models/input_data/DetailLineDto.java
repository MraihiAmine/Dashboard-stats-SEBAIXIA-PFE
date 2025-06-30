package com.lapeyre.dashboard.nectartools.models.input_data;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DetailLineDto {
    private Double unitPrice;
    private Double quantity;
    private Double totalPrice;
    private String designation;
    private String detail;
    private String cpe;
    private String cpCpe;
    private UserTypeDto userType;
}

