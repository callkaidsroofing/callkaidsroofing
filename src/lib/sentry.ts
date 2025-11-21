/**
 * Sentry Error Tracking Integration
 * 
 * Per MKF_07 Security Requirements:
 * - Enabled only when ENABLE_SENTRY=true and VITE_SENTRY_DSN is set
 * - Captures unhandled errors, promise rejections, and API errors
 * - Integrates with GlobalErrorBoundary for React error tracking
 */

import * as Sentry from '@sentry/react';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const ENABLE_SENTRY = import.meta.env.ENABLE_SENTRY === 'true';
const IS_PRODUCTION = import.meta.env.PROD;

export function initializeSentry() {
  if (!ENABLE_SENTRY || !SENTRY_DSN) {
    console.log('[Sentry] Disabled (ENABLE_SENTRY=false or no DSN)');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: IS_PRODUCTION ? 'production' : 'development',
    
    // Sample rates for performance monitoring
    tracesSampleRate: IS_PRODUCTION ? 0.1 : 1.0, // 10% in prod, 100% in dev

    // Filtering
    beforeSend(event, hint) {
      // Don't send development errors to Sentry
      if (!IS_PRODUCTION) {
        console.warn('[Sentry] Development error (not sent):', event);
        return null;
      }

      // Filter out known noise
      const error = hint.originalException;
      if (error && typeof error === 'object' && 'message' in error) {
        const message = String(error.message).toLowerCase();
        
        // Ignore network errors (usually user connectivity issues)
        if (message.includes('network') || message.includes('fetch')) {
          return null;
        }

        // Ignore authentication redirects (expected behavior)
        if (message.includes('auth') && message.includes('redirect')) {
          return null;
        }
      }

      return event;
    },

    // User context (privacy-safe - no PII)
    initialScope: {
      tags: {
        app: 'callkaidsroofing',
        timezone: 'Australia/Melbourne',
      },
    },
  });

  console.log('[Sentry] Initialized successfully');
}

/**
 * Capture custom error with context
 */
export function captureError(
  error: Error,
  context?: Record<string, any>
) {
  if (ENABLE_SENTRY && SENTRY_DSN) {
    Sentry.captureException(error, {
      extra: context,
    });
  } else {
    console.error('[Error]', error, context);
  }
}

/**
 * Set user context (called after auth)
 * NOTE: Only non-PII data (user ID, role)
 */
export function setUserContext(userId: string, role?: string) {
  if (ENABLE_SENTRY && SENTRY_DSN) {
    Sentry.setUser({
      id: userId,
      // Do NOT include email, name, phone (PII)
      role: role || 'user',
    });
  }
}

/**
 * Clear user context (called on logout)
 */
export function clearUserContext() {
  if (ENABLE_SENTRY && SENTRY_DSN) {
    Sentry.setUser(null);
  }
}

/**
 * Add breadcrumb for debugging trail
 */
export function addBreadcrumb(
  message: string,
  category: string,
  level: 'info' | 'warning' | 'error' = 'info',
  data?: Record<string, any>
) {
  if (ENABLE_SENTRY && SENTRY_DSN) {
    Sentry.addBreadcrumb({
      message,
      category,
      level,
      data,
    });
  }
}

export { Sentry };
