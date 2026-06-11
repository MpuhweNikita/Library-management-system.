package com.smartlibrary.service;

import com.smartlibrary.dto.BookDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BookService {
    BookDto createBook(BookDto bookDto);
    BookDto updateBook(Long id, BookDto bookDto);
    BookDto getBookById(Long id);
    Page<BookDto> getAllBooks(Pageable pageable);
    Page<BookDto> searchBooks(String keyword, Pageable pageable);
    Page<BookDto> filterBooks(String category, String author, String language, Integer year, Boolean available, Pageable pageable);
    void deleteBook(Long id);
}
