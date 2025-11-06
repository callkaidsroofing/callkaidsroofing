import { Helmet } from 'react-helmet-async';

export const SecurityHeaders = () => {
  return (
    <Helmet>
      {/* Content Security Policy */}
      <meta httpEquiv="Content-Security-Policy" content={`
        default-src 'self' data: blob:;
        script-src 'self' 'unsafe-inline' 'unsafe-eval' 
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
          wss://vlnkzpyeppfdmresiaoh.supabase.co;
        frame-src 'self' 
          https://www.facebook.com 
          https://www.google.com;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        upgrade-insecure-requests;
      `.replace(/\s+/g, ' ').trim()} />
      
      {/* Additional Security Headers */}
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=(), payment=()" />
      
      {/* HSTS will be handled at server level */}
    </Helmet>
  );
};