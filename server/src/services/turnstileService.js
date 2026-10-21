import { config } from '../config/env.js';

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * Verify Cloudflare Turnstile token via Cloudflare Siteverify API
 * @param {string} token - The turnstile token from client
 * @param {string} [remoteIp] - Client IP address
 * @returns {Promise<{ success: boolean, message?: string, isConfigError?: boolean, errorCodes?: string[] }>}
 */
export async function verifyTurnstileToken(token, remoteIp = null) {
  const secretKey = config.turnstileSecretKey;

  if (!secretKey) {
    console.error('❌ Cloudflare Turnstile verification failed: Server secret key is missing or misconfigured.');
    return {
      success: false,
      isConfigError: true,
      message: 'Security service misconfiguration: Cloudflare Turnstile secret key is missing.'
    };
  }

  if (!token || typeof token !== 'string' || !token.trim()) {
    return {
      success: false,
      message: 'Cloudflare Turnstile verification token is missing. Please complete the security check.'
    };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token.trim());
    if (remoteIp) {
      formData.append('remoteip', remoteIp);
    }

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (!response.ok) {
      console.warn(`⚠️ Cloudflare Siteverify HTTP error: ${response.status} ${response.statusText}`);
      return {
        success: false,
        message: 'Security verification service temporarily unreachable. Please try again.'
      };
    }

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        hostname: result.hostname,
        challengeTs: result.challenge_ts
      };
    }

    const errorCodes = result['error-codes'] || [];
    console.warn('⚠️ Cloudflare Turnstile verification rejected token:', errorCodes);

    let userMessage = 'Security verification failed. Please try again.';
    if (errorCodes.includes('timeout-or-duplicate')) {
      userMessage = 'Security verification expired or was already used. Please complete the check again.';
    } else if (errorCodes.includes('invalid-input-response')) {
      userMessage = 'Invalid security verification token. Please refresh and try again.';
    }

    return {
      success: false,
      errorCodes,
      message: userMessage
    };
  } catch (error) {
    console.error('❌ Network error during Cloudflare Turnstile Siteverify call:', error.message);
    return {
      success: false,
      message: 'Network error connecting to security verification service. Please try again.'
    };
  }
}
