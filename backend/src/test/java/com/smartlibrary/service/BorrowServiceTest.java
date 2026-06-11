package com.smartlibrary.service;

import com.smartlibrary.dto.BorrowDto;
import com.smartlibrary.dto.DashboardStatsDto;
import com.smartlibrary.entity.*;
import com.smartlibrary.exception.ResourceNotFoundException;
import com.smartlibrary.repository.BookRepository;
import com.smartlibrary.repository.BorrowRepository;
import com.smartlibrary.repository.UserRepository;
import com.smartlibrary.service.impl.BorrowServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BorrowServiceTest {

    @Mock
    private BorrowRepository borrowRepository;

    @Mock
    private BookRepository bookRepository;

    @Mock
    private UserRepository userRepository;

    private BorrowService borrowService;

    @BeforeEach
    void setUp() {
        borrowService = new BorrowServiceImpl(borrowRepository, bookRepository, userRepository);
    }

    @Test
    void borrowBook_Success() {
        User user = new User(1L, "John", "Doe", "john", "john@email.com", "pass", Role.USER, "123", null);
        Category category = new Category(1L, "Sci-Fi", "Science fiction");
        Book book = new Book(1L, "Dune", "Frank Herbert", "12345", category, "Desc", 5, 5, 1965, "English", "Loc", null, null);
        Borrow borrow = new Borrow(1L, user, book, LocalDate.now(), LocalDate.now().plusDays(14), null, BorrowStatus.BORROWED);

        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));
        when(borrowRepository.existsByUserAndBookAndStatus(user, book, BorrowStatus.BORROWED)).thenReturn(false);
        when(borrowRepository.existsByUserAndBookAndStatus(user, book, BorrowStatus.OVERDUE)).thenReturn(false);
        when(borrowRepository.save(any(Borrow.class))).thenReturn(borrow);

        BorrowDto result = borrowService.borrowBook("john", 1L);

        assertNotNull(result);
        assertEquals(4, book.getAvailableCopies()); // Copy deducted
        verify(bookRepository, times(1)).save(book);
        verify(borrowRepository, times(1)).save(any(Borrow.class));
    }

    @Test
    void borrowBook_NoStock_ThrowsException() {
        User user = new User(1L, "John", "Doe", "john", "john@email.com", "pass", Role.USER, "123", null);
        Category category = new Category(1L, "Sci-Fi", "Science fiction");
        Book book = new Book(1L, "Dune", "Frank Herbert", "12345", category, "Desc", 5, 0, 1965, "English", "Loc", null, null); // No copies

        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user));
        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));

        assertThrows(IllegalStateException.class, () -> borrowService.borrowBook("john", 1L));
        verify(borrowRepository, never()).save(any(Borrow.class));
    }

    @Test
    void returnBook_Success() {
        User user = new User(1L, "John", "Doe", "john", "john@email.com", "pass", Role.USER, "123", null);
        Category category = new Category(1L, "Sci-Fi", "Science fiction");
        Book book = new Book(1L, "Dune", "Frank Herbert", "12345", category, "Desc", 5, 4, 1965, "English", "Loc", null, null);
        Borrow borrow = new Borrow(1L, user, book, LocalDate.now().minusDays(5), LocalDate.now().plusDays(9), null, BorrowStatus.BORROWED);

        when(borrowRepository.findById(1L)).thenReturn(Optional.of(borrow));
        when(borrowRepository.save(any(Borrow.class))).thenReturn(borrow);

        BorrowDto result = borrowService.returnBook(1L);

        assertNotNull(result);
        assertEquals(5, book.getAvailableCopies()); // Copy returned
        assertEquals(BorrowStatus.RETURNED.name(), result.getStatus());
        assertNotNull(borrow.getReturnDate());
        verify(bookRepository, times(1)).save(book);
    }

    @Test
    void returnBook_AlreadyReturned_ThrowsException() {
        User user = new User(1L, "John", "Doe", "john", "john@email.com", "pass", Role.USER, "123", null);
        Category category = new Category(1L, "Sci-Fi", "Science fiction");
        Book book = new Book(1L, "Dune", "Frank Herbert", "12345", category, "Desc", 5, 5, 1965, "English", "Loc", null, null);
        Borrow borrow = new Borrow(1L, user, book, LocalDate.now().minusDays(5), LocalDate.now().plusDays(9), LocalDate.now(), BorrowStatus.RETURNED);

        when(borrowRepository.findById(1L)).thenReturn(Optional.of(borrow));

        assertThrows(IllegalStateException.class, () -> borrowService.returnBook(1L));
    }

    @Test
    void checkAndUpdateOverdueBorrows_UpdatesStatus() {
        User user = new User(1L, "John", "Doe", "john", "john@email.com", "pass", Role.USER, "123", null);
        Category category = new Category(1L, "Sci-Fi", "Science fiction");
        Book book = new Book(1L, "Dune", "Frank Herbert", "12345", category, "Desc", 5, 4, 1965, "English", "Loc", null, null);
        Borrow overdueBorrow = new Borrow(1L, user, book, LocalDate.now().minusDays(20), LocalDate.now().minusDays(6), null, BorrowStatus.BORROWED);

        when(borrowRepository.findByStatus(BorrowStatus.BORROWED)).thenReturn(Collections.singletonList(overdueBorrow));

        borrowService.checkAndUpdateOverdueBorrows();

        assertEquals(BorrowStatus.OVERDUE, overdueBorrow.getStatus());
        verify(borrowRepository, times(1)).save(overdueBorrow);
    }

    @Test
    void getDashboardStats_ReturnsStats() {
        when(bookRepository.count()).thenReturn(10L);
        when(userRepository.count()).thenReturn(5L);
        when(borrowRepository.countByStatus(BorrowStatus.BORROWED)).thenReturn(2L);
        when(borrowRepository.countByStatus(BorrowStatus.OVERDUE)).thenReturn(1L);
        when(borrowRepository.findAll(any(Pageable.class))).thenReturn(new PageImpl<>(new ArrayList<>()));

        DashboardStatsDto stats = borrowService.getDashboardStats();

        assertNotNull(stats);
        assertEquals(10L, stats.getTotalBooks());
        assertEquals(5L, stats.getTotalUsers());
        assertEquals(3L, stats.getTotalBorrowedBooks()); // active (2) + overdue (1)
        assertEquals(1L, stats.getTotalOverdueBooks());
    }
}
