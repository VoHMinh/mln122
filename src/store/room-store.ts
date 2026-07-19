'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getGameGateway } from '@/lib/game-gateway';
import type {
  CreateRoomRequest,
  GatewaySubscription,
  RoomRole,
  RoomSnapshot,
  SessionSnapshot,
} from '@/types';

export type CreateRoomInput = CreateRoomRequest & {
  nickname: string;
  groupName: string;
};

export type JoinRoomInput = {
  roomCode: string;
  nickname: string;
  groupName: string;
};

type RoomState = {
  role: RoomRole | null;
  room: RoomSnapshot | null;
  hostToken: string | null;
  playerToken: string | null;
  sessionId: string | null;
  sessionSnapshot: SessionSnapshot | null;
  profileToken: string | null;
  isLoading: boolean;
  error: string | null;
  createRoom: (input: CreateRoomInput) => Promise<boolean>;
  joinRoom: (input: JoinRoomInput) => Promise<boolean>;
  markReady: () => Promise<void>;
  startRoom: (force?: boolean) => Promise<void>;
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
  profileToken: null,
  isLoading: false,
  error: null,
};

function message(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function createProfileToken() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${crypto.randomUUID()}-${crypto.randomUUID()}`;
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export const useRoomStore = create<RoomState>()(
  persist(
    (set, get) => ({
      ...initialRoomState,

      createRoom: async (input) => {
        if (!input.nickname.trim() || !input.roomName.trim()) {
          set({ error: 'Tên phòng và tên hiển thị là bắt buộc.' });
          return false;
        }
        set({ isLoading: true, error: null });
        try {
          const gateway = getGameGateway();
          const profileToken = get().profileToken ?? createProfileToken();
          const created = await gateway.createRoom({
            roomName: input.roomName.trim(),
            groupNames: input.groupNames,
            durationSeconds: input.durationSeconds ?? 600,
          });
          const joined = await gateway.joinRoom({
            roomCode: created.room.roomCode,
            nickname: input.nickname.trim(),
            groupName: input.groupName.trim(),
            profileToken,
          });
          set({
            role: 'HOST',
            room: joined.room,
            hostToken: created.hostToken,
            playerToken: joined.playerToken,
            sessionId: joined.session.sessionId,
            sessionSnapshot: joined.session,
            profileToken,
            isLoading: false,
          });
          return true;
        } catch (error) {
          set({
            error: message(error, 'Không thể tạo phòng. Vui lòng thử lại.'),
            isLoading: false,
          });
          return false;
        }
      },

      joinRoom: async (input) => {
        if (!input.roomCode.trim() || !input.nickname.trim() || !input.groupName.trim()) {
          set({ error: 'Mã phòng, tên hiển thị và nhóm là bắt buộc.' });
          return false;
        }
        set({ isLoading: true, error: null });
        try {
          const profileToken = get().profileToken ?? createProfileToken();
          const joined = await getGameGateway().joinRoom({
            roomCode: input.roomCode,
            nickname: input.nickname.trim(),
            groupName: input.groupName.trim(),
            profileToken,
          });
          set({
            role: 'PLAYER',
            room: joined.room,
            hostToken: null,
            playerToken: joined.playerToken,
            sessionId: joined.session.sessionId,
            sessionSnapshot: joined.session,
            profileToken,
            isLoading: false,
          });
          return true;
        } catch (error) {
          set({
            error: message(error, 'Không thể vào phòng. Vui lòng kiểm tra lại mã.'),
            isLoading: false,
          });
          return false;
        }
      },

      markReady: async () => {
        const { sessionId, playerToken } = get();
        if (!sessionId || !playerToken) return;
        set({ isLoading: true, error: null });
        try {
          const room = await getGameGateway().markReady(sessionId, playerToken);
          const sessionSnapshot = await getGameGateway().getSession(sessionId, playerToken);
          set({ room, sessionSnapshot, isLoading: false });
        } catch (error) {
          set({
            error: message(error, 'Không thể cập nhật trạng thái sẵn sàng.'),
            isLoading: false,
          });
        }
      },

      startRoom: async (force = false) => {
        const { room, hostToken } = get();
        if (!room || !hostToken) return;
        set({ isLoading: true, error: null });
        try {
          const snapshot = await getGameGateway().startRoom(room.roomId, hostToken, force);
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
      leaveRoom: () => set((state) => ({
        ...initialRoomState,
        profileToken: state.profileToken,
      })),
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
        profileToken: state.profileToken,
      }),
    },
  ),
);
