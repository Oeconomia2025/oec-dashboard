// Centralized environment detection
export function isProduction(): boolean {
  return window.location.hostname === 'oeconomia.io' || 
         window.location.hostname.includes('netlify.app') ||
         import.meta.env.PROD;
}

export function getApiBaseUrl(): string {
  return isProduction() ? '' : 'http://localhost:5000';
}

export function getEnvironmentInfo() {
  const prod = isProduction();
  return {
    isProduction: prod,
    isDevelopment: !prod,
    apiBaseUrl: getApiBaseUrl(),
    hostname: window.location.hostname,
    nodeEnv: import.meta.env.PROD ? 'production' : 'development'
  };
}