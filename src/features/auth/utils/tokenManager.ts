class TokenManager {
    private token: string | null = null;

    setToken(token: string) {
        this.token = token;
    }

    getToken(): string | null {
        return this.token;
    }

    setRefreshToken(refreshToken: string) {
        localStorage.setItem('refreshToken', refreshToken);
        window.dispatchEvent(new Event('storage'));
    }

    getRefreshToken(): string | null {
        return localStorage.getItem('refreshToken');
    }

    setSessionId(sessionId: string) {
        localStorage.setItem('sessionId', sessionId);
    }

    getSessionId(): string | null {
        return localStorage.getItem('sessionId');
    }

    setUserId(userId: string) {
        localStorage.setItem('userId', userId);
    }

    getUserId(): string | null {
        return localStorage.getItem('userId');
    }

    setRole(role: string) {
        localStorage.setItem('role', role);
    }

    getRole(): string | null {
        return localStorage.getItem('role');
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('sessionId');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        window.dispatchEvent(new Event('storage'));
    }
}

export const tokenManager = new TokenManager();
