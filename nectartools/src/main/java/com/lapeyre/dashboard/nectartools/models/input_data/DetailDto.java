package com.lapeyre.dashboard.nectartools.models.input_data;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DetailDto {
    private Double unitPrice;
    private List<DetailLineDto> detailLines;
    private Integer quantity;
    private Double totalPrice;
    private String designation;
    private String cpCpe;
    private UserTypeDto userType;
}

