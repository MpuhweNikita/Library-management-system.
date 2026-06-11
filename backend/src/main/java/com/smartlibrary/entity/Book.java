package com.smartlibrary.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    @Column(nullable = false, unique = true)
    private String isbn;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Integer availableCopies;

    @Column(nullable = false)
    private Integer publishedYear;

    @Column(nullable = false)
    private String language;

    private String shelfLocation;

    @Column(columnDefinition = "TEXT")
    private String coverImage;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.availableCopies == null) {
            this.availableCopies = this.quantity;
        }
    }

    // Constructors
    public Book() {
    }

    public Book(Long id, String title, String author, String isbn, Category category, String description, Integer quantity, Integer availableCopies, Integer publishedYear, String language, String shelfLocation, String coverImage, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.category = category;
        this.description = description;
        this.quantity = quantity;
        this.availableCopies = availableCopies;
        this.publishedYear = publishedYear;
        this.language = language;
        this.shelfLocation = shelfLocation;
        this.coverImage = coverImage;
        this.createdAt = createdAt;
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

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Builder Pattern
    public static BookBuilder builder() {
        return new BookBuilder();
    }

    public static class BookBuilder {
        private Long id;
        private String title;
        private String author;
        private String isbn;
        private Category category;
        private String description;
        private Integer quantity;
        private Integer availableCopies;
        private Integer publishedYear;
        private String language;
        private String shelfLocation;
        private String coverImage;
        private LocalDateTime createdAt;

        public BookBuilder id(Long id) { this.id = id; return this; }
        public BookBuilder title(String title) { this.title = title; return this; }
        public BookBuilder author(String author) { this.author = author; return this; }
        public BookBuilder isbn(String isbn) { this.isbn = isbn; return this; }
        public BookBuilder category(Category category) { this.category = category; return this; }
        public BookBuilder description(String description) { this.description = description; return this; }
        public BookBuilder quantity(Integer quantity) { this.quantity = quantity; return this; }
        public BookBuilder availableCopies(Integer availableCopies) { this.availableCopies = availableCopies; return this; }
        public BookBuilder publishedYear(Integer publishedYear) { this.publishedYear = publishedYear; return this; }
        public BookBuilder language(String language) { this.language = language; return this; }
        public BookBuilder shelfLocation(String shelfLocation) { this.shelfLocation = shelfLocation; return this; }
        public BookBuilder coverImage(String coverImage) { this.coverImage = coverImage; return this; }
        public BookBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Book build() {
            return new Book(id, title, author, isbn, category, description, quantity, availableCopies, publishedYear, language, shelfLocation, coverImage, createdAt);
        }
    }
}
