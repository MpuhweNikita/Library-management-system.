package com.smartlibrary.service;

import com.smartlibrary.dto.BookDto;
import com.smartlibrary.entity.Book;
import com.smartlibrary.entity.Category;
import com.smartlibrary.exception.ResourceNotFoundException;
import com.smartlibrary.repository.BookRepository;
import com.smartlibrary.repository.CategoryRepository;
import com.smartlibrary.service.impl.BookServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @Mock
    private CategoryRepository categoryRepository;

    private BookService bookService;

    @BeforeEach
    void setUp() {
        bookService = new BookServiceImpl(bookRepository, categoryRepository);
    }

    @Test
    void createBook_Success() {
        Category category = new Category(1L, "Sci-Fi", "Science fiction books");
        BookDto dto = new BookDto(null, "Dune", "Frank Herbert", "12345", 1L, "Sci-Fi", "Desc", 5, 5, 1965, "English", "Loc", null);
        Book book = new Book(1L, "Dune", "Frank Herbert", "12345", category, "Desc", 5, 5, 1965, "English", "Loc", null, null);

        when(bookRepository.existsByIsbn("12345")).thenReturn(false);
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(bookRepository.save(any(Book.class))).thenReturn(book);

        BookDto result = bookService.createBook(dto);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Dune", result.getTitle());
        verify(bookRepository, times(1)).save(any(Book.class));
    }

    @Test
    void createBook_DuplicateIsbn_ThrowsException() {
        BookDto dto = new BookDto(null, "Dune", "Frank Herbert", "12345", 1L, "Sci-Fi", "Desc", 5, 5, 1965, "English", "Loc", null);

        when(bookRepository.existsByIsbn("12345")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> bookService.createBook(dto));
        verify(bookRepository, never()).save(any(Book.class));
    }

    @Test
    void getBookById_Success() {
        Category category = new Category(1L, "Sci-Fi", "Science fiction books");
        Book book = new Book(1L, "Dune", "Frank Herbert", "12345", category, "Desc", 5, 5, 1965, "English", "Loc", null, null);

        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));

        BookDto result = bookService.getBookById(1L);

        assertNotNull(result);
        assertEquals("Dune", result.getTitle());
    }

    @Test
    void getBookById_NotFound_ThrowsException() {
        when(bookRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> bookService.getBookById(1L));
    }

    @Test
    void deleteBook_Success() {
        Category category = new Category(1L, "Sci-Fi", "Science fiction books");
        Book book = new Book(1L, "Dune", "Frank Herbert", "12345", category, "Desc", 5, 5, 1965, "English", "Loc", null, null);

        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));

        bookService.deleteBook(1L);

        verify(bookRepository, times(1)).delete(book);
    }

    @Test
    void deleteBook_ActiveBorrows_ThrowsException() {
        Category category = new Category(1L, "Sci-Fi", "Science fiction books");
        Book book = new Book(1L, "Dune", "Frank Herbert", "12345", category, "Desc", 5, 3, 1965, "English", "Loc", null, null); // 2 copies borrowed

        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));

        assertThrows(IllegalStateException.class, () -> bookService.deleteBook(1L));
        verify(bookRepository, never()).delete(any(Book.class));
    }

    @Test
    void filterBooks_ReturnsPage() {
        Category category = new Category(1L, "Sci-Fi", "Science fiction books");
        Book book = new Book(1L, "Dune", "Frank Herbert", "12345", category, "Desc", 5, 5, 1965, "English", "Loc", null, null);
        Page<Book> page = new PageImpl<>(Collections.singletonList(book));

        when(bookRepository.filterBooks(eq("Sci-Fi"), isNull(), isNull(), isNull(), isNull(), any(Pageable.class)))
                .thenReturn(page);

        Page<BookDto> result = bookService.filterBooks("Sci-Fi", "", " ", null, null, PageRequest.of(0, 10));

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Dune", result.getContent().get(0).getTitle());
    }
}
