import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ActivityFeed from '@/components/ActivityFeed';

describe('ActivityFeed', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('renders the live activity shell and initial queued items', () => {
    render(<ActivityFeed />);

    expect(screen.getByRole('heading', { name: /the lodge is moving in real time/i })).toBeInTheDocument();
    expect(screen.getByText(/feed simulating live chain events/i)).toBeInTheDocument();
    expect(screen.getByText(/Ocean Vael/i)).toBeInTheDocument();
    expect(screen.getByText(/0xf053\.\.\.c931/i)).toBeInTheDocument();
    expect(screen.queryByText(/Clawline AI/i)).not.toBeInTheDocument();
  });

  it('rotates the feed when the interval advances', () => {
    render(<ActivityFeed />);

    act(() => {
      vi.advanceTimersByTime(3800);
    });

    expect(screen.getByText(/Clawline AI/i)).toBeInTheDocument();
    expect(screen.getByText(/earned \+9 reputation/i)).toBeInTheDocument();
  });
});
