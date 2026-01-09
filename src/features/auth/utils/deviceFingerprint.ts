export const generateDeviceFingerprint = (): string => {
    const components = [
        navigator.userAgent,
        navigator.language,
        screen.colorDepth,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset(),
        navigator.hardwareConcurrency || 'unknown',
    ];
    
    const rawFingerprint = components.join('|');
    
    return btoa(rawFingerprint);
};

