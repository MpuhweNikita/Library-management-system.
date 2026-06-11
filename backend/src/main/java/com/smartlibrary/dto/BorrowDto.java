package com.smartlibrary.dto;

import java.time.LocalDate;

public class BorrowDto {

    private Long id;
    private Long userId;
    private String userFullName;
    private String username;
    private Long bookId;
    private String bookTitle;
    private String bookAuthor;
    private String bookIsbn;
    private LocalDate borrowDate;
    private LocalDate dueDate;
    private LocalDate returnDate;
    private String status;

    // Constructors
    public BorrowDto() {
    }

    public BorrowDto(Long id, Long userId, String userFullName, String username, Long bookId, String bookTitle, String bookAuthor, String bookIsbn, LocalDate borrowDate, LocalDate dueDate, LocalDate returnDate, String status) {
        this.id = id;
        this.userId = userId;
        this.userFullName = userFullName;
        this.username = username;
        this.bookId = bookId;
        this.bookTitle = bookTitle;
        this.bookAuthor = bookAuthor;
        this.bookIsbn = bookIsbn;
        this.borrowDate = borrowDate;
        this.dueDate = dueDate;
        this.returnDate = returnDate;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserFullName() { return userFullName; }
    public void setUserFullName(String userFullName) { this.userFullName = userFullName; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public Long getBookId() { return bookId; }
    public void setBookId(Long bookId) { this.bookId = bookId; }

    public String getBookTitle() { return bookTitle; }
    public void setBookTitle(String bookTitle) { this.bookTitle = bookTitle; }

    public String getBookAuthor() { return bookAuthor; }
    public void setBookAuthor(String bookAuthor) { this.bookAuthor = bookAuthor; }

    public String getBookIsbn() { return bookIsbn; }
    public void setBookIsbn(String bookIsbn) { this.bookIsbn = bookIsbn; }

    public LocalDate getBorrowDate() { return borrowDate; }
    public void setBorrowDate(LocalDate borrowDate) { this.borrowDate = borrowDate; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public LocalDate getReturnDate() { return returnDate; }
    public void setReturnDate(LocalDate returnDate) { this.returnDate = returnDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    // Builder
    public static BorrowDtoBuilder builder() {
        return new BorrowDtoBuilder();
    }

    public static class BorrowDtoBuilder {
        private Long id;
        private Long userId;
        private String userFullName;
        private String username;
        private Long bookId;
        private String bookTitle;
        private String bookAuthor;
        private String bookIsbn;
        private LocalDate borrowDate;
        private LocalDate dueDate;
        private LocalDate returnDate;
        private String status;

        public BorrowDtoBuilder id(Long id) { this.id = id; return this; }
        public BorrowDtoBuilder userId(Long userId) { this.userId = userId; return this; }
        public BorrowDtoBuilder userFullName(String userFullName) { this.userFullName = userFullName; return this; }
        public BorrowDtoBuilder username(String username) { this.username = username; return this; }
        public BorrowDtoBuilder bookId(Long bookId) { this.bookId = bookId; return this; }
        public BorrowDtoBuilder bookTitle(String bookTitle) { this.bookTitle = bookTitle; return this; }
        public BorrowDtoBuilder bookAuthor(String bookAuthor) { this.bookAuthor = bookAuthor; return this; }
        public BorrowDtoBuilder bookIsbn(String bookIsbn) { this.bookIsbn = bookIsbn; return this; }
        public BorrowDtoBuilder borrowDate(LocalDate borrowDate) { this.borrowDate = borrowDate; return this; }
        public BorrowDtoBuilder dueDate(LocalDate dueDate) { this.dueDate = dueDate; return this; }
        public BorrowDtoBuilder returnDate(LocalDate returnDate) { this.returnDate = returnDate; return this; }
        public BorrowDtoBuilder status(String status) { this.status = status; return this; }

        public BorrowDto build() {
            return new BorrowDto(id, userId, userFullName, username, bookId, bookTitle, bookAuthor, bookIsbn, borrowDate, dueDate, returnDate, status);
        }
    }
}
