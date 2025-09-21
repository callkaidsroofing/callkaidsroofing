import { useEffect } from 'react';

export const SecurityMonitor = () => {
  useEffect(() => {
    // Monitor for potential security issues
    const handleError = (event: ErrorEvent) => {
      // Log critical errors that might indicate security issues
      if (event.error && (
        event.message.includes('Content Security Policy') ||
        event.message.includes('Mixed Content') ||
        event.message.includes('Cross-Origin')
      )) {
        console.warn('Security-related error detected:', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          timestamp: new Date().toISOString()
        });
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Log promise rejections that might indicate auth or data access issues
      if (event.reason && typeof event.reason === 'string' && (
        event.reason.includes('JWT') ||
        event.reason.includes('unauthorized') ||
        event.reason.includes('permission denied')
      )) {
        console.warn('Security-related promise rejection:', {
          reason: event.reason,
          timestamp: new Date().toISOString()
        });
      }
    };

    // Add event listeners for security monitoring
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Monitor for suspicious DOM manipulation
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            // Check for potentially malicious scripts
            if (element.tagName === 'SCRIPT' && !element.hasAttribute('data-trusted')) {
              console.warn('Untrusted script element detected:', element);
            }
          }
        });
      });
    });

    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      observer.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
};