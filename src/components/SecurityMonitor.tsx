import { useEffect } from 'react';

export const SecurityMonitor = () => {
  useEffect(() => {
    // Enhanced security monitoring with threat detection
    const handleError = (event: ErrorEvent) => {
      // Log critical errors that might indicate security issues
      if (event.error && (
        event.message.includes('Content Security Policy') ||
        event.message.includes('Mixed Content') ||
        event.message.includes('Cross-Origin') ||
        event.message.includes('refused to execute') ||
        event.message.includes('unsafe-eval') ||
        event.message.includes('unsafe-inline')
      )) {
        console.warn('Security-related error detected:', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        });

        // Log security events to console for monitoring
        if (event.message.includes('Content Security Policy')) {
          console.error('CSP Violation detected - potential XSS attempt');
        }
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Enhanced monitoring for auth and security-related rejections
      if (event.reason && typeof event.reason === 'string' && (
        event.reason.includes('JWT') ||
        event.reason.includes('unauthorized') ||
        event.reason.includes('permission denied') ||
        event.reason.includes('authentication failed') ||
        event.reason.includes('invalid token') ||
        event.reason.includes('access denied')
      )) {
        console.warn('Security-related promise rejection:', {
          reason: event.reason,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent
        });

        // Count failed authentication attempts
        const failedAttempts = parseInt(sessionStorage.getItem('auth_failures') || '0') + 1;
        sessionStorage.setItem('auth_failures', failedAttempts.toString());
        
        if (failedAttempts >= 3) {
          console.error('Multiple authentication failures detected');
          sessionStorage.setItem('auth_locked', new Date().toISOString());
        }
      }
    };

    // Add event listeners for security monitoring
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Enhanced DOM manipulation monitoring
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            
            // Check for potentially malicious scripts
            if (element.tagName === 'SCRIPT' && !element.hasAttribute('data-trusted')) {
              console.warn('Untrusted script element detected:', {
                element: element.outerHTML,
                timestamp: new Date().toISOString(),
                src: element.getAttribute('src'),
                content: element.textContent?.substring(0, 100)
              });
            }
            
            // Check for suspicious iframes
            if (element.tagName === 'IFRAME') {
              const src = element.getAttribute('src');
              if (src && !src.startsWith(window.location.origin) && 
                  !src.startsWith('https://www.google.com') && 
                  !src.startsWith('https://www.facebook.com')) {
                console.warn('Suspicious iframe detected:', {
                  src,
                  timestamp: new Date().toISOString()
                });
              }
            }
            
            // Check for forms with external actions
            if (element.tagName === 'FORM') {
              const action = element.getAttribute('action');
              if (action && !action.startsWith(window.location.origin) && !action.startsWith('/')) {
                console.warn('External form action detected:', {
                  action,
                  timestamp: new Date().toISOString()
                });
              }
            }
          }
        });
      });
    });

    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });

    // Monitor for suspicious URL changes
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      console.debug('Navigation event:', args[2]);
      return originalPushState.apply(history, args);
    };
    
    history.replaceState = function(...args) {
      console.debug('Navigation replace event:', args[2]);
      return originalReplaceState.apply(history, args);
    };

    // Check for basic security headers on page load
    const checkSecurityHeaders = () => {
      fetch(window.location.href, { method: 'HEAD' })
        .then(response => {
          const headers = response.headers;
          const securityHeaders = [
            'x-frame-options',
            'x-content-type-options',
            'x-xss-protection',
            'strict-transport-security'
          ];
          
          securityHeaders.forEach(header => {
            if (!headers.has(header)) {
              console.debug(`Missing security header: ${header}`);
            }
          });
        })
        .catch(() => {
          // Silently ignore - this is just for monitoring
        });
    };

    // Run security header check after a delay
    setTimeout(checkSecurityHeaders, 2000);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      observer.disconnect();
      
      // Restore original history methods
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  return null; // This component doesn't render anything
};