import type { AnchorHTMLAttributes, ReactNode } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import NotificationBanner from '@/components/NotificationBanner';
import { MOCK_NOTIFICATIONS } from '@/data/mock-notifications';

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('NotificationBanner', () => {
  it('renders banner content and CTA links', () => {
    render(<NotificationBanner notifications={MOCK_NOTIFICATIONS.slice(0, 2)} />);

    expect(screen.getByRole('heading', { name: /new member welcome/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /meet lobsters/i })).toHaveAttribute('href', '/lobsters');
    expect(screen.getByRole('button', { name: /dismiss new member welcome/i })).toBeInTheDocument();
  });

  it('dismisses notifications individually', () => {
    render(<NotificationBanner notifications={MOCK_NOTIFICATIONS.slice(0, 2)} />);

    fireEvent.click(screen.getByRole('button', { name: /dismiss new member welcome/i }));

    expect(screen.queryByRole('heading', { name: /new member welcome/i })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /corvee task assigned/i })).toBeInTheDocument();
  });
});
