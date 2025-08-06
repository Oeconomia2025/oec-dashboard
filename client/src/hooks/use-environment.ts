import { useMemo } from 'react';

export function useEnvironment() {
  const isProduction = useMemo(() => {
    // Check if we're in Netlify production environment
    return window.location.hostname === 'oeconomia.io' || 
           window.location.hostname.includes('netlify.app') ||
           import.meta.env.PROD;
  }, []);

  const apiBaseUrl = useMemo(() => {
    if (isProduction) {
      // In production, use relative URLs that will be handled by Netlify redirects
      return '';
    } else {
      // In development, use the local Express server
      return 'http://localhost:5000';
    }
  }, [isProduction]);

  return {
    isProduction,
    isDevelopment: !isProduction,
    apiBaseUrl,
  };
}