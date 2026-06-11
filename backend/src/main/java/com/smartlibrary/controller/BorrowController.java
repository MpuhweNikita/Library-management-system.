package com.smartlibrary.controller;

import com.smartlibrary.dto.ApiResponse;
import com.smartlibrary.dto.BorrowDto;
import com.smartlibrary.dto.BorrowRequest;
import com.smartlibrary.entity.BorrowStatus;
import com.smartlibrary.service.BorrowService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/borrows")
public class BorrowController {

    private final BorrowService borrowService;

    public BorrowController(BorrowService borrowService) {
        this.borrowService = borrowService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<BorrowDto>>> getBorrows(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Boolean overdue,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "borrowDate"));
        
        BorrowStatus enumStatus = null;
        if (status != null && !status.trim().isEmpty()) {
            try {
                enumStatus = BorrowStatus.valueOf(status.toUpperCase().trim());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Invalid borrow status: " + status));
            }
        }

        Page<BorrowDto> borrows = borrowService.filterBorrows(enumStatus, overdue, userId, username, pageable);
        return ResponseEntity.ok(ApiResponse.success("Loans retrieved successfully", borrows));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BorrowDto>> borrowBook(
            @Valid @RequestBody BorrowRequest request,
            Principal principal
    ) {
        String username = request.getUsername();
        if (username == null || username.trim().isEmpty()) {
            if (principal == null) {
                return ResponseEntity.badRequest().body(ApiResponse.error("User context is required"));
            }
            username = principal.getName();
        }

        BorrowDto borrowDto = borrowService.borrowBook(username, request.getBookId());
        return ResponseEntity.ok(ApiResponse.success("Book borrowed successfully", borrowDto));
    }

    @PutMapping("/return/{id}")
    public ResponseEntity<ApiResponse<BorrowDto>> returnBook(@PathVariable Long id) {
        BorrowDto borrowDto = borrowService.returnBook(id);
        return ResponseEntity.ok(ApiResponse.success("Book returned successfully", borrowDto));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<Page<BorrowDto>>> getMyBorrowHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Principal principal
    ) {
        if (principal == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Authentication required"));
        }
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "borrowDate"));
        Page<BorrowDto> history = borrowService.getBorrowHistory(principal.getName(), pageable);
        return ResponseEntity.ok(ApiResponse.success("Borrow history retrieved successfully", history));
    }
}
