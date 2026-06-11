package com.smartlibrary.dto;

import jakarta.validation.constraints.*;

public class BookDto {

    private Long id;

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title cannot exceed 150 characters")
    private String title;

    @NotBlank(message = "Author is required")
    @Size(max = 100, message = "Author name cannot exceed 100 characters")
    private String author;

    @NotBlank(message = "ISBN is required")
    @Size(max = 20, message = "ISBN cannot exceed 20 characters")
    private String isbn;

    @NotNull(message = "Category is required")
    private Long categoryId;

    private String categoryName;
    private String description;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;

    private Integer availableCopies;

    @NotNull(message = "Published year is required")
    @Min(value = 1000, message = "Published year must be at least 1000")
    @Max(value = 2030, message = "Published year cannot exceed 2030")
    private Integer publishedYear;

    @NotBlank(message = "Language is required")
    @Size(max = 30, message = "Language name cannot exceed 30 characters")
    private String language;

    @Size(max = 50, message = "Shelf location cannot exceed 50 characters")
    private String shelfLocation;

    private String coverImage;

    // Constructors
    public BookDto() {
    }

    public BookDto(Long id, String title, String author, String isbn, Long categoryId, String categoryName, String description, Integer quantity, Integer availableCopies, Integer publishedYear, String language, String shelfLocation, String coverImage) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.description = description;
        this.quantity = quantity;
        this.availableCopies = availableCopies;
        this.publishedYear = publishedYear;
        this.language = language;
        this.shelfLocation = shelfLocation;
        this.coverImage = coverImage;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Integer getAvailableCopies() { return availableCopies; }
    public void setAvailableCopies(Integer availableCopies) { this.availableCopies = availableCopies; }

    public Integer getPublishedYear() { return publishedYear; }
    public void setPublishedYear(Integer publishedYear) { this.publishedYear = publishedYear; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getShelfLocation() { return shelfLocation; }
    public void setShelfLocation(String shelfLocation) { this.shelfLocation = shelfLocation; }

    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }

    // Builder
    public static BookDtoBuilder builder() {
        return new BookDtoBuilder();
    }

    public static class BookDtoBuilder {
        private Long id;
        private String title;
        private String author;
        private String isbn;
        private Long categoryId;
        private String categoryName;
        private String description;
        private Integer quantity;
        private Integer availableCopies;
        private Integer publishedYear;
        private String language;
        private String shelfLocation;
        private String coverImage;

        public BookDtoBuilder id(Long id) { this.id = id; return this; }
        public BookDtoBuilder title(String title) { this.title = title; return this; }
        public BookDtoBuilder author(String author) { this.author = author; return this; }
        public BookDtoBuilder isbn(String isbn) { this.isbn = isbn; return this; }
        public BookDtoBuilder categoryId(Long categoryId) { this.categoryId = categoryId; return this; }
        public BookDtoBuilder categoryName(String categoryName) { this.categoryName = categoryName; return this; }
        public BookDtoBuilder description(String description) { this.description = description; return this; }
        public BookDtoBuilder quantity(Integer quantity) { this.quantity = quantity; return this; }
        public BookDtoBuilder availableCopies(Integer availableCopies) { this.availableCopies = availableCopies; return this; }
        public BookDtoBuilder publishedYear(Integer publishedYear) { this.publishedYear = publishedYear; return this; }
        public BookDtoBuilder language(String language) { this.language = language; return this; }
        public BookDtoBuilder shelfLocation(String shelfLocation) { this.shelfLocation = shelfLocation; return this; }
        public BookDtoBuilder coverImage(String coverImage) { this.coverImage = coverImage; return this; }

        public BookDto build() {
            return new BookDto(id, title, author, isbn, categoryId, categoryName, description, quantity, availableCopies, publishedYear, language, shelfLocation, coverImage);
        }
    }
}
