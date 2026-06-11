package com.smartlibrary.controller;

import com.smartlibrary.dto.ApiResponse;
import com.smartlibrary.service.ScheduledTaskService;
import com.smartlibrary.service.SystemSettingService;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.support.CronExpression;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/settings")
public class SystemSettingController {

    private final SystemSettingService settingService;
    private final ScheduledTaskService scheduledTaskService;

    public SystemSettingController(
            SystemSettingService settingService,
            ScheduledTaskService scheduledTaskService
    ) {
        this.settingService = settingService;
        this.scheduledTaskService = scheduledTaskService;
    }

    @GetMapping("/scheduler")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSchedulerSettings() {
        String cron = settingService.getSettingValue("overdue_check_cron", "0 0 0 * * ?");
        Map<String, Object> data = new HashMap<>();
        data.put("cron", cron);
        data.put("nextExecution", scheduledTaskService.getNextExecutionTime());
        data.put("status", "Active");
        return ResponseEntity.ok(ApiResponse.success("Scheduler settings retrieved successfully", data));
    }

    @PutMapping("/scheduler")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateSchedulerSettings(@RequestBody Map<String, String> request) {
        String cron = request.get("cron");
        if (cron == null || cron.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Cron expression is required"));
        }

        cron = cron.trim();
        if (!CronExpression.isValidExpression(cron)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid cron expression format. Please check the cron syntax."));
        }

        // Save to database and reschedule task
        settingService.saveOrUpdateSetting("overdue_check_cron", cron);
        scheduledTaskService.reschedule();

        Map<String, Object> data = new HashMap<>();
        data.put("cron", cron);
        data.put("nextExecution", scheduledTaskService.getNextExecutionTime());
        data.put("status", "Active");

        return ResponseEntity.ok(ApiResponse.success("Scheduler settings updated and task rescheduled successfully", data));
    }

    @PostMapping("/scheduler/run")
    public ResponseEntity<ApiResponse<Void>> triggerSchedulerImmediately() {
        // Run check asynchronously so we return a response to the UI immediately
        CompletableFuture.runAsync(scheduledTaskService::runOverdueCheck);
        return ResponseEntity.ok(ApiResponse.success("Overdue borrow check task triggered and running in the background"));
    }
}
