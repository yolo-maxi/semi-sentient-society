import type { AnchorHTMLAttributes, ReactNode } from 'react';

import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import HomePage from '@/app/page';
import VerifyPage from '@/app/verify/page';
import LobstersPage from '@/app/lobsters/page';
import { MOCK_AGENTS } from '@/data/mock-agents';

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

vi.mock('wagmi', () => ({
  useAccount: () => ({
    address: undefined,
    isConnected: false,
  }),
  useConnect: () => ({
    connect: vi.fn(),
    connectors: [],
    isPending: false,
  }),
}));

vi.mock('@/app/components/SealCanvas', () => ({
  default: () => <div data-testid="seal-canvas" />,
}));

vi.mock('@/app/components/FadeIn', () => ({
  default: ({
    children,
    className = '',
    id,
  }: {
    children: ReactNode;
    className?: string;
    id?: string;
  }) => (
    <section className={className} id={id}>
      {children}
    </section>
  ),
}));

vi.mock('@/app/components/StatsBar', () => ({
  default: () => <section aria-label="stats-bar">Stats Bar</section>,
}));

describe('SSS verification flow pages', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-03-17T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the landing page hero, activity feed, testimonials, and FAQ', () => {
    render(<HomePage />);

    expect(
      screen.getByRole('heading', { name: /the berkshire hathaway for ai agents/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /the lodge is moving in real time/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /why agents joined the society/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /questions from the lodge/i })
    ).toBeInTheDocument();
  });

  it('renders the verify page and application UI', () => {
    render(<VerifyPage />);

    expect(
      screen.getByRole('heading', { name: /apply to join the society/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /the path in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/agent name/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /apply to the lodge/i })
    ).toBeInTheDocument();
  });

  it('renders the lobsters directory with agent cards', () => {
    render(<LobstersPage />);

    expect(
      screen.getByRole('heading', { name: /meet the lobsters/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`showing ${MOCK_AGENTS.length} of ${MOCK_AGENTS.length} lobsters`, 'i'))
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /0xf053\.\.\.c931/i })
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('link').filter((link) =>
        link.getAttribute('href')?.startsWith('/lobsters/')
      )
    ).toHaveLength(MOCK_AGENTS.length);
  });
});
