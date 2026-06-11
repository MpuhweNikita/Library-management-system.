package com.smartlibrary.service;

import com.smartlibrary.entity.SystemSetting;
import com.smartlibrary.repository.SystemSettingRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.scheduling.support.CronExpression;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.concurrent.ScheduledFuture;

@Service
public class ScheduledTaskService {

    private static final Logger logger = LoggerFactory.getLogger(ScheduledTaskService.class);

    private final TaskScheduler taskScheduler;
    private final BorrowService borrowService;
    private final SystemSettingRepository settingRepository;
    private ScheduledFuture<?> scheduledFuture;

    public ScheduledTaskService(
            TaskScheduler taskScheduler,
            BorrowService borrowService,
            SystemSettingRepository settingRepository
    ) {
        this.taskScheduler = taskScheduler;
        this.borrowService = borrowService;
        this.settingRepository = settingRepository;
    }

    @PostConstruct
    public void init() {
        reschedule();
    }

    /**
     * Reschedules the task using the cron expression from the system settings.
     * Cancels any previously scheduled task to ensure only one instances runs.
     */
    public synchronized void reschedule() {
        if (scheduledFuture != null) {
            scheduledFuture.cancel(false);
            logger.info("Cancelled previous dynamic scheduled task.");
        }

        String cron = settingRepository.findByKey("overdue_check_cron")
                .map(SystemSetting::getValue)
                .orElse("0 0 0 * * ?");

        // Validate cron expression, fallback if invalid
        try {
            CronExpression.parse(cron);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid cron expression '{}' stored in database. Falling back to daily at midnight.", cron);
            cron = "0 0 0 * * ?";
        }

        logger.info("Scheduling overdue check task dynamically with cron: {}", cron);
        scheduledFuture = taskScheduler.schedule(
                this::runOverdueCheck,
                new CronTrigger(cron)
        );
    }

    /**
     * Executes the overdue check task.
     */
    public void runOverdueCheck() {
        logger.info("Executing dynamic scheduled task: Checking and updating overdue borrow records.");
        try {
            borrowService.checkAndUpdateOverdueBorrows();
            logger.info("Dynamic scheduled task completed successfully.");
        } catch (Exception e) {
            logger.error("Error executing dynamic scheduled task for overdue borrows: ", e);
        }
    }

    /**
     * Computes the next scheduled execution time based on the active cron string.
     */
    public Date getNextExecutionTime() {
        String cron = settingRepository.findByKey("overdue_check_cron")
                .map(SystemSetting::getValue)
                .orElse("0 0 0 * * ?");
        
        try {
            CronExpression cronExpression = CronExpression.parse(cron);
            LocalDateTime next = cronExpression.next(LocalDateTime.now());
            if (next != null) {
                return Date.from(next.atZone(ZoneId.systemDefault()).toInstant());
            }
        } catch (Exception e) {
            logger.error("Error calculating next execution time for cron expression: " + cron, e);
        }
        return null;
    }
}
