import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSecurityMonitoring = () => {
  useEffect(() => {
    let failureCount = 0;
    const maxFailures = 3; // Reduced threshold for faster response
    const resetTime = 15 * 60 * 1000; // 15 minutes
    const blockTime = 5 * 60 * 1000; // 5 minute progressive delay

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          // Reset failure count on successful login
          failureCount = 0;
          
          // Enhanced login monitoring with geolocation
          try {
            const locationData = await fetch('https://ipapi.co/json/')
              .then(res => res.json())
              .catch(() => null);

            // Log successful login with enhanced details
            await supabase.functions.invoke('admin-security-notification', {
              body: {
                event_type: 'ADMIN_LOGIN_SUCCESS',
                user_id: session?.user?.id,
                user_email: session?.user?.email,
                event_details: {
                  user_agent: navigator.userAgent,
                  timestamp: new Date().toISOString(),
                  location: locationData,
                  device_fingerprint: btoa(navigator.userAgent + navigator.language + screen.width + screen.height)
                },
                timestamp: new Date().toISOString()
              }
            });
          } catch (error) {
            console.warn('Failed to log login details:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          // Check for potential unauthorized access
          if (session && !session.user) {
            console.warn('Potential unauthorized access detected');
            
            try {
              await supabase.functions.invoke('admin-security-notification', {
                body: {
                  event_type: 'UNAUTHORIZED_ACCESS_ATTEMPT',
                  event_details: {
                    timestamp: new Date().toISOString(),
                    session_data: session,
                    user_agent: navigator.userAgent
                  },
                  timestamp: new Date().toISOString()
                }
              });
            } catch (error) {
              console.warn('Failed to send security notification:', error);
            }
          }
        }

        // Enhanced suspicious user agent detection
        if (event === 'SIGNED_IN' && session?.user) {
          const userAgent = navigator.userAgent;
          const suspiciousPatterns = [
            /bot|crawler|spider|scraper/i,
            /curl|wget|python|postman/i,
            /sqlmap|burp|nikto|nmap|metasploit/i,
            /headless|phantom|selenium/i
          ];

          if (suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
            try {
              await supabase.functions.invoke('admin-security-notification', {
                body: {
                  event_type: 'SUSPICIOUS_LOGIN_ATTEMPT',
                  user_id: session.user.id,
                  user_email: session.user.email,
                  event_details: {
                    user_agent: userAgent,
                    timestamp: new Date().toISOString(),
                    risk_level: 'HIGH'
                  },
                  timestamp: new Date().toISOString()
                }
              });
            } catch (error) {
              console.warn('Failed to send security notification:', error);
            }
          }
        }
      }
    );

    // Enhanced failed login monitoring with progressive delays
    const handleAuthError = async (error: any) => {
      if (error?.message?.includes('Invalid login credentials')) {
        failureCount++;
        
        // Progressive delay implementation
        if (failureCount >= 2) {
          const delay = Math.min(failureCount * 2000, 30000); // Max 30 second delay
          localStorage.setItem('loginDelay', (Date.now() + delay).toString());
        }
        
        if (failureCount >= maxFailures) {
          try {
            await supabase.functions.invoke('admin-security-notification', {
              body: {
                event_type: 'MULTIPLE_FAILED_LOGINS',
                event_details: {
                  failure_count: failureCount,
                  user_agent: navigator.userAgent,
                  timestamp: new Date().toISOString(),
                  ip_blocked_until: new Date(Date.now() + blockTime).toISOString()
                },
                timestamp: new Date().toISOString()
              }
            });
          } catch (notificationError) {
            console.warn('Failed to send security notification:', notificationError);
          }
          
          // Block further attempts temporarily
          localStorage.setItem('loginBlocked', (Date.now() + blockTime).toString());
          
          // Reset count after notification
          setTimeout(() => {
            failureCount = 0;
            localStorage.removeItem('loginBlocked');
            localStorage.removeItem('loginDelay');
          }, resetTime);
        }
      }
    };

    // Listen for authentication errors
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason?.message?.includes('Invalid login credentials')) {
        handleAuthError(event.reason);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
};