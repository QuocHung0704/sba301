package com.sba301.backendpe.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShoesRequest {
    private String name;
    private double price;
    private String manufacturer;
    private String productionDate;
    private String importDate;
    private Long categoryId;
}
