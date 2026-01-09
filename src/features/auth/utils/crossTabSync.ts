type AuthSyncMessage = {
    type: 'LOGIN' | 'LOGOUT' | 'AUTH_STATE_CHANGE';
    data?: {
        userId?: string;
        role?: string;
        email?: string;
        tenantId?: string;
    };
};

type AuthSyncCallback = (message: AuthSyncMessage) => void;

class CrossTabSync {
    private channel: BroadcastChannel | null = null;
    private callbacks: Set<AuthSyncCallback> = new Set();
    private storageKey = 'auth-sync-event';

    constructor() {
        this.initializeBroadcastChannel();
        this.setupStorageListener();
    }

    private initializeBroadcastChannel() {
        if (typeof BroadcastChannel !== 'undefined') {
            this.channel = new BroadcastChannel('fluxpay-auth');
            this.channel.onmessage = (event: MessageEvent<AuthSyncMessage>) => {
                this.notifyCallbacks(event.data);
            };
        }
    }

    private setupStorageListener() {
        window.addEventListener('storage', (event) => {
            if (event.key === this.storageKey && event.newValue) {
                try {
                    const message: AuthSyncMessage = JSON.parse(event.newValue);
                    this.notifyCallbacks(message);
                } catch (error) {
                }
            }
        });
    }

    private notifyCallbacks(message: AuthSyncMessage) {
        this.callbacks.forEach(callback => callback(message));
    }

    broadcast(message: AuthSyncMessage) {
        if (this.channel) {
            this.channel.postMessage(message);
        }
        
        localStorage.setItem(this.storageKey, JSON.stringify(message));
        setTimeout(() => {
            localStorage.removeItem(this.storageKey);
        }, 100);
    }

    subscribe(callback: AuthSyncCallback) {
        this.callbacks.add(callback);
        return () => {
            this.callbacks.delete(callback);
        };
    }

    cleanup() {
        if (this.channel) {
            this.channel.close();
            this.channel = null;
        }
        this.callbacks.clear();
    }
}

export const crossTabSync = new CrossTabSync();

