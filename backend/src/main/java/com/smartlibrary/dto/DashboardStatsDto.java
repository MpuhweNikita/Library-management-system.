package com.smartlibrary.dto;

import java.util.List;

public class DashboardStatsDto {
    private long totalBooks;
    private long totalBorrowedBooks;
    private long totalUsers;
    private long totalOverdueBooks;
    private List<BorrowDto> recentActivity;

    // Constructors
    public DashboardStatsDto() {
    }

    public DashboardStatsDto(long totalBooks, long totalBorrowedBooks, long totalUsers, long totalOverdueBooks, List<BorrowDto> recentActivity) {
        this.totalBooks = totalBooks;
        this.totalBorrowedBooks = totalBorrowedBooks;
        this.totalUsers = totalUsers;
        this.totalOverdueBooks = totalOverdueBooks;
        this.recentActivity = recentActivity;
    }

    // Getters and Setters
    public long getTotalBooks() { return totalBooks; }
    public void setTotalBooks(long totalBooks) { this.totalBooks = totalBooks; }

    public long getTotalBorrowedBooks() { return totalBorrowedBooks; }
    public void setTotalBorrowedBooks(long totalBorrowedBooks) { this.totalBorrowedBooks = totalBorrowedBooks; }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalOverdueBooks() { return totalOverdueBooks; }
    public void setTotalOverdueBooks(long totalOverdueBooks) { this.totalOverdueBooks = totalOverdueBooks; }

    public List<BorrowDto> getRecentActivity() { return recentActivity; }
    public void setRecentActivity(List<BorrowDto> recentActivity) { this.recentActivity = recentActivity; }

    // Builder
    public static DashboardStatsDtoBuilder builder() {
        return new DashboardStatsDtoBuilder();
    }

    public static class DashboardStatsDtoBuilder {
        private long totalBooks;
        private long totalBorrowedBooks;
        private long totalUsers;
        private long totalOverdueBooks;
        private List<BorrowDto> recentActivity;

        public DashboardStatsDtoBuilder totalBooks(long totalBooks) { this.totalBooks = totalBooks; return this; }
        public DashboardStatsDtoBuilder totalBorrowedBooks(long totalBorrowedBooks) { this.totalBorrowedBooks = totalBorrowedBooks; return this; }
        public DashboardStatsDtoBuilder totalUsers(long totalUsers) { this.totalUsers = totalUsers; return this; }
        public DashboardStatsDtoBuilder totalOverdueBooks(long totalOverdueBooks) { this.totalOverdueBooks = totalOverdueBooks; return this; }
        public DashboardStatsDtoBuilder recentActivity(List<BorrowDto> recentActivity) { this.recentActivity = recentActivity; return this; }

        public DashboardStatsDto build() {
            return new DashboardStatsDto(totalBooks, totalBorrowedBooks, totalUsers, totalOverdueBooks, recentActivity);
        }
    }
}
