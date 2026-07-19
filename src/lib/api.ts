import type {
  SessionResponse,
  RoundRequest,
  RoundResponse,
  CompleteResponse,
  LeaderboardResponse,
  ReferenceTrajectories,
} from '@/types';
import * as mockApi from '@/lib/mock-api';

// ============================================================
// Configuration
// ============================================================

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/** Default to mock mode unless explicitly set to 'false' */
const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

const DEFAULT_TIMEOUT_MS = 10_000;

// ============================================================
// Fetch Helpers
// ============================================================

interface FetchOptions extends RequestInit {
  timeoutMs?: number;
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Fetch wrapper with timeout, JSON parsing, and error handling.
 */
async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...fetchInit } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...fetchInit,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...fetchInit.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'Unknown error');
      throw new ApiError(
        response.status,
        `API error ${response.status}: ${errorBody}`
      );
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(408, `Request to ${path} timed out after ${timeoutMs}ms`);
    }

    throw new ApiError(
      0,
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

// ============================================================
// API Functions
// ============================================================

/**
 * Create a new game session.
 */
export async function createSession(
  nickname: string,
  className: string
): Promise<SessionResponse> {
  if (USE_MOCK) {
    return mockApi.createSession(nickname, className);
  }

  return apiFetch<SessionResponse>('/api/sessions', {
    method: 'POST',
    body: JSON.stringify({ nickname, className }),
  });
}

/**
 * Submit a round's resource allocation.
 */
export async function submitRound(
  sessionId: string,
  roundData: RoundRequest
): Promise<RoundResponse> {
  if (USE_MOCK) {
    return mockApi.submitRound(sessionId, roundData);
  }

  return apiFetch<RoundResponse>(`/api/sessions/${sessionId}/rounds`, {
    method: 'POST',
    body: JSON.stringify(roundData),
  });
}

/**
 * Complete a game session and get final results.
 */
export async function completeSession(
  sessionId: string
): Promise<CompleteResponse> {
  if (USE_MOCK) {
    return mockApi.completeSession(sessionId);
  }

  return apiFetch<CompleteResponse>(`/api/sessions/${sessionId}/complete`, {
    method: 'POST',
  });
}

/**
 * Get the leaderboard.
 */
export async function getLeaderboard(
  limit: number = 20
): Promise<LeaderboardResponse> {
  if (USE_MOCK) {
    return mockApi.getLeaderboard(limit);
  }

  return apiFetch<LeaderboardResponse>(
    `/api/leaderboard?limit=${limit}`
  );
}

/**
 * Get reference trajectories for the comparison chart.
 */
export async function getReferenceTrajectories(): Promise<ReferenceTrajectories> {
  if (USE_MOCK) {
    return mockApi.getReferenceTrajectories();
  }

  return apiFetch<ReferenceTrajectories>('/api/reference-trajectories');
}

// ============================================================
// SSE (Server-Sent Events) – Leaderboard Subscription
// ============================================================

export interface LeaderboardSubscription {
  close: () => void;
}

/**
 * Subscribe to real-time leaderboard updates via SSE.
 *
 * @param onUpdate - Called whenever a new leaderboard update arrives
 * @param onError  - Called on connection errors
 * @returns Subscription handle with a close() method
 */
export function subscribeToLeaderboard(
  onUpdate: (data: LeaderboardResponse) => void,
  onError?: (error: Event | Error) => void
): LeaderboardSubscription {
  if (USE_MOCK) {
    return mockApi.subscribeToLeaderboard(onUpdate, onError);
  }

  const eventSource = new EventSource(
    `${API_BASE}/api/leaderboard/stream`
  );

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data) as LeaderboardResponse;
      onUpdate(data);
    } catch {
      onError?.(new Error('Failed to parse leaderboard SSE data'));
    }
  };

  eventSource.onerror = (event) => {
    onError?.(event);
  };

  return {
    close: () => eventSource.close(),
  };
}
