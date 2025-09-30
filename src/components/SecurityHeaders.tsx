import { Helmet } from 'react-helmet-async';

interface SecurityHeadersProps {
  isAdmin?: boolean;
}

export const SecurityHeaders = ({ isAdmin = false }: SecurityHeadersProps) => {
  // Generate a unique nonce for inline scripts
  const nonce = crypto.randomUUID();
  
  // Enhanced CSP for admin pages with stricter controls
  const adminCSP = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 
      https://www.googletagmanager.com 
      https://www.google-analytics.com 
      https://analytics.google.com;
    style-src 'self' 'nonce-${nonce}' 
      https://fonts.googleapis.com;
    font-src 'self' 
      https://fonts.gstatic.com;
    img-src 'self' data: blob: 
      https://www.google-analytics.com 
      https://www.googletagmanager.com;
    connect-src 'self' 
      https://www.google-analytics.com 
      https://analytics.google.com 
      https://www.googletagmanager.com 
      https://vlnkzpyeppfdmresiaoh.supabase.co 
      wss://vlnkzpyeppfdmresiaoh.supabase.co 
      https://ipapi.co;
    frame-src 'none';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
    require-trusted-types-for 'script';
  `.replace(/\s+/g, ' ').trim();

  // Standard CSP for public pages
  const standardCSP = `
    default-src 'self' data: blob:;
    script-src 'self' 'nonce-${nonce}' 
      https://www.googletagmanager.com 
      https://www.google-analytics.com 
      https://connect.facebook.net 
      https://analytics.google.com;
    style-src 'self' 'unsafe-inline' 
      https://fonts.googleapis.com;
    font-src 'self' 
      https://fonts.gstatic.com 
      data:;
    img-src 'self' data: blob: 
      https://www.google-analytics.com 
      https://www.googletagmanager.com 
      https://www.facebook.com 
      https://*.facebook.com;
    connect-src 'self' 
      https://www.google-analytics.com 
      https://analytics.google.com 
      https://www.googletagmanager.com 
      https://connect.facebook.net 
      https://www.facebook.com 
      https://vlnkzpyeppfdmresiaoh.supabase.co 
      wss://vlnkzpyeppfdmresiaoh.supabase.co 
      https://ipapi.co;
    frame-src 'self' 
      https://www.facebook.com 
      https://www.google.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
    require-trusted-types-for 'script';
  `.replace(/\s+/g, ' ').trim();

  return (
    <Helmet>
      {/* Enhanced Content Security Policy */}
      <meta httpEquiv="Content-Security-Policy" content={isAdmin ? adminCSP : standardCSP} />
      
      {/* Enhanced Security Headers */}
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), bluetooth=(), magnetometer=(), gyroscope=(), accelerometer=()" />
      
      {/* Additional security meta tags */}
      <meta httpEquiv="Cross-Origin-Embedder-Policy" content="require-corp" />
      <meta httpEquiv="Cross-Origin-Opener-Policy" content="same-origin" />
      <meta httpEquiv="Cross-Origin-Resource-Policy" content="same-origin" />
      
      {/* HSTS will be handled at server level */}
    </Helmet>
  );
};