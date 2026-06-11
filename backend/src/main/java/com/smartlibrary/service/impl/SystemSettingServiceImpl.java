package com.smartlibrary.service.impl;

import com.smartlibrary.entity.SystemSetting;
import com.smartlibrary.repository.SystemSettingRepository;
import com.smartlibrary.service.SystemSettingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SystemSettingServiceImpl implements SystemSettingService {

    private final SystemSettingRepository settingRepository;

    public SystemSettingServiceImpl(SystemSettingRepository settingRepository) {
        this.settingRepository = settingRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public String getSettingValue(String key, String defaultValue) {
        return settingRepository.findByKey(key)
                .map(SystemSetting::getValue)
                .orElse(defaultValue);
    }

    @Override
    @Transactional
    public void saveOrUpdateSetting(String key, String value) {
        SystemSetting setting = settingRepository.findByKey(key)
                .orElse(SystemSetting.builder().key(key).build());
        setting.setValue(value);
        settingRepository.save(setting);
    }
}
