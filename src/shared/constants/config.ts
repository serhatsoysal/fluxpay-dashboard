export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws';
export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
export const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || 'development';

export const CORS_CONFIG = {
    withCredentials: import.meta.env.VITE_CORS_WITH_CREDENTIALS === 'true',
    credentials: import.meta.env.VITE_CORS_CREDENTIALS || 'include',
    mode: (import.meta.env.VITE_CORS_MODE || 'cors') as RequestMode,
};