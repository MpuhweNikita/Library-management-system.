package com.smartlibrary.util;

import com.smartlibrary.entity.*;
import com.smartlibrary.repository.BookRepository;
import com.smartlibrary.repository.BorrowRepository;
import com.smartlibrary.repository.CategoryRepository;
import com.smartlibrary.repository.UserRepository;
import com.smartlibrary.service.SystemSettingService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;
    private final BorrowRepository borrowRepository;
    private final PasswordEncoder passwordEncoder;
    private final SystemSettingService settingService;

    // Standard constructor
    public DataInitializer(UserRepository userRepository, CategoryRepository categoryRepository, BookRepository bookRepository, BorrowRepository borrowRepository, PasswordEncoder passwordEncoder, SystemSettingService settingService) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.bookRepository = bookRepository;
        this.borrowRepository = borrowRepository;
        this.passwordEncoder = passwordEncoder;
        this.settingService = settingService;
    }

    @Override
    public void run(String... args) throws Exception {
        // Ensure default cron schedule setting is seeded
        String currentCron = settingService.getSettingValue("overdue_check_cron", null);
        if (currentCron == null) {
            settingService.saveOrUpdateSetting("overdue_check_cron", "0 0 0 * * ?");
        }
    }
}
