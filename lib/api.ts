/**
 * lib/api.ts
 *
 * Shared Axios instance.
 * - baseURL points to /api (Next.js Route Handlers).
 * - Request interceptor attaches the auth-token cookie as a Bearer token for
 *   server-to-server calls (client-side requests send cookies automatically).
 * - Response interceptor normalises errors into a consistent shape.
 */

import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

// ─── Instance ─────────────────────────────────────────────────────────────────

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // send cookies on cross-origin requests
  timeout: 10_000,
});

// ─── Request Interceptor ──────────────────────────────────────────────────────

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Client-side: cookies are sent automatically via withCredentials.
    // For server-side calls (Route Handlers), pass the auth header explicitly
    // at the call site using config.headers.Authorization = `Bearer <token>`.
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; code?: string }>) => {
    const status = error.response?.status ?? 0;
    const message =
      error.response?.data?.message ??
      error.message ??
      'An unexpected error occurred.';

    // Redirect to login on 401 (client-side only)
    if (status === 401 && typeof window !== 'undefined') {
      window.location.href = '/login';
    }

    return Promise.reject({
      statusCode: status,
      message,
      code: error.response?.data?.code,
    });
  }
);

export default api;
