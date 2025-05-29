import { useEffect, useRef, useState } from 'react';

export function useWebSocket(url: string | null): { lastMessage: MessageEvent | null; } {
    const wsRef = useRef<WebSocket | null>(null);
    const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);

    useEffect(() => {
        if (!url) {
            wsRef.current?.close();
            wsRef.current = null;
            return;
        }

        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => console.log('socket open');
        ws.onmessage = (event) => setLastMessage(event);
        ws.onerror = console.error;
        ws.onclose = () => console.log('socket closed');

        return () => ws.close();
    }, [url]);

    return { lastMessage };
}