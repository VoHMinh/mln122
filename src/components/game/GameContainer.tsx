'use client';

import { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  CircleAlert,
  LoaderCircle,
  LogOut,
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { GamePhase, type GatewaySubscription } from '@/types';
import { useGameStore } from '@/store/game-store';
import { useRoomStore } from '@/store/room-store';
import { getPolicyStage, POLICY_STAGES } from '@/lib/game-scenarios';
import GameBriefing from './GameBriefing';
import GameIntro from './GameIntro';
import GamePortal from './GamePortal';
import RoomLobby from './RoomLobby';
import RoomTimer from './RoomTimer';
import RoundPlay from './RoundPlay';
import EventCard from './EventCard';
import ShockBrief from './ShockBrief';
import RoundReport from './RoundReport';
import YearCountdown from './YearCountdown';
import PolicyDebrief from './PolicyDebrief';
import GameResult from './GameResult';
import RoomResult from './RoomResult';
import useReducedMotion from '@/hooks/useReducedMotion';

function isInTerm(phase: GamePhase) {
  return [
    GamePhase.INTRO,
    GamePhase.SHOCK,
    GamePhase.PLAYING,
    GamePhase.EVENT,
    GamePhase.ROUND_REPORT,
    GamePhase.COUNTDOWN,
    GamePhase.DEBRIEF,
    GamePhase.RESULT,
  ].includes(phase);
}

export default function GameContainer() {
  const rootRef = useRef<HTMLElement>(null);
  const subscriptionRef = useRef<GatewaySubscription | null>(null);
  const [briefingOpen, setBriefingOpen] = useState(false);
  const {
    phase,
    session,
    pendingResolution,
    error,
    isLoading,
    clearError,
    loadSession,
    handleRoomEnded,
    resetGame,
  } = useGameStore();
  const {
    room,
    sessionSnapshot,
    sessionId,
    error: roomError,
    isLoading: roomLoading,
    syncSession,
    subscribe,
    clearError: clearRoomError,
    leaveRoom,
  } = useRoomStore();
  const reducedMotion = useReducedMotion();
  const roomId = room?.roomId;

  useEffect(() => {
    if (!roomId) return;
    const subscription = subscribe();
    subscriptionRef.current = subscription;
    return () => {
      subscription?.close();
      if (subscriptionRef.current === subscription) subscriptionRef.current = null;
    };
  }, [roomId, subscribe]);

  useEffect(() => {
    if (room && !sessionId) {
      resetGame();
      leaveRoom();
      return;
    }
    if (!room || !sessionId) return;
    if (!session && sessionSnapshot) {
      loadSession(sessionSnapshot, room.status === 'IN_PROGRESS');
      return;
    }
    if (
      room.status === 'IN_PROGRESS' &&
      [GamePhase.PORTAL, GamePhase.LOBBY].includes(phase)
    ) {
      void syncSession().then((snapshot) => {
        if (snapshot) loadSession(snapshot, true);
      });
    }
    if (room.status === 'ENDED') handleRoomEnded();
  }, [
    handleRoomEnded,
    loadSession,
    phase,
    room,
    leaveRoom,
    resetGame,
    session,
    sessionId,
    sessionSnapshot,
    syncSession,
  ]);

  useGSAP(() => {
    if (reducedMotion) return;
    gsap.fromTo(
      '.game2-phase',
      { autoAlpha: 0, y: 16 },
      { autoAlpha: 1, y: 0, duration: 0.46, ease: 'power3.out', overwrite: true },
    );
  }, { scope: rootRef, dependencies: [phase, room?.status, reducedMotion], revertOnUpdate: true });

  const displayRound =
    phase === GamePhase.ROUND_REPORT && pendingResolution
      ? pendingResolution.roundNumber
      : session?.currentRound ?? 1;
  const stage = getPolicyStage(displayRound);
  const displayError = error ?? roomError;
  const showCommandbar = Boolean(room);
  const busy = isLoading || roomLoading;

  const exitRoom = () => {
    subscriptionRef.current?.close();
    subscriptionRef.current = null;
    leaveRoom();
    resetGame();
  };

  let phaseContent;
  if (!room) {
    phaseContent = <GamePortal onOpenBriefing={() => setBriefingOpen(true)} />;
  } else if (room.status === 'WAITING') {
    phaseContent = <RoomLobby />;
  } else if (phase === GamePhase.RESULT && session && session.finalResult) {
    phaseContent = <GameResult />;
  } else if (phase === GamePhase.ROOM_RESULT || room.status === 'ENDED') {
    phaseContent = <RoomResult />;
  } else if (room.status === 'IN_PROGRESS') {
    if (phase === GamePhase.INTRO) phaseContent = <GameIntro />;
    else if (phase === GamePhase.SHOCK) phaseContent = <ShockBrief />;
    else if (phase === GamePhase.PLAYING) phaseContent = <RoundPlay />;
    else if (phase === GamePhase.EVENT) phaseContent = <EventCard />;
    else if (phase === GamePhase.ROUND_REPORT) phaseContent = <RoundReport />;
    else if (phase === GamePhase.COUNTDOWN) phaseContent = <YearCountdown />;
    else if (phase === GamePhase.DEBRIEF) phaseContent = <PolicyDebrief />;
  }

  if (!phaseContent) {
    phaseContent = (
      <section className="game2-recovery" role="status">
        <LoaderCircle className="animate-spin" size={24} />
        <p>Đang khôi phục phiên mô phỏng...</p>
        <button type="button" onClick={exitRoom} className="game-secondary-action">
          Trở về sảnh
        </button>
      </section>
    );
  }

  return (
    <section ref={rootRef} id="game-section" className="game-container mx-auto w-full max-w-[1440px]">
      {showCommandbar && (
        <div className="game2-commandbar">
          <div className="game2-command-title">
            <p className="game-overline">Đường đến 2030</p>
            <strong>
              {isInTerm(phase) ? `${stage.period} · ${stage.title}` : `Phòng ${room?.roomCode}`}
            </strong>
          </div>

          <ol className="game2-stage-rail" aria-label="Tiến trình bốn giai đoạn">
            {POLICY_STAGES.map((item) => {
              const active = isInTerm(phase) && item.round === displayRound;
              const complete =
                (session?.histories.length ?? 0) >= item.round ||
                phase === GamePhase.RESULT;
              return (
                <li key={item.round} className={active ? 'is-active' : complete ? 'is-complete' : ''}>
                  <span>{item.round}</span>
                  <small>{item.period.slice(2)}</small>
                </li>
              );
            })}
          </ol>

          <RoomTimer />
          <button
            type="button"
            onClick={() => setBriefingOpen(true)}
            className="game2-icon-command game-cursor-target"
            aria-label="Mở hướng dẫn"
            title="Mở hướng dẫn"
          >
            <BookOpen size={17} />
          </button>
          <button
            type="button"
            onClick={exitRoom}
            className="game2-icon-command game-cursor-target"
            aria-label="Rời phòng"
            title="Rời phòng"
          >
            <LogOut size={17} />
          </button>
        </div>
      )}

      <div className={`game2-shell ${!room ? 'is-portal' : ''}`}>
        <div className="game-shell-grid" aria-hidden="true" />

        {displayError && (
          <div className="game2-error">
            <CircleAlert size={17} />
            <p>{displayError}</p>
            <button
              type="button"
              onClick={() => {
                clearError();
                clearRoomError();
              }}
            >
              Đóng
            </button>
          </div>
        )}

        <div key={`${room?.status ?? 'NONE'}-${phase}`} className="game2-phase">
          {phaseContent}
        </div>

        {busy && (
          <div className="game2-loading">
            <LoaderCircle className="animate-spin" size={28} />
            <span>Đang đồng bộ mô phỏng</span>
          </div>
        )}
      </div>

      <GameBriefing isOpen={briefingOpen} onClose={() => setBriefingOpen(false)} />
    </section>
  );
}
