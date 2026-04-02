package com.sba301.backendpe.service;

import com.sba301.backendpe.dto.ShoesRequest;
import com.sba301.backendpe.dto.ShoesResponse;
import com.sba301.backendpe.entity.Category;
import com.sba301.backendpe.entity.Shoes;
import com.sba301.backendpe.repository.CategoryRepository;
import com.sba301.backendpe.repository.ShoesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ShoesService {

    private final ShoesRepository shoesRepository;
    private final CategoryRepository categoryRepository;

    public Page<ShoesResponse> search(String name, Long categoryId, int page, int size) {
        String nameTrim = (name != null && !name.isBlank()) ? name.trim() : null;
        return shoesRepository
                .searchShoes(nameTrim, categoryId, PageRequest.of(page, size))
                .map(ShoesResponse::from);
    }

    public ShoesResponse getById(Long id) {
        Shoes shoes = shoesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shoes not found with id: " + id));
        return ShoesResponse.from(shoes);
    }

    public ShoesResponse create(ShoesRequest req) {
        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + req.getCategoryId()));

        Shoes shoes = Shoes.builder()
                .name(req.getName().trim())
                .price(req.getPrice())
                .manufacturer(req.getManufacturer().trim())
                .productionDate(req.getProductionDate())
                .importDate(req.getImportDate())
                .category(category)
                .build();

        return ShoesResponse.from(shoesRepository.save(shoes));
    }

    public ShoesResponse update(Long id, ShoesRequest req) {
        Shoes shoes = shoesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shoes not found with id: " + id));
        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + req.getCategoryId()));

        shoes.setName(req.getName().trim());
        shoes.setPrice(req.getPrice());
        shoes.setManufacturer(req.getManufacturer().trim());
        shoes.setProductionDate(req.getProductionDate());
        shoes.setImportDate(req.getImportDate());
        shoes.setCategory(category);

        return ShoesResponse.from(shoesRepository.save(shoes));
    }

    public void delete(Long id) {
        if (!shoesRepository.existsById(id)) {
            throw new RuntimeException("Shoes not found with id: " + id);
        }
        shoesRepository.deleteById(id);
    }
}
