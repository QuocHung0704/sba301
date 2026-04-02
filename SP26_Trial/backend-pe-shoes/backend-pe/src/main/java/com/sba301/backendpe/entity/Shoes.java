package com.sba301.backendpe.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "shoes")
public class Shoes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 5)
    private double price;

    @Column(nullable = false, length = 100)
    private String manufacturer;

    @Column(nullable = false, length = 10)
    private String productionDate;

    @Column(length = 10)
    private String importDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
}
