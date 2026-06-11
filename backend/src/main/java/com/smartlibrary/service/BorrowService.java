package com.smartlibrary.service;

import com.smartlibrary.dto.BorrowDto;
import com.smartlibrary.dto.DashboardStatsDto;
import com.smartlibrary.entity.BorrowStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface BorrowService {
    BorrowDto borrowBook(String username, Long bookId);
    BorrowDto returnBook(Long borrowId);
    Page<BorrowDto> getBorrowHistory(String username, Pageable pageable);
    List<BorrowDto> getActiveBorrows(String username);
    List<BorrowDto> getAllBorrows();
    Page<BorrowDto> getAllBorrowsPaginated(Pageable pageable);
    Page<BorrowDto> filterBorrows(BorrowStatus status, Boolean overdue, Long userId, String username, Pageable pageable);
    void checkAndUpdateOverdueBorrows();
    DashboardStatsDto getDashboardStats();
}
