package com.smartlibrary.controller;

import com.smartlibrary.dto.ApiResponse;
import com.smartlibrary.dto.BookDto;
import com.smartlibrary.service.BookService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<BookDto>>> getBooks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Boolean available,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size,
            @RequestParam(defaultValue = "title") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<BookDto> books;
        if (search != null && !search.trim().isEmpty()) {
            books = bookService.searchBooks(search, pageable);
        } else {
            books = bookService.filterBooks(category, author, language, year, available, pageable);
        }
        
        return ResponseEntity.ok(ApiResponse.success("Books retrieved successfully", books));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookDto>> getBookById(@PathVariable Long id) {
        BookDto book = bookService.getBookById(id);
        return ResponseEntity.ok(ApiResponse.success("Book retrieved successfully", book));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BookDto>> createBook(@Valid @RequestBody BookDto bookDto) {
        BookDto createdBook = bookService.createBook(bookDto);
        return ResponseEntity.ok(ApiResponse.success("Book created successfully", createdBook));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BookDto>> updateBook(@PathVariable Long id, @Valid @RequestBody BookDto bookDto) {
        BookDto updatedBook = bookService.updateBook(id, bookDto);
        return ResponseEntity.ok(ApiResponse.success("Book updated successfully", updatedBook));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.ok(ApiResponse.success("Book deleted successfully"));
    }
}
