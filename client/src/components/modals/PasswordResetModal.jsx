import React, { useState, useEffect, useRef } from 'react';
import apiService from '../../services/api';
import { Loader } from '../common/Loader';

/**
 * Lotus Tubes - Enterprise Password Reset Modal
 * Supports both Customer and Staff portals.
 * Implements 3-step OTP recovery:
 * 1. Request verification code via support@lotustubes.com
 * 2. 6-digit numeric OTP input with 60s cooldown and 10-minute expiry timer
 * 3. New password creation with complexity validation
 */
export const PasswordResetModal = ({
  isOpen,
  onClose,
  portalMode = 'customer', // 'customer' | 'staff'
  initialEmail = '',
  onSuccess,
  onNotify
}) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  // 60-second resend cooldown timer
  const [resendCooldown, setResendCooldown] = useState(0);
  // 10-minute session expiry countdown (600 seconds)
  const [sessionExpiry, setSessionExpiry] = useState(600);

  const otpInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail || '');
      setStep(1);
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setInfoMessage('');
      setResendCooldown(0);
      setSessionExpiry(600);
    }
  }, [isOpen, initialEmail]);

  // Resend cooldown timer decrement
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // 10-minute session expiry countdown decrement
  useEffect(() => {
    if (step !== 2 && step !== 3) return;
    if (sessionExpiry <= 0) return;
    const interval = setInterval(() => {
      setSessionExpiry((prev) => {
        if (prev <= 1) {
          setError('Verification code session has expired. Please request a new code.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step, sessionExpiry]);

  // Auto-focus OTP input when advancing to step 2
  useEffect(() => {
    if (step === 2 && otpInputRef.current) {
      setTimeout(() => otpInputRef.current?.focus(), 150);
    }
  }, [step]);

  if (!isOpen) return null;

  const isStaff = portalMode === 'staff';
  const portalLabel = isStaff ? 'Staff Workspace' : 'Customer Account';

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError('Please provide your registered email address.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      if (isStaff) {
        await apiService.forgotStaffPassword(cleanEmail);
      } else {
        await apiService.forgotCustomerPassword(cleanEmail);
      }

      setStep(2);
      setResendCooldown(60);
      setSessionExpiry(600);
      setInfoMessage(`A 6-digit verification code has been dispatched to ${cleanEmail} from support@lotustubes.com.`);
      if (onNotify) {
        onNotify('Verification code dispatched to your email address.', 'success');
      }
    } catch (err) {
      setError(err.message || 'Failed to request verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || loading) return;
    await handleRequestOtp();
  };

  // Step 2: Validate OTP format and proceed to new password
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const cleanOtp = otp.trim();
    if (!/^\d{6}$/.test(cleanOtp)) {
      setError('Please enter a valid 6-digit verification code.');
      return;
    }
    if (sessionExpiry <= 0) {
      setError('Your verification code has expired. Please request a new code.');
      return;
    }

    setError('');
    setStep(3);
  };

  // Step 3: Submit New Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify both fields.');
      return;
    }

    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanOtp = otp.trim();

      if (isStaff) {
        await apiService.resetStaffPasswordWithOtp(cleanEmail, cleanOtp, newPassword);
      } else {
        await apiService.resetCustomerPasswordWithOtp(cleanEmail, cleanOtp, newPassword);
      }

      setStep(4); // Success screen
      if (onNotify) {
        onNotify('Password reset successfully! You can now sign in.', 'success');
      }
      if (onSuccess) {
        onSuccess(cleanEmail);
      }
    } catch (err) {
      setError(err.message || 'Verification failed. Please check your code or request a new one.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay active"
      role="dialog"
      aria-modal="true"
      aria-label={`Reset ${portalLabel} Password`}
      style={{ zIndex: 9999, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="modal-box"
        style={{
          maxWidth: '480px',
          width: '92%',
          background: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          border: '1px solid #E2E8F0',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            color: '#FFFFFF',
            padding: '20px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#38BDF8'
              }}
            >
              {portalLabel} Security
            </span>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '18px', color: '#FFFFFF', fontWeight: 600 }}>
              {step === 4 ? 'Password Updated' : 'Reset Your Password'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#FFFFFF',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              lineHeight: 1
            }}
          >
            &times;
          </button>
        </div>

        {/* Progress indicator */}
        {step < 4 && (
          <div style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', padding: '12px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: step >= 1 ? '#0284C7' : '#E2E8F0',
                    color: step >= 1 ? '#FFFFFF' : '#64748B',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  1
                </span>
                <span style={{ fontSize: '12px', fontWeight: step === 1 ? 700 : 500, color: step === 1 ? '#0F172A' : '#64748B' }}>
                  Email
                </span>
              </div>
              <div style={{ height: '2px', flex: 1, margin: '0 8px', background: step >= 2 ? '#0284C7' : '#E2E8F0' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: step >= 2 ? '#0284C7' : '#E2E8F0',
                    color: step >= 2 ? '#FFFFFF' : '#64748B',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  2
                </span>
                <span style={{ fontSize: '12px', fontWeight: step === 2 ? 700 : 500, color: step === 2 ? '#0F172A' : '#64748B' }}>
                  Verify OTP
                </span>
              </div>
              <div style={{ height: '2px', flex: 1, margin: '0 8px', background: step >= 3 ? '#0284C7' : '#E2E8F0' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: step >= 3 ? '#0284C7' : '#E2E8F0',
                    color: step >= 3 ? '#FFFFFF' : '#64748B',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  3
                </span>
                <span style={{ fontSize: '12px', fontWeight: step === 3 ? 700 : 500, color: step === 3 ? '#0F172A' : '#64748B' }}>
                  New Password
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {/* Error Message */}
          {error && (
            <div
              style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#B91C1C',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp}>
              <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>
                Enter your registered {isStaff ? 'staff' : 'customer'} email address. We will dispatch a single-use 6-digit verification code from <strong>Lotus Tubes Support (support@lotustubes.com)</strong>.
              </p>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Registered Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder={isStaff ? 'staff@lotustubes.com' : 'purchasing@company.com'}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#475569',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#0284C7',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {loading ? (
                    <Loader variant="button" size="sm" color="#FFFFFF" label="Sending Code..." />
                  ) : (
                    'Send Verification Code →'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Enter 6-digit OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp}>
              {infoMessage && (
                <div
                  style={{
                    background: '#F0F9FF',
                    border: '1px solid #BAE6FD',
                    color: '#0369A1',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    marginBottom: '16px'
                  }}
                >
                  ✉️ {infoMessage}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '13px', color: '#64748B' }}>
                  Sent to <strong>{email}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setError('');
                  }}
                  style={{ background: 'none', border: 'none', color: '#0284C7', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  Change Email
                </button>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                  6-Digit Verification Code (OTP) *
                </label>
                <input
                  ref={otpInputRef}
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(val);
                    if (error) setError('');
                  }}
                  placeholder="123456"
                  style={{
                    width: '100%',
                    padding: '12px',
                    textAlign: 'center',
                    fontSize: '24px',
                    fontWeight: 700,
                    letterSpacing: '8px',
                    borderRadius: '8px',
                    border: '2px solid #0284C7',
                    background: '#F8FAFC',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'monospace'
                  }}
                />
              </div>

              {/* Expiry and Resend Bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#F8FAFC',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  fontSize: '12px'
                }}
              >
                <span style={{ color: sessionExpiry <= 60 ? '#DC2626' : '#64748B' }}>
                  ⏱️ Code expires in <strong>{formatTime(sessionExpiry)}</strong>
                </span>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || loading}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: resendCooldown > 0 ? '#94A3B8' : '#0284C7',
                    fontWeight: 600,
                    cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
                    fontSize: '12px',
                    padding: 0
                  }}
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#475569',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={otp.length !== 6 || sessionExpiry <= 0}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: otp.length === 6 ? '#0284C7' : '#94A3B8',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: otp.length === 6 ? 'pointer' : 'not-allowed'
                  }}
                >
                  Verify Code &amp; Continue →
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Set New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword}>
              <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#475569' }}>
                Verification code accepted. Please choose a strong new password (minimum 8 characters).
              </p>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  New Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="At least 8 characters"
                    style={{
                      width: '100%',
                      padding: '10px 40px 10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#64748B',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Confirm New Password *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Re-enter new password"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#475569',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#16A34A',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {loading ? (
                    <Loader variant="button" size="sm" color="#FFFFFF" label="Updating..." />
                  ) : (
                    'Save New Password ✓'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Success Screen */}
          {step === 4 && (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#DCFCE7',
                  color: '#16A34A',
                  fontSize: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto'
                }}
              >
                ✓
              </div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#0F172A' }}>
                Password Reset Successfully!
              </h4>
              <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#64748B', lineHeight: 1.5 }}>
                Your account password has been updated and previous login sessions have been invalidated for security. You can now log in with your new credentials.
              </p>
              <button
                type="button"
                onClick={onClose}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#0284C7',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Proceed to Sign In →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordResetModal;