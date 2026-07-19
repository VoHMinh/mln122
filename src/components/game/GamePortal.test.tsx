import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import GamePortal, { type PortalAccessRequest } from './GamePortal';
import { useRoomStore } from '@/store/room-store';

describe('GamePortal onboarding boundary', () => {
  beforeEach(() => {
    localStorage.clear();
    useRoomStore.getState().leaveRoom();
  });

  it('validates input and emits a pending create request without creating a room', async () => {
    const onBeginOnboarding = vi.fn(async (_request: PortalAccessRequest) => {
      void _request;
    });
    render(
      <GamePortal
        onOpenBriefing={vi.fn()}
        onBeginOnboarding={onBeginOnboarding}
      />,
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Tạo phòng và xem hướng dẫn' })).toBeEnabled();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Tạo phòng và xem hướng dẫn' }));
    expect(screen.getByText('Hãy nhập tên hiển thị trước khi tiếp tục.')).toBeVisible();
    expect(onBeginOnboarding).not.toHaveBeenCalled();
    expect(useRoomStore.getState().room).toBeNull();

    fireEvent.change(screen.getByLabelText('Tên phòng'), {
      target: { value: ' Ca sáng ' },
    });
    fireEvent.change(screen.getByLabelText('Tên hiển thị'), {
      target: { value: '  Minh  ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Tạo phòng và xem hướng dẫn' }));

    await waitFor(() => expect(onBeginOnboarding).toHaveBeenCalledOnce());
    expect(onBeginOnboarding).toHaveBeenCalledWith({
      mode: 'CREATE',
      roomName: 'Ca sáng',
      groupNames: ['Nhóm 1', 'Nhóm 2', 'Nhóm 3', 'Nhóm 4', 'Nhóm 5', 'Nhóm 6'],
      nickname: 'Minh',
      groupName: 'Nhóm 1',
    });
    expect(useRoomStore.getState().room).toBeNull();
  });

  it('requires a six-character room code before starting the tour', async () => {
    const onBeginOnboarding = vi.fn(async (_request: PortalAccessRequest) => {
      void _request;
    });
    render(
      <GamePortal
        onOpenBriefing={vi.fn()}
        onBeginOnboarding={onBeginOnboarding}
      />,
    );
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Tạo phòng và xem hướng dẫn' })).toBeEnabled();
    });

    const joinButtons = screen.getAllByRole('button', { name: 'Vào phòng' });
    fireEvent.click(joinButtons[joinButtons.length - 1]);
    fireEvent.change(screen.getByLabelText('Mã phòng'), {
      target: { value: 'abc' },
    });
    fireEvent.change(screen.getByLabelText('Tên hiển thị'), {
      target: { value: 'Lan' },
    });
    expect(screen.getByRole('button', { name: 'Vào phòng và xem hướng dẫn' })).toBeDisabled();
    expect(screen.getByText('Danh sách nhóm sẽ hiện ngay khi mã phòng hợp lệ.')).toBeVisible();
    expect(onBeginOnboarding).not.toHaveBeenCalled();
  });
});
