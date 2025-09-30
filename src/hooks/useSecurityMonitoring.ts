import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDeviceFingerprinting } from './useDeviceFingerprinting';
import { useGeographicAnomalyDetection } from './useGeographicAnomalyDetection';

export const useSecurityMonitoring = () => {
  const { fingerprint, detectAnomalies: detectDeviceAnomalies } = useDeviceFingerprinting();
  const { 
    currentLocation, 
    detectAnomalies: detectGeoAnomalies, 
    isAustralianLocation, 
    isExpectedBusinessRegion 
  } = useGeographicAnomalyDetection();

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
          
          // Enhanced login monitoring with device fingerprinting and geo analysis
          try {
            // Retrieve previous login data for anomaly detection
            const previousFingerprint = localStorage.getItem('deviceFingerprint');
            const previousLocation = localStorage.getItem('lastLoginLocation');
            
            const deviceAnomalies = previousFingerprint && fingerprint ? 
              detectDeviceAnomalies(JSON.parse(previousFingerprint)) : [];
            
            const geoAnomalies = previousLocation && currentLocation ? 
              detectGeoAnomalies(JSON.parse(previousLocation)) : [];

            // Store current data for next comparison
            if (fingerprint) {
              localStorage.setItem('deviceFingerprint', JSON.stringify(fingerprint));
            }
            if (currentLocation) {
              localStorage.setItem('lastLoginLocation', JSON.stringify(currentLocation));
            }

            // Calculate risk level
            const riskFactors = [
              ...deviceAnomalies.map(a => `Device: ${a}`),
              ...geoAnomalies.map(a => `${a.type}: ${a.description}`),
              !isAustralianLocation() ? 'Non-Australian location' : null,
              !isExpectedBusinessRegion() ? 'Outside business region' : null
            ].filter(Boolean);

            const riskLevel = riskFactors.length === 0 ? 'LOW' : 
                            riskFactors.length <= 2 ? 'MEDIUM' : 'HIGH';

            // Log successful login with enhanced security details
            await supabase.functions.invoke('admin-security-notification', {
              body: {
                event_type: 'ADMIN_LOGIN_SUCCESS',
                user_id: session?.user?.id,
                user_email: session?.user?.email,
                event_details: {
                  user_agent: navigator.userAgent,
                  timestamp: new Date().toISOString(),
                  location: currentLocation,
                  device_fingerprint: fingerprint,
                  device_anomalies: deviceAnomalies,
                  geographic_anomalies: geoAnomalies,
                  risk_level: riskLevel,
                  risk_factors: riskFactors,
                  is_australian_location: isAustralianLocation(),
                  is_expected_region: isExpectedBusinessRegion()
                },
                timestamp: new Date().toISOString()
              }
            });

            // Send additional alert for high-risk logins
            if (riskLevel === 'HIGH') {
              await supabase.functions.invoke('admin-security-notification', {
                body: {
                  event_type: 'HIGH_RISK_LOGIN',
                  user_id: session?.user?.id,
                  user_email: session?.user?.email,
                  event_details: {
                    risk_factors: riskFactors,
                    anomalies: [...deviceAnomalies, ...geoAnomalies.map(a => a.description)],
                    location: currentLocation,
                    device_fingerprint: fingerprint,
                    requires_investigation: true
                  },
                  timestamp: new Date().toISOString()
                }
              });
            }
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
  }, []); // Simplified dependencies to prevent issues
};