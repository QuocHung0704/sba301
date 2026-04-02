package com.sba301.backendpe.dto;

import com.sba301.backendpe.entity.Shoes;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShoesResponse {
    private Long id;
    private String name;
    private double price;
    private String manufacturer;
    private String productionDate;
    private String importDate;
    private CategoryDto category;

    public static ShoesResponse from(Shoes s) {
        return ShoesResponse.builder()
                .id(s.getId())
                .name(s.getName())
                .price(s.getPrice())
                .manufacturer(s.getManufacturer())
                .productionDate(s.getProductionDate())
                .importDate(s.getImportDate())
                .category(s.getCategory() != null
                        ? new CategoryDto(s.getCategory().getId(), s.getCategory().getName())
                        : null)
                .build();
    }
}
