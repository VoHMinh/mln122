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

  it('keeps a transient tooltip open while the pointer moves into it', async () => {
    render(
      <GlossaryTerm term="infrastructure" preferredPlacement="top">
        Hạ tầng số &amp; công nghiệp
      </GlossaryTerm>,
    );

    const trigger = screen.getByRole('button', { name: /Hạ tầng số/ });
    fireEvent.mouseEnter(trigger);
    const tooltip = await screen.findByRole('tooltip', {
      name: 'Giải thích: Hạ tầng số & công nghiệp',
    });
    await waitFor(() => expect(tooltip).toHaveClass('is-top'));

    fireEvent.mouseLeave(trigger);
    fireEvent.mouseEnter(tooltip);
    await new Promise((resolve) => window.setTimeout(resolve, 180));
    expect(tooltip).toBeVisible();

    fireEvent.mouseLeave(tooltip);
    await waitFor(() => {
      expect(screen.queryByRole('tooltip', {
        name: 'Giải thích: Hạ tầng số & công nghiệp',
      })).not.toBeInTheDocument();
    });
  });
});
