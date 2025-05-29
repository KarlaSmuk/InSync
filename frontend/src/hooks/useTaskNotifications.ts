import { useMemo } from 'react';
import type { NotificationResponse } from '../api/fastAPI.schemas';
import { useWebSocket } from './useWebSocket';

export function useTaskNotifications(userId: string | null) {

    const socketUrl = useMemo(() => {
        if (!userId) return null;
        const wsProto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        return `${wsProto}//${import.meta.env.VITE_API_URL}/ws/${userId}`;
    }, [userId]);

    const { lastMessage } = useWebSocket(socketUrl)

    let notification: NotificationResponse | null = null;
    if (lastMessage?.data) {
        notification = JSON.parse(lastMessage.data) as NotificationResponse;
    }

    return { notification };
}
