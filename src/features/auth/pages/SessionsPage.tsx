import { FC, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { Session } from '../types/auth.types';
import { tokenManager } from '../utils/tokenManager';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { toast } from '@/shared/components/ui/use-toast';

export const SessionsPage: FC = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const currentSessionId = tokenManager.getSessionId();

    useEffect(() => {
        loadSessions();
    }, []);

    const loadSessions = async () => {
        try {
            setLoading(true);
            const data = await authApi.getSessions();
            setSessions(data);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to load sessions',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLogoutDevice = async (sessionId: string) => {
        try {
            await authApi.logout();
            toast({
                variant: 'success',
                title: 'Success',
                description: 'Device logged out successfully',
            });
            loadSessions();
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to logout device',
            });
        }
    };

    const handleLogoutAll = async () => {
        try {
            await authApi.logoutAll();
            window.location.href = '/login';
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to logout all devices',
            });
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Active Sessions</h1>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Active Sessions</h1>
                <Button onClick={handleLogoutAll} variant="destructive">
                    Logout All Devices
                </Button>
            </div>

            <div className="space-y-4">
                {sessions.map((session) => (
                    <Card key={session.sessionId} className="p-6">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold mb-2">
                                    {session.deviceInfo.browser} on {session.deviceInfo.os}
                                    {session.sessionId === currentSessionId && (
                                        <span className="ml-2 text-sm text-green-600 font-normal">
                                            (Current)
                                        </span>
                                    )}
                                </h3>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <p>
                                        <span className="font-medium">Device Type:</span>{' '}
                                        {session.deviceInfo.deviceType}
                                    </p>
                                    <p>
                                        <span className="font-medium">IP Address:</span>{' '}
                                        {session.ipAddress}
                                    </p>
                                    <p>
                                        <span className="font-medium">Last Active:</span>{' '}
                                        {new Date(session.lastAccess).toLocaleString()}
                                    </p>
                                    <p>
                                        <span className="font-medium">Created:</span>{' '}
                                        {new Date(session.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            {session.sessionId !== currentSessionId && (
                                <Button
                                    onClick={() => handleLogoutDevice(session.sessionId)}
                                    variant="outline"
                                    size="sm"
                                >
                                    Logout This Device
                                </Button>
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            {sessions.length === 0 && (
                <p className="text-center text-gray-500 mt-8">No active sessions found.</p>
            )}
        </div>
    );
};

