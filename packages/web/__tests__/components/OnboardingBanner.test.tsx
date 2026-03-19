import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

import { OnboardingBanner } from '@/components/OnboardingBanner';
import { useAccount } from 'wagmi';

const mockedUseAccount = vi.mocked(useAccount);

describe('OnboardingBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockedUseAccount.mockReturnValue({
      address: '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931',
    } as ReturnType<typeof useAccount>);
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: async () => ({
          onboarding: {
            address: '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931',
            isNewMember: true,
            totalSteps: 3,
            currentStep: {
              id: 'step-1',
              index: 1,
              title: 'Stake confirmed',
              actionItem: 'Introduce yourself',
              nextMilestoneLabel: 'Probation review',
              message: {
                preview: 'Complete your first check-in and meet the lodge.',
              },
            },
            nextStep: {
              index: 2,
              title: 'Probation review',
              etaDays: 2,
            },
            nextAction: 'Complete your first health check-in.',
          },
        }),
      })
    );
  });

  it('loads and renders onboarding state for a new member', async () => {
    render(<OnboardingBanner />);

    await waitFor(() => {
      expect(screen.getByText(/new member onboarding/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('heading', { name: /stake confirmed/i })).toBeInTheDocument();
    expect(screen.getByText(/complete your first health check-in/i)).toBeInTheDocument();
    expect(screen.getByText(/probation review in 2 days/i)).toBeInTheDocument();
  });

  it('persists dismissal for the active address', async () => {
    render(<OnboardingBanner />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }));

    expect(localStorage.getItem('sss-onboarding-banner-dismissed')).toBe(
      '0xf053a15c36f1fbcc2a281095e6f1507ea1efc931'
    );
    expect(screen.queryByText(/new member onboarding/i)).not.toBeInTheDocument();
  });
});
