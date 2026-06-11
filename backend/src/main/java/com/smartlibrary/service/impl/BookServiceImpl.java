package com.smartlibrary.service.impl;

import com.smartlibrary.dto.BookDto;
import com.smartlibrary.entity.Book;
import com.smartlibrary.entity.Category;
import com.smartlibrary.exception.ResourceNotFoundException;
import com.smartlibrary.repository.BookRepository;
import com.smartlibrary.repository.CategoryRepository;
import com.smartlibrary.service.BookService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    // Standard constructor
    public BookServiceImpl(BookRepository bookRepository, CategoryRepository categoryRepository) {
        this.bookRepository = bookRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Transactional
    public BookDto createBook(BookDto bookDto) {
        if (bookRepository.existsByIsbn(bookDto.getIsbn())) {
            throw new IllegalArgumentException("Book with this ISBN already exists");
        }

        Category category = categoryRepository.findById(bookDto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + bookDto.getCategoryId()));

        Book book = Book.builder()
                .title(bookDto.getTitle())
                .author(bookDto.getAuthor())
                .isbn(bookDto.getIsbn())
                .category(category)
                .description(bookDto.getDescription())
                .quantity(bookDto.getQuantity())
                .availableCopies(bookDto.getQuantity())
                .publishedYear(bookDto.getPublishedYear())
                .language(bookDto.getLanguage())
                .shelfLocation(bookDto.getShelfLocation())
                .coverImage(bookDto.getCoverImage())
                .build();

        Book savedBook = bookRepository.save(book);
        return mapToDto(savedBook);
    }

    @Override
    @Transactional
    public BookDto updateBook(Long id, BookDto bookDto) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));

        if (!book.getIsbn().equals(bookDto.getIsbn()) && bookRepository.existsByIsbn(bookDto.getIsbn())) {
            throw new IllegalArgumentException("Book with this ISBN already exists");
        }

        Category category = categoryRepository.findById(bookDto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + bookDto.getCategoryId()));

        int quantityDiff = bookDto.getQuantity() - book.getQuantity();
        int newAvailableCopies = book.getAvailableCopies() + quantityDiff;
        if (newAvailableCopies < 0) {
            throw new IllegalArgumentException("Cannot decrease total quantity below the number of currently borrowed copies.");
        }

        book.setTitle(bookDto.getTitle());
        book.setAuthor(bookDto.getAuthor());
        book.setIsbn(bookDto.getIsbn());
        book.setCategory(category);
        book.setDescription(bookDto.getDescription());
        book.setQuantity(bookDto.getQuantity());
        book.setAvailableCopies(newAvailableCopies);
        book.setPublishedYear(bookDto.getPublishedYear());
        book.setLanguage(bookDto.getLanguage());
        book.setShelfLocation(bookDto.getShelfLocation());
        if (bookDto.getCoverImage() != null && !bookDto.getCoverImage().isEmpty()) {
            book.setCoverImage(bookDto.getCoverImage());
        }

        Book updatedBook = bookRepository.save(book);
        return mapToDto(updatedBook);
    }

    @Override
    public BookDto getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
        return mapToDto(book);
    }

    @Override
    public Page<BookDto> getAllBooks(Pageable pageable) {
        return bookRepository.findAll(pageable).map(this::mapToDto);
    }

    @Override
    public Page<BookDto> searchBooks(String keyword, Pageable pageable) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllBooks(pageable);
        }
        return bookRepository.searchBooks(keyword.trim(), pageable).map(this::mapToDto);
    }

    @Override
    public Page<BookDto> filterBooks(String category, String author, String language, Integer year, Boolean available, Pageable pageable) {
        String categoryParam = (category == null || category.trim().isEmpty()) ? null : category.trim();
        String authorParam = (author == null || author.trim().isEmpty()) ? null : author.trim();
        String languageParam = (language == null || language.trim().isEmpty()) ? null : language.trim();
        return bookRepository.filterBooks(categoryParam, authorParam, languageParam, year, available, pageable).map(this::mapToDto);
    }

    @Override
    @Transactional
    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
        
        if (book.getAvailableCopies() < book.getQuantity()) {
            throw new IllegalStateException("Cannot delete book. There are active borrows for this book.");
        }
        
        bookRepository.delete(book);
    }

    private BookDto mapToDto(Book book) {
        return BookDto.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .isbn(book.getIsbn())
                .categoryId(book.getCategory().getId())
                .categoryName(book.getCategory().getName())
                .description(book.getDescription())
                .quantity(book.getQuantity())
                .availableCopies(book.getAvailableCopies())
                .publishedYear(book.getPublishedYear())
                .language(book.getLanguage())
                .shelfLocation(book.getShelfLocation())
                .coverImage(book.getCoverImage())
                .build();
    }
}
