package com.smartlibrary.controller;

import com.smartlibrary.dto.ApiResponse;
import com.smartlibrary.dto.CategoryDto;
import com.smartlibrary.dto.DashboardStatsDto;
import com.smartlibrary.repository.BookRepository;
import com.smartlibrary.service.BorrowService;
import com.smartlibrary.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final BorrowService borrowService;
    private final CategoryService categoryService;
    private final BookRepository bookRepository;

    public DashboardController(BorrowService borrowService, CategoryService categoryService, BookRepository bookRepository) {
        this.borrowService = borrowService;
        this.categoryService = categoryService;
        this.bookRepository = bookRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStats() {
        DashboardStatsDto stats = borrowService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard statistics retrieved successfully", stats));
    }

    @GetMapping("/chart-data")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getChartData() {
        Map<String, Long> data = new HashMap<>();
        for (CategoryDto cat : categoryService.getAllCategories()) {
            long count = bookRepository.findAll().stream()
                    .filter(b -> b.getCategory().getId().equals(cat.getId()))
                    .count();
            data.put(cat.getName(), count);
        }
        return ResponseEntity.ok(ApiResponse.success("Chart data retrieved successfully", data));
    }
}
