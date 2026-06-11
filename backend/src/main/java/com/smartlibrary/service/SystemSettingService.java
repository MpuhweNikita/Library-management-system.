package com.smartlibrary.service;

public interface SystemSettingService {
    String getSettingValue(String key, String defaultValue);
    void saveOrUpdateSetting(String key, String value);
}
