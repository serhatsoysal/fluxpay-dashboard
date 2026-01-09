export const handleAuthError = (error: any) => {
    if (error.response?.status === 401) {
        const errorMessage = error.response?.data?.message || '';
        
        if (errorMessage.includes('Session Expired')) {
            return { type: 'SESSION_EXPIRED', message: 'Your session has expired. Please login again.' };
        }
        
        if (errorMessage.includes('Session Invalid')) {
            return { type: 'SESSION_INVALID', message: 'Invalid session. Please login again.' };
        }
        
        return { type: 'UNAUTHORIZED', message: 'Authentication failed.' };
    }
    
    if (error.response?.status === 429) {
        return { type: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' };
    }
    
    return { type: 'UNKNOWN', message: 'An error occurred. Please try again.' };
};

