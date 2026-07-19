import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import GlossaryTerm from './GlossaryTerm';

describe('GlossaryTerm', () => {
  it('opens on hover, supports pinning, and closes with Escape', async () => {
    render(<GlossaryTerm term="productivity">Năng suất</GlossaryTerm>);
    const trigger = screen.getByRole('button', { name: /Năng suất/ });
    expect(trigger).not.toHaveClass('game-cursor-target');

    fireEvent.mouseEnter(trigger);
    expect(await screen.findByRole('tooltip', { name: 'Giải thích: Năng suất' })).toBeVisible();
    fireEvent.mouseLeave(trigger);
    await waitFor(() => {
      expect(screen.queryByRole('tooltip', { name: 'Giải thích: Năng suất' })).not.toBeInTheDocument();
    });

    fireEvent.click(trigger);
    expect(await screen.findByRole('dialog', { name: 'Giải thích: Năng suất' })).toBeVisible();
    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Giải thích: Năng suất' })).not.toBeInTheDocument();
    });
  });
});

