import { useMemo } from 'react';
import useWebSocket from 'react-use-websocket';
import type { NotificationResponse } from '../api/fastAPI.schemas';

export function useTaskNotifications(userId: string | null) {
    const socketUrl = useMemo(() => {
        if (!userId) return null;
        const wsProto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        return `${wsProto}//${import.meta.env.VITE_API_URL}/ws/${userId}`;
    }, [userId]);

    const { lastMessage } = useWebSocket(socketUrl, {
        retryOnError: true,
        reconnectInterval: 3000,
    });

    let notification: NotificationResponse | null = null;
    console.log(notification)
    if (lastMessage?.data) {
        notification = JSON.parse(lastMessage.data) as NotificationResponse;
    }

    return { notification };
}
