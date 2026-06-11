package com.smartlibrary.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "system_settings")
public class SystemSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "setting_key", nullable = false, unique = true)
    private String key;

    @Column(name = "setting_value", nullable = false)
    private String value;

    // Default Constructor
    public SystemSetting() {
    }

    // All-Args Constructor
    public SystemSetting(Long id, String key, String value) {
        this.id = id;
        this.key = key;
        this.value = value;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    // Builder Pattern
    public static SystemSettingBuilder builder() {
        return new SystemSettingBuilder();
    }

    public static class SystemSettingBuilder {
        private Long id;
        private String key;
        private String value;

        public SystemSettingBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public SystemSettingBuilder key(String key) {
            this.key = key;
            return this;
        }

        public SystemSettingBuilder value(String value) {
            this.value = value;
            return this;
        }

        public SystemSetting build() {
            return new SystemSetting(id, key, value);
        }
    }
}
