import { io, Socket } from 'socket.io-client';
import type { NftUpdatedSocketEvent, OrderUpdatedSocketEvent } from '../types/contracts';

const seenVersions = new Map<string, number>();

export function connectMarketplaceSocket(handlers: {
  onNftUpdated?: (payload: NftUpdatedSocketEvent) => void;
  onOrderUpdated?: (payload: OrderUpdatedSocketEvent) => void;
  onReconnect?: () => void;
}) {
  const socket: Socket = io(import.meta.env.VITE_SOCKET_URL || window.location.origin, {
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    autoConnect: true
  });

  socket.on('nft.updated', (event: NftUpdatedSocketEvent) => {
    const key = `nft:${event.id}`;
    const last = seenVersions.get(key) ?? 1;
    if (event.version <= last) return;
    seenVersions.set(key, event.version);
    handlers.onNftUpdated?.(event);
  });

  socket.on('order.updated', (event: OrderUpdatedSocketEvent) => {
    const key = `order:${event.id}`;
    const last = seenVersions.get(key) ?? 1;
    if (event.version <= last) return;
    seenVersions.set(key, event.version);
    handlers.onOrderUpdated?.(event);
  });

  socket.on('connect', () => {
    handlers.onReconnect?.();
  });

  return () => {
    socket.removeAllListeners();
    socket.disconnect();
  };
}
