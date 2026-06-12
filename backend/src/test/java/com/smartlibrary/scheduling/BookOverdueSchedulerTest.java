package com.smartlibrary.scheduling;

import com.smartlibrary.entity.SystemSetting;
import com.smartlibrary.repository.SystemSettingRepository;
import com.smartlibrary.service.BorrowService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.Trigger;
import org.springframework.scheduling.support.CronTrigger;

import java.util.Date;
import java.util.Optional;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.Delayed;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BookOverdueSchedulerTest {

    @Mock
    private TaskScheduler taskScheduler;

    @Mock
    private BorrowService borrowService;

    @Mock
    private SystemSettingRepository settingRepository;

    private BookOverdueScheduler bookOverdueScheduler;
    private TestScheduledFuture testFuture;

    // Custom non-mocked implementation of ScheduledFuture to avoid Mockito ByteBuddy Java 24 compatibility limitations with JDK classes
    private static class TestScheduledFuture implements ScheduledFuture<Object> {
        boolean cancelCalled = false;
        boolean mayInterrupt = false;

        @Override
        public long getDelay(TimeUnit unit) {
            return 0;
        }

        @Override
        public int compareTo(Delayed o) {
            return 0;
        }

        @Override
        public boolean cancel(boolean mayInterruptIfRunning) {
            cancelCalled = true;
            mayInterrupt = mayInterruptIfRunning;
            return true;
        }

        @Override
        public boolean isCancelled() {
            return cancelCalled;
        }

        @Override
        public boolean isDone() {
            return false;
        }

        @Override
        public Object get() {
            return null;
        }

        @Override
        public Object get(long timeout, TimeUnit unit) {
            return null;
        }
    }

    @BeforeEach
    void setUp() {
        bookOverdueScheduler = new BookOverdueScheduler(taskScheduler, borrowService, settingRepository);
        testFuture = new TestScheduledFuture();
    }

    @Test
    void reschedule_Success_WithValidCron() {
        SystemSetting cronSetting = new SystemSetting(1L, "overdue_check_cron", "0 0 12 * * ?");
        when(settingRepository.findByKey("overdue_check_cron")).thenReturn(Optional.of(cronSetting));
        
        doReturn(testFuture).when(taskScheduler).schedule(any(Runnable.class), any(Trigger.class));

        bookOverdueScheduler.reschedule();

        ArgumentCaptor<Trigger> triggerCaptor = ArgumentCaptor.forClass(Trigger.class);
        verify(taskScheduler, times(1)).schedule(any(Runnable.class), triggerCaptor.capture());
        
        Trigger trigger = triggerCaptor.getValue();
        assertTrue(trigger instanceof CronTrigger);
        assertEquals("0 0 12 * * ?", ((CronTrigger) trigger).getExpression());
    }

    @Test
    void reschedule_Fallback_WithInvalidCron() {
        SystemSetting cronSetting = new SystemSetting(1L, "overdue_check_cron", "invalid-cron-expr");
        when(settingRepository.findByKey("overdue_check_cron")).thenReturn(Optional.of(cronSetting));
        
        doReturn(testFuture).when(taskScheduler).schedule(any(Runnable.class), any(Trigger.class));

        bookOverdueScheduler.reschedule();

        ArgumentCaptor<Trigger> triggerCaptor = ArgumentCaptor.forClass(Trigger.class);
        verify(taskScheduler, times(1)).schedule(any(Runnable.class), triggerCaptor.capture());
        
        Trigger trigger = triggerCaptor.getValue();
        assertTrue(trigger instanceof CronTrigger);
        assertEquals("0 0 0 * * ?", ((CronTrigger) trigger).getExpression());
    }

    @Test
    void reschedule_CancelsPreviousTask() {
        SystemSetting cronSetting = new SystemSetting(1L, "overdue_check_cron", "0 0 0 * * ?");
        when(settingRepository.findByKey("overdue_check_cron")).thenReturn(Optional.of(cronSetting));
        doReturn(testFuture).when(taskScheduler).schedule(any(Runnable.class), any(Trigger.class));

        // First execution schedules the task
        bookOverdueScheduler.reschedule();
        assertFalse(testFuture.cancelCalled);

        // Second execution should cancel the existing task
        bookOverdueScheduler.reschedule();
        assertTrue(testFuture.cancelCalled);
        assertFalse(testFuture.mayInterrupt);
    }

    @Test
    void getNextExecutionTime_Success() {
        SystemSetting cronSetting = new SystemSetting(1L, "overdue_check_cron", "0 0 0 * * ?");
        when(settingRepository.findByKey("overdue_check_cron")).thenReturn(Optional.of(cronSetting));

        Date nextRun = bookOverdueScheduler.getNextExecutionTime();

        assertNotNull(nextRun);
        assertTrue(nextRun.after(new Date()));
    }

    @Test
    void runOverdueCheck_Success() {
        bookOverdueScheduler.runOverdueCheck();
        verify(borrowService, times(1)).checkAndUpdateOverdueBorrows();
    }
}
