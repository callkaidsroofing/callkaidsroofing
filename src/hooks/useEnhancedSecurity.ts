import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SecurityEvent {
  type: 'login_attempt' | 'session_timeout' | 'suspicious_activity';
  timestamp: string;
  details: Record<string, any>;
}

export const useEnhancedSecurity = () => {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [sessionTimeout, setSessionTimeout] = useState<NodeJS.Timeout | null>(null);

  // Session timeout management (30 minutes)
  const SESSION_TIMEOUT = 30 * 60 * 1000;

  const logSecurityEvent = async (event: SecurityEvent) => {
    setSecurityEvents(prev => [...prev.slice(-9), event]); // Keep last 10 events

    // Log to Supabase if critical
    if (event.type === 'suspicious_activity') {
      try {
        await supabase.functions.invoke('admin-security-notification', {
          body: {
            event_type: 'SUSPICIOUS_ACTIVITY',
            event_details: event.details,
            timestamp: event.timestamp
          }
        });
      } catch (error) {
        console.warn('Failed to log security event:', error);
      }
    }
  };

  const detectSuspiciousActivity = (userAgent: string, ipData?: any) => {
    const suspiciousPatterns = [
      /bot|crawler|spider|scraper/i,
      /curl|wget|python|postman/i,
      /sqlmap|burp|nikto|nmap/i
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
      logSecurityEvent({
        type: 'suspicious_activity',
        timestamp: new Date().toISOString(),
        details: {
          reason: 'Suspicious user agent detected',
          userAgent,
          ipData
        }
      });
    }
  };

  const resetSessionTimeout = () => {
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
    }

    const timeout = setTimeout(async () => {
      await logSecurityEvent({
        type: 'session_timeout',
        timestamp: new Date().toISOString(),
        details: { reason: 'Session expired due to inactivity' }
      });
      
      await supabase.auth.signOut();
    }, SESSION_TIMEOUT);

    setSessionTimeout(timeout);
  };

  useEffect(() => {
    // Monitor user activity for session timeout
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const resetTimeout = () => resetSessionTimeout();
    
    events.forEach(event => {
      document.addEventListener(event, resetTimeout, true);
    });

    // Initial timeout setup
    resetSessionTimeout();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout, true);
      });
      if (sessionTimeout) {
        clearTimeout(sessionTimeout);
      }
    };
  }, []);

  return {
    securityEvents,
    logSecurityEvent,
    detectSuspiciousActivity,
    resetSessionTimeout
  };
};