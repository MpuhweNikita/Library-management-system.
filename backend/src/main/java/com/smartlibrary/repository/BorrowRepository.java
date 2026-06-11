package com.smartlibrary.repository;

import com.smartlibrary.entity.Book;
import com.smartlibrary.entity.Borrow;
import com.smartlibrary.entity.BorrowStatus;
import com.smartlibrary.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BorrowRepository extends JpaRepository<Borrow, Long> {
    Page<Borrow> findByUser(User user, Pageable pageable);
    List<Borrow> findByUser(User user);
    List<Borrow> findByUserAndStatus(User user, BorrowStatus status);
    List<Borrow> findByBookId(Long bookId);
    List<Borrow> findByStatus(BorrowStatus status);
    List<Borrow> findByDueDateBeforeAndStatus(LocalDate date, BorrowStatus status);
    long countByStatus(BorrowStatus status);
    List<Borrow> findTop5ByOrderByBorrowDateDesc();
    boolean existsByUserAndBookAndStatus(User user, Book book, BorrowStatus status);

    // Find overdue books
    @Query("SELECT b FROM Borrow b WHERE b.status = com.smartlibrary.entity.BorrowStatus.OVERDUE OR (b.status = com.smartlibrary.entity.BorrowStatus.BORROWED AND b.dueDate < CURRENT_DATE)")
    List<Borrow> findOverdueBorrows();

    // Borrow history by user
    @Query("SELECT b FROM Borrow b WHERE b.user.username = :username ORDER BY b.borrowDate DESC")
    List<Borrow> findHistoryByUsername(@Param("username") String username);

    // Borrow history by user paginated
    @Query("SELECT b FROM Borrow b WHERE b.user.username = :username")
    Page<Borrow> findHistoryByUsernamePaginated(@Param("username") String username, Pageable pageable);

    // Active borrow records
    @Query("SELECT b FROM Borrow b WHERE b.status = com.smartlibrary.entity.BorrowStatus.BORROWED OR b.status = com.smartlibrary.entity.BorrowStatus.OVERDUE")
    List<Borrow> findActiveBorrows();

    // Active borrow records by user
    @Query("SELECT b FROM Borrow b WHERE b.user.username = :username AND (b.status = com.smartlibrary.entity.BorrowStatus.BORROWED OR b.status = com.smartlibrary.entity.BorrowStatus.OVERDUE)")
    List<Borrow> findActiveBorrowsByUsername(@Param("username") String username);

    // Advanced filters: status, overdue, user (both ID and username)
    @Query("SELECT b FROM Borrow b WHERE " +
           "(:status IS NULL OR b.status = :status) AND " +
           "(:overdue IS NULL OR (:overdue = true AND b.status = com.smartlibrary.entity.BorrowStatus.OVERDUE) OR (:overdue = false AND b.status != com.smartlibrary.entity.BorrowStatus.OVERDUE)) AND " +
           "(:userId IS NULL OR b.user.id = :userId) AND " +
           "(CAST(:username AS string) IS NULL OR LOWER(b.user.username) = LOWER(CAST(:username AS string)))")
    Page<Borrow> filterBorrows(
            @Param("status") BorrowStatus status,
            @Param("overdue") Boolean overdue,
            @Param("userId") Long userId,
            @Param("username") String username,
            Pageable pageable);
}
