import { useEffect, useRef, useState, useCallback } from 'react';
// Note: You may need to install socket.io-client with: npm install socket.io-client
import { io, Socket } from 'socket.io-client';

interface UseSocketProps {
  url: string;
  autoConnect?: boolean;
}

export const useSocket = ({ url, autoConnect = true }: UseSocketProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    try {
      socketRef.current = io(url, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect,
      });

      socketRef.current.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
        setError(null);
      });

      socketRef.current.on('connect_error', (err: Error) => {
        console.error('Socket connection error:', err);
        setError(err);
      });

      socketRef.current.on('disconnect', (reason: string) => {
        console.log('Socket disconnected:', reason);
        setIsConnected(false);
      });
    } catch (err) {
      console.error('Socket initialization error:', err);
      setError(err instanceof Error ? err : new Error('Failed to initialize socket connection'));
    }
  }, [url, autoConnect]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  // Join a conversation room
  const joinConversation = useCallback((conversationId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('join', conversationId);
    }
  }, [isConnected]);

  // Send a message
  const sendMessage = useCallback((message: { conversationId: string; text: string }) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('sendMessage', message);
      return true;
    }
    return false;
  }, [isConnected]);

  // Send typing indicator
  const sendTyping = useCallback((data: { conversationId: string; userId: string; isTyping: boolean }) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('typing', data);
      return true;
    }
    return false;
  }, [isConnected]);

  // Clean up socket connection on unmount
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [connect, disconnect, autoConnect]);

  return {
    socket: socketRef.current,
    isConnected,
    error,
    connect,
    disconnect,
    joinConversation,
    sendMessage,
    sendTyping,
  };
};