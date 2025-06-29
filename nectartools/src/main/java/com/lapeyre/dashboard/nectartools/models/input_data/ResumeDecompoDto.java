package com.lapeyre.dashboard.nectartools.models.input_data;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResumeDecompoDto {
    private Integer quantity;
    private Double totalPrice;
    private Double totalPriceLowCharges;
    private String artCode;
    private List<DetailDto> details;
    private String productName;
}
