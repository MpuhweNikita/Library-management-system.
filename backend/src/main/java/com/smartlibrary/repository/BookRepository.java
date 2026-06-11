package com.smartlibrary.repository;

import com.smartlibrary.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    Optional<Book> findByIsbn(String isbn);
    boolean existsByIsbn(String isbn);
    boolean existsByCategoryId(Long categoryId);

    // Search books by title
    @Query("SELECT b FROM Book b WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<Book> searchByTitle(@Param("title") String title);

    // Search books by author
    @Query("SELECT b FROM Book b WHERE LOWER(b.author) LIKE LOWER(CONCAT('%', :author, '%'))")
    List<Book> searchByAuthor(@Param("author") String author);

    // Search books by ISBN
    @Query("SELECT b FROM Book b WHERE b.isbn = :isbn")
    Optional<Book> searchByIsbn(@Param("isbn") String isbn);

    // Search books by category
    @Query("SELECT b FROM Book b WHERE LOWER(b.category.name) = LOWER(:categoryName)")
    List<Book> searchByCategory(@Param("categoryName") String categoryName);

    // Count books by category (Returns category name and count of books in it)
    @Query("SELECT b.category.name, COUNT(b) FROM Book b GROUP BY b.category.name")
    List<Object[]> countBooksByCategory();

    // General keyword search
    @Query("SELECT b FROM Book b WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(b.isbn) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(b.category.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Book> searchBooks(@Param("keyword") String keyword, Pageable pageable);

    // Advanced filters: category, author, language, year, availability
    @Query("SELECT b FROM Book b WHERE " +
           "(CAST(:category AS string) IS NULL OR LOWER(b.category.name) = LOWER(CAST(:category AS string))) AND " +
           "(CAST(:author AS string) IS NULL OR LOWER(b.author) LIKE LOWER(CONCAT('%', CAST(:author AS string), '%'))) AND " +
           "(CAST(:language AS string) IS NULL OR LOWER(b.language) = LOWER(CAST(:language AS string))) AND " +
           "(:year IS NULL OR b.publishedYear = :year) AND " +
           "(:available IS NULL OR (:available = true AND b.availableCopies > 0) OR (:available = false AND b.availableCopies = 0))")
    Page<Book> filterBooks(
            @Param("category") String category,
            @Param("author") String author,
            @Param("language") String language,
            @Param("year") Integer year,
            @Param("available") Boolean available,
            Pageable pageable);
}
