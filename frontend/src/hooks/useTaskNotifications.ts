import { useMemo } from 'react';
import useWebSocket from 'react-use-websocket';
import type { NotificationResponse } from '../api/fastAPI.schemas';
import { useQueryClient } from '@tanstack/react-query';

export function useTaskNotifications(userId: string | null) {
    const queryClient = useQueryClient();

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
    if (lastMessage?.data) {
        notification = JSON.parse(lastMessage.data) as NotificationResponse;
        queryClient.invalidateQueries({ queryKey: ['notificationsCount'] })
    }

    return { notification };
}
