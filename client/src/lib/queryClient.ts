import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // FORCE NETLIFY FUNCTIONS: Convert all API calls to use Netlify functions
  const fullUrl = url.startsWith('http') ? url : 
    url.startsWith('/api/') ? `/.netlify/functions/${url.replace('/api/', '').replace('/', '-')}` : url;
  
  const res = await fetch(fullUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
import { getApiBaseUrl } from './environment.js';

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      const apiPath = queryKey.join("/") as string;
      // FORCE NETLIFY FUNCTIONS: Convert all API calls to use Netlify functions
      const url = apiPath.startsWith('/api/') ? 
        `/.netlify/functions/${apiPath.replace('/api/', '').replace('/', '-')}` : apiPath;
      
      const res = await fetch(url, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      // Handle 404s gracefully for static deployments
      if (res.status === 404 && url.includes('/api/')) {
        console.warn(`API endpoint not available: ${url}`);
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      // Log error but still throw for React Query to handle properly
      console.warn(`API call failed: ${queryKey.join("/")}`, error);
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 30000, // 30 seconds
      retry: (failureCount, error) => {
        // Retry up to 2 times for network errors, but not for 404s
        if (failureCount < 2 && !error.message.includes('404')) {
          return true;
        }
        return false;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
