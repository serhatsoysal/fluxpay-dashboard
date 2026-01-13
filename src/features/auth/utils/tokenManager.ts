class TokenManager {
    private token: string | null = null;

    setToken(token: string) {
        this.token = token;
        localStorage.setItem('accessToken', token);
    }

    getToken(): string | null {
        if (this.token) {
            return this.token;
        }
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
            this.token = storedToken;
        }
        return storedToken;
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
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('sessionId');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        window.dispatchEvent(new Event('storage'));
    }
}

export const tokenManager = new TokenManager();
