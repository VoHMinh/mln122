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
    const onBeginOnboarding = vi.fn<(request: PortalAccessRequest) => void>();
    render(
      <GamePortal
        onOpenBriefing={vi.fn()}
        onBeginOnboarding={onBeginOnboarding}
      />,
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Tạo phòng và tham gia' })).toBeEnabled();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Tạo phòng và tham gia' }));
    expect(screen.getByText('Hãy nhập tên hiển thị trước khi tiếp tục.')).toBeVisible();
    expect(onBeginOnboarding).not.toHaveBeenCalled();
    expect(useRoomStore.getState().room).toBeNull();

    fireEvent.change(screen.getByLabelText('Tên hiển thị'), {
      target: { value: '  Minh  ' },
    });
    fireEvent.change(screen.getByLabelText('Lớp / nhóm (tùy chọn)'), {
      target: { value: ' SE18A01 ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Tạo phòng và tham gia' }));

    expect(onBeginOnboarding).toHaveBeenCalledOnce();
    expect(onBeginOnboarding).toHaveBeenCalledWith({
      mode: 'CREATE',
      nickname: 'Minh',
      className: 'SE18A01',
      code: '',
    });
    expect(useRoomStore.getState().room).toBeNull();
  });

  it('requires a six-character room code before starting the tour', async () => {
    const onBeginOnboarding = vi.fn<(request: PortalAccessRequest) => void>();
    render(
      <GamePortal
        onOpenBriefing={vi.fn()}
        onBeginOnboarding={onBeginOnboarding}
      />,
    );
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Tạo phòng và tham gia' })).toBeEnabled();
    });

    const joinButtons = screen.getAllByRole('button', { name: 'Vào phòng' });
    fireEvent.click(joinButtons[joinButtons.length - 1]);
    fireEvent.change(screen.getByLabelText('Mã phòng'), {
      target: { value: 'abc' },
    });
    fireEvent.change(screen.getByLabelText('Tên hiển thị'), {
      target: { value: 'Lan' },
    });
    const activeJoinButtons = screen.getAllByRole('button', { name: 'Vào phòng' });
    fireEvent.click(activeJoinButtons[activeJoinButtons.length - 1]);

    expect(screen.getByText('Mã phòng phải gồm đúng 6 ký tự.')).toBeVisible();
    expect(onBeginOnboarding).not.toHaveBeenCalled();
  });
});
