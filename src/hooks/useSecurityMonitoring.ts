import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSecurityMonitoring = () => {
  useEffect(() => {
    let failureCount = 0;
    const maxFailures = 3;
    const suspiciousEventTypes = [
      'SIGN_IN_FAILED',
      'REPEATED_LOGIN_ATTEMPTS',
      'SUSPICIOUS_USER_AGENT'
    ];

    // Monitor auth events for security purposes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Track failed login attempts
        if (event === 'SIGNED_OUT' && !session) {
          failureCount++;
          
          if (failureCount >= maxFailures) {
            console.warn('Multiple failed login attempts detected');
            
            // Send security notification for multiple failures
            try {
              await supabase.functions.invoke('admin-security-notification', {
                body: {
                  event_type: 'MULTIPLE_FAILED_LOGINS',
                  user_id: 'unknown',
                  user_email: 'unknown',
                  event_details: {
                    failure_count: failureCount,
                    user_agent: navigator.userAgent,
                    ip_address: 'client-side',
                    timestamp: new Date().toISOString()
                  },
                  timestamp: new Date().toISOString()
                }
              });
            } catch (error) {
              console.warn('Failed to send security notification:', error);
            }
            
            // Reset counter after notification
            failureCount = 0;
          }
        }
        
        // Reset failure count on successful login
        if (event === 'SIGNED_IN' && session) {
          failureCount = 0;
        }
        
        // Monitor for suspicious login patterns
        if (event === 'SIGNED_IN' && session?.user) {
          const userAgent = navigator.userAgent;
          const suspiciousPatterns = [
            /bot|crawler|spider/i,
            /headless/i,
            /phantom/i,
            /selenium/i
          ];
          
          const isSuspicious = suspiciousPatterns.some(pattern => 
            pattern.test(userAgent)
          );
          
          if (isSuspicious) {
            try {
              await supabase.functions.invoke('admin-security-notification', {
                body: {
                  event_type: 'SUSPICIOUS_LOGIN_ATTEMPT',
                  user_id: session.user.id,
                  user_email: session.user.email || 'unknown',
                  event_details: {
                    user_agent: userAgent,
                    reason: 'Suspicious user agent detected',
                    timestamp: new Date().toISOString()
                  },
                  timestamp: new Date().toISOString()
                }
              });
            } catch (error) {
              console.warn('Failed to send suspicious login notification:', error);
            }
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);
};