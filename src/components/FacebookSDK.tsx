/* eslint-disable react-refresh/only-export-components */
import { useEffect } from 'react';

declare global {
  interface Window {
    FB: {
      init: (params: {
        appId: string;
        cookie: boolean;
        xfbml: boolean;
        version: string;
      }) => void;
      AppEvents: {
        logPageView: () => void;
      };
      login: (callback: (response: unknown) => void, options?: { scope: string }) => void;
      logout: (callback: (response: unknown) => void) => void;
      getLoginStatus: (callback: (response: unknown) => void) => void;
      api: (
        path: string,
        method: string,
        params: Record<string, unknown>,
        callback: (response: unknown) => void
      ) => void;
    };
    fbAsyncInit: () => void;
  }
}

interface FacebookSDKProps {
  appId: string;
  onReady?: () => void;
}

export const FacebookSDK = ({ appId, onReady }: FacebookSDKProps) => {
  useEffect(() => {
    // Initialize Facebook SDK
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: appId,
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
      
      window.FB.AppEvents.logPageView();
      
      if (onReady) {
        onReady();
      }
    };

    // Load Facebook SDK script
    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.getElementById('facebook-jssdk');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, [appId, onReady]);

  return null;
};

export const useFacebookLogin = () => {
  const login = (callback: (response: unknown) => void) => {
    if (window.FB) {
      window.FB.login(callback, {
        scope: 'pages_manage_posts,pages_read_engagement,pages_show_list,instagram_basic,instagram_content_publish'
      });
    }
  };

  const logout = (callback: (response: unknown) => void) => {
    if (window.FB) {
      window.FB.logout(callback);
    }
  };

  const getLoginStatus = (callback: (response: unknown) => void) => {
    if (window.FB) {
      window.FB.getLoginStatus(callback);
    }
  };

  const postToPage = (
    pageId: string,
    message: string,
    accessToken: string,
    callback: (response: unknown) => void
  ) => {
    if (window.FB) {
      window.FB.api(
        `/${pageId}/feed`,
        'POST',
        {
          message: message,
          access_token: accessToken
        },
        callback
      );
    }
  };

  return {
    login,
    logout,
    getLoginStatus,
    postToPage
  };
};