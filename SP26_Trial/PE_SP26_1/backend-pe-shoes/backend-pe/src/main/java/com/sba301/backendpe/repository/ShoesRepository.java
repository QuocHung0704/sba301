package com.sba301.backendpe.repository;

import com.sba301.backendpe.entity.Shoes;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ShoesRepository extends JpaRepository<Shoes, Long> {

    @Query("SELECT s FROM Shoes s WHERE " +
           "(:name IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:categoryId IS NULL OR s.category.id = :categoryId)")
    Page<Shoes> searchShoes(
            @Param("name") String name,
            @Param("categoryId") Long categoryId,
            Pageable pageable
    );
}
