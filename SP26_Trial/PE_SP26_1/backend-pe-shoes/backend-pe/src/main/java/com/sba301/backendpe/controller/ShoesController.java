package com.sba301.backendpe.controller;

import com.sba301.backendpe.dto.ShoesRequest;
import com.sba301.backendpe.dto.ShoesResponse;
import com.sba301.backendpe.service.ShoesService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/shoes")
public class ShoesController {

    private final ShoesService shoesService;

    @GetMapping("/search")
    public ResponseEntity<Page<ShoesResponse>> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return ResponseEntity.ok(shoesService.search(name, categoryId, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShoesResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(shoesService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ShoesResponse> create(@RequestBody ShoesRequest request) {
        return ResponseEntity.ok(shoesService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShoesResponse> update(
            @PathVariable Long id,
            @RequestBody ShoesRequest request
    ) {
        return ResponseEntity.ok(shoesService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        shoesService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
