package com.sba301.backendpe.repository;

import com.sba301.backendpe.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
