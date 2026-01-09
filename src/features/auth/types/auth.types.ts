import { User } from '@/shared/types/common.types';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    slug: string;
    billingEmail: string;
    adminEmail: string;
    adminPassword: string;
    adminFirstName: string;
    adminLastName: string;
}

export interface LoginResponse {
    token: string;
    refreshToken: string;
    sessionId: string;
    userId: string;
    tenantId: string;
    role: string;
    expiresIn: number;
    refreshExpiresIn: number;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface RefreshTokenResponse {
    token: string;
    refreshToken: string;
    sessionId: string;
    expiresIn: number;
    refreshExpiresIn: number;
}

export interface DeviceInfo {
    deviceId: string;
    deviceType: string;
    os: string;
    osVersion: string;
    browser: string;
    browserVersion: string;
}

export interface Session {
    sessionId: string;
    deviceInfo: DeviceInfo;
    ipAddress: string;
    createdAt: string;
    lastAccess: string;
}

export interface AuthState {
    user: User | null;
    tenantId: string | null;
    isAuthenticated: boolean;
}
