package com.smartlibrary.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "borrows")
public class Borrow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Column(nullable = false)
    private LocalDate borrowDate;

    @Column(nullable = false)
    private LocalDate dueDate;

    private LocalDate returnDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BorrowStatus status;

    @PrePersist
    protected void onCreate() {
        if (this.borrowDate == null) {
            this.borrowDate = LocalDate.now();
        }
        if (this.dueDate == null) {
            this.dueDate = this.borrowDate.plusDays(14);
        }
        if (this.status == null) {
            this.status = BorrowStatus.BORROWED;
        }
    }

    // Constructors
    public Borrow() {
    }

    public Borrow(Long id, User user, Book book, LocalDate borrowDate, LocalDate dueDate, LocalDate returnDate, BorrowStatus status) {
        this.id = id;
        this.user = user;
        this.book = book;
        this.borrowDate = borrowDate;
        this.dueDate = dueDate;
        this.returnDate = returnDate;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Book getBook() { return book; }
    public void setBook(Book book) { this.book = book; }

    public LocalDate getBorrowDate() { return borrowDate; }
    public void setBorrowDate(LocalDate borrowDate) { this.borrowDate = borrowDate; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public LocalDate getReturnDate() { return returnDate; }
    public void setReturnDate(LocalDate returnDate) { this.returnDate = returnDate; }

    public BorrowStatus getStatus() { return status; }
    public void setStatus(BorrowStatus status) { this.status = status; }

    // Builder
    public static BorrowBuilder builder() {
        return new BorrowBuilder();
    }

    public static class BorrowBuilder {
        private Long id;
        private User user;
        private Book book;
        private LocalDate borrowDate;
        private LocalDate dueDate;
        private LocalDate returnDate;
        private BorrowStatus status;

        public BorrowBuilder id(Long id) { this.id = id; return this; }
        public BorrowBuilder user(User user) { this.user = user; return this; }
        public BorrowBuilder book(Book book) { this.book = book; return this; }
        public BorrowBuilder borrowDate(LocalDate borrowDate) { this.borrowDate = borrowDate; return this; }
        public BorrowBuilder dueDate(LocalDate dueDate) { this.dueDate = dueDate; return this; }
        public BorrowBuilder returnDate(LocalDate returnDate) { this.returnDate = returnDate; return this; }
        public BorrowBuilder status(BorrowStatus status) { this.status = status; return this; }

        public Borrow build() {
            return new Borrow(id, user, book, borrowDate, dueDate, returnDate, status);
        }
    }
}
