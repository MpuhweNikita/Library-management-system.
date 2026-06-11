import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useLoading } from '../context/LoadingContext';
import { 
  FaCog, 
  FaClock, 
  FaPlay, 
  FaSave, 
  FaCheckCircle, 
  FaInfoCircle, 
  FaExclamationTriangle 
} from 'react-icons/fa';

const Settings = () => {
  const { setIsLoading } = useLoading();
  const [cron, setCron] = useState('0 0 0 * * ?');
  const [nextExecution, setNextExecution] = useState('');
  const [schedulerStatus, setSchedulerStatus] = useState('Active');
  const [customCron, setCustomCron] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isTriggering, setIsTriggering] = useState(false);

  // Scheduler presets
  const presets = [
    { name: 'Every 10 Seconds (Testing)', value: '*/10 * * * * ?' },
    { name: 'Every Minute (Testing)', value: '0 * * * * ?' },
    { name: 'Every Hour', value: '0 0 * * * ?' },
    { name: 'Every 12 Hours', value: '0 0 */12 * * ?' },
    { name: 'Every Midnight (Daily)', value: '0 0 0 * * ?' }
  ];

  const fetchSettings = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await axiosInstance.get('/settings/scheduler');
      const data = res.data.data;
      setCron(data.cron);
      setCustomCron(data.cron);
      setNextExecution(data.nextExecution);
      setSchedulerStatus(data.status);
    } catch (err) {
      setError('Failed to fetch scheduler settings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handlePresetChange = (value) => {
    setCustomCron(value);
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!customCron.trim()) {
      setError('Cron expression cannot be empty');
      return;
    }
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      const res = await axiosInstance.put('/settings/scheduler', { cron: customCron.trim() });
      const data = res.data.data;
      setCron(data.cron);
      setNextExecution(data.nextExecution);
      setSchedulerStatus(data.status);
      setSuccess('Scheduler cron settings updated successfully!');
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update scheduler settings. Verify cron expression syntax.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunTaskNow = async () => {
    setError('');
    setSuccess('');
    setIsTriggering(true);
    try {
      await axiosInstance.post('/settings/scheduler/run');
      setSuccess('Overdue check task triggered successfully! Running in the background.');
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError('Failed to trigger overdue check task.');
    } finally {
      setIsTriggering(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not Scheduled';
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="container-fluid py-2" style={{ maxWidth: '1000px' }}>
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">System Configurations</h2>
        <p className="text-muted mb-0">Manage core system properties, triggers, and automated jobs.</p>
      </div>

      {success && (
        <div className="alert alert-success border-0 shadow-sm rounded mb-4 d-flex align-items-center gap-2" role="alert">
          <FaCheckCircle />
          <div>{success}</div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger border-0 shadow-sm rounded mb-4 d-flex align-items-center gap-2" role="alert">
          <FaExclamationTriangle />
          <div>{error}</div>
        </div>
      )}

      <div className="row g-4">
        {/* Left Column: Scheduler Cron Form */}
        <div className="col-12 col-md-7">
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px', backgroundColor: '#ffffff' }}>
            <div className="card-header bg-white py-3.5 border-bottom border-light d-flex align-items-center gap-2.5">
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center text-white"
                style={{ width: '36px', height: '36px', backgroundColor: 'var(--primary-purple)' }}
              >
                <FaClock style={{ fontSize: '15px' }} />
              </div>
              <h5 className="mb-0 fw-bold text-dark">Overdue Scan Scheduler</h5>
            </div>
            
            <div className="card-body p-4">
              <form onSubmit={handleSaveSettings}>
                {/* Form presets */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary" style={{ fontSize: '13px' }}>CHOOSE A CRON PRESET</label>
                  <div className="d-flex flex-column gap-2">
                    {presets.map((preset, idx) => (
                      <div key={idx} className="form-check p-3 bg-light rounded border border-light transition-all hover-preset" style={{ borderRadius: '8px', cursor: 'pointer' }}>
                        <input
                          className="form-check-input ms-0 me-3.5"
                          type="radio"
                          name="cronPreset"
                          id={`preset-${idx}`}
                          value={preset.value}
                          checked={customCron === preset.value}
                          onChange={() => handlePresetChange(preset.value)}
                          style={{ cursor: 'pointer' }}
                        />
                        <label className="form-check-label fw-semibold text-dark" htmlFor={`preset-${idx}`} style={{ cursor: 'pointer', fontSize: '13.5px' }}>
                          {preset.name}
                          <span className="d-block text-muted fw-normal mt-0.5" style={{ fontSize: '12px', fontFamily: 'monospace' }}>{preset.value}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Cron Input */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary" style={{ fontSize: '13px' }}>CUSTOM CRON EXPRESSION</label>
                  <input
                    type="text"
                    className="form-control bg-light border-0 py-2.5"
                    value={customCron}
                    onChange={(e) => setCustomCron(e.target.value)}
                    placeholder="e.g. 0 0 0 * * ?"
                    style={{ fontSize: '14.5px', borderRadius: '8px', fontFamily: 'monospace' }}
                  />
                  <div className="form-text text-muted mt-1.5" style={{ fontSize: '12px' }}>
                    <FaInfoCircle className="me-1" /> Custom Spring Cron layout contains 6 fields: <code>second minute hour day-of-month month day-of-week</code>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="btn btn-primary px-4 py-2.5 fw-bold border-0 shadow-sm d-flex align-items-center justify-content-center gap-2"
                  style={{ borderRadius: '8px' }}
                >
                  <FaSave /> Save Scheduler Cron
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: Status & Direct Actions */}
        <div className="col-12 col-md-5">
          {/* Status Card */}
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px', backgroundColor: '#ffffff' }}>
            <div className="card-header bg-white py-3.5 border-bottom border-light">
              <h5 className="mb-0 fw-bold text-dark">Scheduler Status</h5>
            </div>
            
            <div className="card-body p-4">
              <div className="mb-3.5 d-flex justify-content-between align-items-center">
                <span className="text-muted" style={{ fontSize: '14px' }}>Job Status:</span>
                <span className="badge bg-success-subtle text-success border border-success border-opacity-10 px-2.5 py-1" style={{ fontSize: '12px' }}>
                  {schedulerStatus}
                </span>
              </div>
              
              <div className="mb-3.5 d-flex justify-content-between align-items-center">
                <span className="text-muted" style={{ fontSize: '14px' }}>Active Cron:</span>
                <span className="badge bg-light text-dark font-monospace px-2.5 py-1 border" style={{ fontSize: '12.5px', fontFamily: 'monospace' }}>
                  {cron}
                </span>
              </div>
              
              <div className="border-top border-light pt-3.5 mt-3.5">
                <div className="text-muted mb-1" style={{ fontSize: '13px' }}>NEXT TRIGGER SCHEDULED AT</div>
                <div className="fs-5 fw-bold text-dark d-flex align-items-center gap-2">
                  <FaClock className="text-secondary" style={{ fontSize: '16px' }} />
                  {formatDateTime(nextExecution)}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', backgroundColor: '#ffffff' }}>
            <div className="card-header bg-white py-3.5 border-bottom border-light">
              <h5 className="mb-0 fw-bold text-dark">Immediate Operations</h5>
            </div>
            
            <div className="card-body p-4">
              <p className="text-muted" style={{ fontSize: '13.5px' }}>
                Manually run the overdue scanning algorithm immediately. This will check all active borrowings, flag overdue loans, and log audit entries without waiting for the scheduler.
              </p>
              
              <button
                type="button"
                className="btn btn-outline-primary w-100 fw-bold py-2.5 d-flex align-items-center justify-content-center gap-2 transition-all"
                onClick={handleRunTaskNow}
                disabled={isTriggering}
                style={{ borderRadius: '8px' }}
              >
                <FaPlay style={{ fontSize: '12px' }} /> 
                {isTriggering ? 'Running Scan...' : 'Trigger Scan Now'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hover-preset {
          transition: all 0.2s ease-in-out;
        }
        .hover-preset:hover {
          background-color: #f1f5f9 !important;
          border-color: #cbd5e1 !important;
        }
      `}</style>
    </div>
  );
};

export default Settings;
