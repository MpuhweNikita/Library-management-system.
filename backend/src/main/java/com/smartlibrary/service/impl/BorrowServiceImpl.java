package com.smartlibrary.service.impl;

import com.smartlibrary.dto.BorrowDto;
import com.smartlibrary.dto.DashboardStatsDto;
import com.smartlibrary.entity.*;
import com.smartlibrary.exception.ResourceNotFoundException;
import com.smartlibrary.repository.BookRepository;
import com.smartlibrary.repository.BorrowRepository;
import com.smartlibrary.repository.UserRepository;
import com.smartlibrary.service.BorrowService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BorrowServiceImpl implements BorrowService {

    private final BorrowRepository borrowRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    // Standard constructor
    public BorrowServiceImpl(BorrowRepository borrowRepository, BookRepository bookRepository, UserRepository userRepository) {
        this.borrowRepository = borrowRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public BorrowDto borrowBook(String username, Long bookId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + bookId));

        // Validation 1: Check availability
        if (book.getAvailableCopies() <= 0) {
            throw new IllegalStateException("No copies available for borrowing: " + book.getTitle());
        }

        // Validation 2: Check if user already has an active loan for this book
        boolean alreadyBorrowed = borrowRepository.existsByUserAndBookAndStatus(user, book, BorrowStatus.BORROWED)
                || borrowRepository.existsByUserAndBookAndStatus(user, book, BorrowStatus.OVERDUE);
        if (alreadyBorrowed) {
            throw new IllegalStateException("You have already borrowed an active copy of: " + book.getTitle());
        }

        // Action: Deduct available copies
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        // Action: Create borrow log
        Borrow borrow = Borrow.builder()
                .user(user)
                .book(book)
                .borrowDate(LocalDate.now())
                .dueDate(LocalDate.now().plusDays(14))
                .status(BorrowStatus.BORROWED)
                .build();

        Borrow savedBorrow = borrowRepository.save(borrow);
        return mapToDto(savedBorrow);
    }

    @Override
    @Transactional
    public BorrowDto returnBook(Long borrowId) {
        Borrow borrow = borrowRepository.findById(borrowId)
                .orElseThrow(() -> new ResourceNotFoundException("Borrow transaction not found with id: " + borrowId));

        if (borrow.getStatus() == BorrowStatus.RETURNED) {
            throw new IllegalStateException("This book has already been returned.");
        }

        // Action: Re-add available copy
        Book book = borrow.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        // Action: Finalize borrow record
        borrow.setReturnDate(LocalDate.now());
        borrow.setStatus(BorrowStatus.RETURNED);

        Borrow updatedBorrow = borrowRepository.save(borrow);
        return mapToDto(updatedBorrow);
    }

    @Override
    public Page<BorrowDto> getBorrowHistory(String username, Pageable pageable) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        return borrowRepository.findByUser(user, pageable).map(this::mapToDto);
    }

    @Override
    public List<BorrowDto> getActiveBorrows(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        
        List<Borrow> borrows = borrowRepository.findByUserAndStatus(user, BorrowStatus.BORROWED);
        borrows.addAll(borrowRepository.findByUserAndStatus(user, BorrowStatus.OVERDUE));
        
        return borrows.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<BorrowDto> getAllBorrows() {
        checkAndUpdateOverdueBorrows();
        return borrowRepository.findAll(Sort.by(Sort.Direction.DESC, "borrowDate")).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<BorrowDto> getAllBorrowsPaginated(Pageable pageable) {
        checkAndUpdateOverdueBorrows();
        return borrowRepository.findAll(pageable).map(this::mapToDto);
    }

    @Override
    public Page<BorrowDto> filterBorrows(BorrowStatus status, Boolean overdue, Long userId, String username, Pageable pageable) {
        checkAndUpdateOverdueBorrows();
        String usernameParam = (username == null || username.trim().isEmpty()) ? null : username.trim();
        return borrowRepository.filterBorrows(status, overdue, userId, usernameParam, pageable).map(this::mapToDto);
    }

    @Override
    @Transactional
    public void checkAndUpdateOverdueBorrows() {
        List<Borrow> activeBorrows = borrowRepository.findByStatus(BorrowStatus.BORROWED);
        LocalDate today = LocalDate.now();
        for (Borrow borrow : activeBorrows) {
            if (borrow.getDueDate().isBefore(today)) {
                borrow.setStatus(BorrowStatus.OVERDUE);
                borrowRepository.save(borrow);
            }
        }
    }

    @Override
    @Transactional
    public DashboardStatsDto getDashboardStats() {
        checkAndUpdateOverdueBorrows();

        long totalBooks = bookRepository.count();
        long totalUsers = userRepository.count();
        long activeLoans = borrowRepository.countByStatus(BorrowStatus.BORROWED);
        long overdueLoans = borrowRepository.countByStatus(BorrowStatus.OVERDUE);
        long totalBorrowedBooks = activeLoans + overdueLoans;

        Pageable topFive = PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "id"));
        List<BorrowDto> recentActivity = borrowRepository.findAll(topFive).getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return DashboardStatsDto.builder()
                .totalBooks(totalBooks)
                .totalBorrowedBooks(totalBorrowedBooks)
                .totalUsers(totalUsers)
                .totalOverdueBooks(overdueLoans)
                .recentActivity(recentActivity)
                .build();
    }

    private BorrowDto mapToDto(Borrow borrow) {
        return BorrowDto.builder()
                .id(borrow.getId())
                .userId(borrow.getUser().getId())
                .userFullName(borrow.getUser().getFirstName() + " " + borrow.getUser().getLastName())
                .username(borrow.getUser().getUsername())
                .bookId(borrow.getBook().getId())
                .bookTitle(borrow.getBook().getTitle())
                .bookAuthor(borrow.getBook().getAuthor())
                .bookIsbn(borrow.getBook().getIsbn())
                .borrowDate(borrow.getBorrowDate())
                .dueDate(borrow.getDueDate())
                .returnDate(borrow.getReturnDate())
                .status(borrow.getStatus().name())
                .build();
    }
}
