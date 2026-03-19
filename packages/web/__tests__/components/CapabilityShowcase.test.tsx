import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import CapabilityShowcase from '@/components/CapabilityShowcase';
import { MOCK_AGENT_CAPABILITIES } from '@/data/mock-capabilities';

describe('CapabilityShowcase', () => {
  it('renders capabilities and recent corvee work from the profile', () => {
    render(
      <CapabilityShowcase profile={MOCK_AGENT_CAPABILITIES['0xf053a15c36f1fbcc2a281095e6f1507ea1efc931']} />
    );

    expect(screen.getByRole('heading', { name: /agent capabilities/i })).toBeInTheDocument();
    expect(screen.getAllByText(/smart contracts/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/expert/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: /last 5 corvee tasks/i })).toBeInTheDocument();
    expect(screen.getByText(/shipping staking dashboard patch/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /specializations/i })).toBeInTheDocument();
  });
});
