import { create } from 'zustand';
import { User } from '@/shared/types/common.types';
import { tokenManager } from '../utils/tokenManager';
import { authApi } from '../api/authApi';
import { RegisterCredentials } from '../types/auth.types';
import { crossTabSync } from '../utils/crossTabSync';

interface AuthStore {
    user: User | null;
    tenantId: string | null;
    isAuthenticated: boolean;
    isInitialized: boolean;
    hasAccessToken: () => boolean;
    login: (credentials: { email: string; password: string }) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => Promise<void>;
    logoutAll: () => Promise<void>;
    setUser: (user: User) => void;
    setTenantId: (tenantId: string) => void;
    initialize: () => Promise<void>;
}

const initializeAuth = (): { user: User | null; tenantId: string | null; isAuthenticated: boolean } => {
    const refreshToken = tokenManager.getRefreshToken();
    const userId = tokenManager.getUserId();
    const role = tokenManager.getRole();
    const email = localStorage.getItem('userEmail');
    const tenantId = localStorage.getItem('selectedTenantId');

    if (refreshToken && userId && role) {
        const user: User = {
            id: userId,
            email: email || '',
            name: '',
            role: role.toLowerCase() as any,
            tenants: [],
        };

        return {
            user,
            tenantId,
            isAuthenticated: true,
        };
    }

    return {
        user: null,
        tenantId,
        isAuthenticated: false,
    };
};

export const useAuthStore = create<AuthStore>((set) => {
    const initialState = initializeAuth();

    crossTabSync.subscribe((message) => {
        if (message.type === 'LOGIN' && message.data) {
            const user: User = {
                id: message.data.userId || '',
                email: message.data.email || '',
                name: '',
                role: (message.data.role?.toLowerCase() || 'user') as any,
                tenants: [],
            };

            set({
                user,
                tenantId: message.data.tenantId || null,
                isAuthenticated: true,
            });
        } else if (message.type === 'LOGOUT') {
            set({
                user: null,
                tenantId: null,
                isAuthenticated: false,
            });
        }
    });

    return {
        user: initialState.user,
        tenantId: initialState.tenantId,
        isAuthenticated: initialState.isAuthenticated,
        isInitialized: false,

        hasAccessToken: () => {
            return !!tokenManager.getToken();
        },

        login: async (credentials) => {
            const response = await authApi.login(credentials);
            tokenManager.setToken(response.token);
            tokenManager.setRefreshToken(response.refreshToken);
            tokenManager.setSessionId(response.sessionId);
            tokenManager.setUserId(response.userId);
            tokenManager.setRole(response.role);
            localStorage.setItem('userEmail', credentials.email);
            
            const user: User = {
                id: response.userId,
                email: credentials.email,
                name: '',
                role: response.role.toLowerCase() as any,
                tenants: [],
            };

            set({ 
                user,
                tenantId: response.tenantId || localStorage.getItem('selectedTenantId'),
                isAuthenticated: true 
            });

            if (response.tenantId) {
                localStorage.setItem('selectedTenantId', response.tenantId);
            }

            crossTabSync.broadcast({
                type: 'LOGIN',
                data: {
                    userId: response.userId,
                    role: response.role,
                    email: credentials.email,
                    tenantId: response.tenantId,
                },
            });
        },

        register: async (credentials) => {
            await authApi.register(credentials);
            const loginResponse = await authApi.login({
                email: credentials.adminEmail,
                password: credentials.adminPassword,
            });
            
            tokenManager.setToken(loginResponse.token);
            tokenManager.setRefreshToken(loginResponse.refreshToken);
            tokenManager.setSessionId(loginResponse.sessionId);
            tokenManager.setUserId(loginResponse.userId);
            tokenManager.setRole(loginResponse.role);
            localStorage.setItem('userEmail', credentials.adminEmail);
            
            const user: User = {
                id: loginResponse.userId,
                email: credentials.adminEmail,
                name: `${credentials.adminFirstName} ${credentials.adminLastName}`,
                role: loginResponse.role.toLowerCase() as any,
                tenants: [],
            };

            set({ 
                user,
                tenantId: loginResponse.tenantId || localStorage.getItem('selectedTenantId'),
                isAuthenticated: true 
            });

            if (loginResponse.tenantId) {
                localStorage.setItem('selectedTenantId', loginResponse.tenantId);
            }

            crossTabSync.broadcast({
                type: 'LOGIN',
                data: {
                    userId: loginResponse.userId,
                    role: loginResponse.role,
                    email: credentials.adminEmail,
                    tenantId: loginResponse.tenantId,
                },
            });
        },

        logout: async () => {
            try {
                await authApi.logout();
            } catch {
            } finally {
                tokenManager.clearToken();
                localStorage.removeItem('userEmail');
                set({ user: null, tenantId: null, isAuthenticated: false });
                
                crossTabSync.broadcast({
                    type: 'LOGOUT',
                });
            }
        },

        logoutAll: async () => {
            try {
                await authApi.logoutAll();
            } finally {
                tokenManager.clearToken();
                localStorage.removeItem('userEmail');
                set({ user: null, tenantId: null, isAuthenticated: false });
                
                crossTabSync.broadcast({
                    type: 'LOGOUT',
                });
            }
        },

        setUser: (user) => set({ user, isAuthenticated: true }),

        setTenantId: (tenantId) => {
            localStorage.setItem('selectedTenantId', tenantId);
            set({ tenantId });
        },

        initialize: async () => {
            set({ isInitialized: false });
            
            const refreshToken = tokenManager.getRefreshToken();
            const token = tokenManager.getToken();
            
            if (refreshToken) {
                if (token === null || token === '') {
                    try {
                        const response = await authApi.refreshToken({ refreshToken });
                        tokenManager.setToken(response.token);
                        tokenManager.setRefreshToken(response.refreshToken);
                        tokenManager.setSessionId(response.sessionId);
                        
                        const state = initializeAuth();
                        set({ ...state, isInitialized: true });
                    } catch (error) {
                        tokenManager.clearToken();
                        localStorage.removeItem('userEmail');
                        set({ user: null, tenantId: null, isAuthenticated: false, isInitialized: true });
                    }
                } else {
                    const state = initializeAuth();
                    set({ ...state, isInitialized: true });
                }
            } else {
                tokenManager.clearToken();
                localStorage.removeItem('userEmail');
                set({ user: null, tenantId: null, isAuthenticated: false, isInitialized: true });
            }
        },
    };
});
