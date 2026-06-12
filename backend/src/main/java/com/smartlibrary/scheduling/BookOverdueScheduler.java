package com.smartlibrary.scheduling;

import com.smartlibrary.entity.SystemSetting;
import com.smartlibrary.repository.SystemSettingRepository;
import com.smartlibrary.service.BorrowService;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.support.CronExpression;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.concurrent.ScheduledFuture;

/**
 * Dynamic Scheduler class managing background execution of book overdue checks.
 * 
 * <p><strong>Cron Scheduling Implementation:</strong></p>
 * This class schedules checking and flagging overdue loans using Spring's {@link TaskScheduler}
 * and a {@link CronTrigger} loaded dynamically from the PostgreSQL database (setting key: "overdue_check_cron").
 * The default cron is set to run daily at midnight: {@code 0 0 0 * * ?}.
 * 
 * <p>Rescheduling occurs automatically without restarting the server whenever an administrator
 * updates the cron setting via the System Settings interface.</p>
 */
@Component
public class BookOverdueScheduler {

    private static final Logger logger = LoggerFactory.getLogger(BookOverdueScheduler.class);

    private final TaskScheduler taskScheduler;
    private final BorrowService borrowService;
    private final SystemSettingRepository settingRepository;
    private ScheduledFuture<?> scheduledFuture;

    public BookOverdueScheduler(
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
     * Dynamically schedules or reschedules the overdue checking background task
     * using the cron expression stored in system settings.
     */
    public synchronized void reschedule() {
        if (scheduledFuture != null) {
            scheduledFuture.cancel(false);
            logger.info("Cancelled previous dynamic scheduled task.");
        }

        String cron = settingRepository.findByKey("overdue_check_cron")
                .map(SystemSetting::getValue)
                .orElse("0 0 0 * * ?");

        // Validate cron expression, fallback to daily at midnight if invalid
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
     * Executes the main overdue check transaction logic.
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
     * Calculates the next execution time for the cron scheduler.
     * 
     * @return Date representing the next execution trigger
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
