import { useEffect, useRef, useState, useCallback } from 'react';

export function useWebSocket(
    url: string | null
): {
    sendMessage: (message: string) => void;
    lastMessage: MessageEvent | null;
    readyState: number;
} {
    const wsRef = useRef<WebSocket | null>(null);
    const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
    const [readyState, setReadyState] = useState<number>(WebSocket.CLOSED);

    useEffect(() => {
        if (!url) {
            wsRef.current?.close();
            wsRef.current = null;
            setReadyState(WebSocket.CLOSED);
            return;
        }

        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => setReadyState(ws.readyState);
        ws.onmessage = (event) => setLastMessage(event);
        ws.onerror = console.error;
        ws.onclose = () => setReadyState(WebSocket.CLOSED);

        return () => ws.close();
    }, [url]);

    const sendMessage = useCallback((message: string) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(message);
        } else {
            console.warn('WS not open:', wsRef.current?.readyState);
        }
    }, []);

    return { sendMessage, lastMessage, readyState };
}