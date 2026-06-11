package com.smartlibrary.dto;

import jakarta.validation.constraints.NotNull;

public class BorrowRequest {
    
    @NotNull(message = "Book ID is required")
    private Long bookId;
    
    private String username;

    public BorrowRequest() {
    }

    public BorrowRequest(Long bookId, String username) {
        this.bookId = bookId;
        this.username = username;
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
