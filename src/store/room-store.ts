'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getGameGateway } from '@/lib/game-gateway';
import type {
  GatewaySubscription,
  RoomRole,
  RoomSnapshot,
  SessionSnapshot,
} from '@/types';

type RoomState = {
  role: RoomRole | null;
  room: RoomSnapshot | null;
  hostToken: string | null;
  playerToken: string | null;
  sessionId: string | null;
  sessionSnapshot: SessionSnapshot | null;
  isLoading: boolean;
  error: string | null;
  createRoom: (nickname: string, className: string) => Promise<void>;
  joinRoom: (roomCode: string, nickname: string, className: string) => Promise<void>;
  startRoom: () => Promise<void>;
  endRoom: () => Promise<void>;
  syncRoom: () => Promise<void>;
  syncSession: () => Promise<SessionSnapshot | null>;
  applyRoomSnapshot: (room: RoomSnapshot) => void;
  subscribe: () => GatewaySubscription | null;
  clearError: () => void;
  leaveRoom: () => void;
};

const initialRoomState = {
  role: null,
  room: null,
  hostToken: null,
  playerToken: null,
  sessionId: null,
  sessionSnapshot: null,
  isLoading: false,
  error: null,
};

function message(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export const useRoomStore = create<RoomState>()(
  persist(
    (set, get) => ({
      ...initialRoomState,

      createRoom: async (nickname, className) => {
        if (!nickname.trim()) {
          set({ error: 'Hãy nhập tên hiển thị trước khi tạo phòng.' });
          return;
        }
        set({ isLoading: true, error: null });
        try {
          const gateway = getGameGateway();
          const created = await gateway.createRoom(nickname.trim(), 600);
          const joined = await gateway.joinRoom(
            created.room.roomCode,
            nickname.trim(),
            className.trim(),
          );
          set({
            role: 'HOST',
            room: joined.room,
            hostToken: created.hostToken,
            playerToken: joined.playerToken,
            sessionId: joined.session.sessionId,
            sessionSnapshot: joined.session,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: message(error, 'Không thể tạo phòng. Vui lòng thử lại.'),
            isLoading: false,
          });
        }
      },

      joinRoom: async (roomCode, nickname, className) => {
        if (!roomCode.trim() || !nickname.trim()) {
          set({ error: 'Mã phòng và tên hiển thị là bắt buộc.' });
          return;
        }
        set({ isLoading: true, error: null });
        try {
          const joined = await getGameGateway().joinRoom(
            roomCode,
            nickname.trim(),
            className.trim(),
          );
          set({
            role: 'PLAYER',
            room: joined.room,
            hostToken: null,
            playerToken: joined.playerToken,
            sessionId: joined.session.sessionId,
            sessionSnapshot: joined.session,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: message(error, 'Không thể vào phòng. Vui lòng kiểm tra lại mã.'),
            isLoading: false,
          });
        }
      },

      startRoom: async () => {
        const { room, hostToken } = get();
        if (!room || !hostToken) return;
        set({ isLoading: true, error: null });
        try {
          const snapshot = await getGameGateway().startRoom(room.roomId, hostToken);
          set({ room: snapshot, isLoading: false });
        } catch (error) {
          set({
            error: message(error, 'Không thể bắt đầu phòng.'),
            isLoading: false,
          });
        }
      },

      endRoom: async () => {
        const { room, hostToken } = get();
        if (!room || !hostToken) return;
        set({ isLoading: true, error: null });
        try {
          const snapshot = await getGameGateway().endRoom(room.roomId, hostToken);
          set({ room: snapshot, isLoading: false });
        } catch (error) {
          set({
            error: message(error, 'Không thể kết thúc phòng.'),
            isLoading: false,
          });
        }
      },

      syncRoom: async () => {
        const { room, playerToken, hostToken } = get();
        if (!room) return;
        try {
          const snapshot = await getGameGateway().getRoom(
            room.roomId,
            playerToken ?? hostToken ?? undefined,
          );
          set({ room: snapshot });
        } catch (error) {
          set({ error: message(error, 'Không thể đồng bộ trạng thái phòng.') });
        }
      },

      syncSession: async () => {
        const { sessionId, playerToken } = get();
        if (!sessionId || !playerToken) return null;
        try {
          const snapshot = await getGameGateway().getSession(sessionId, playerToken);
          set({ sessionSnapshot: snapshot });
          return snapshot;
        } catch (error) {
          set({ error: message(error, 'Không thể khôi phục phiên người chơi.') });
          return null;
        }
      },

      applyRoomSnapshot: (room) => set({ room }),

      subscribe: () => {
        const { room, playerToken, hostToken } = get();
        if (!room) return null;
        return getGameGateway().subscribeRoom(
          room.roomId,
          playerToken ?? hostToken ?? '',
          (snapshot) => set({ room: snapshot }),
          (error) => set({ error: error.message }),
        );
      },

      clearError: () => set({ error: null }),
      leaveRoom: () => set({ ...initialRoomState }),
    }),
    {
      name: 'mln2030-room-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        role: state.role,
        room: state.room,
        hostToken: state.hostToken,
        playerToken: state.playerToken,
        sessionId: state.sessionId,
        sessionSnapshot: state.sessionSnapshot,
      }),
    },
  ),
);

