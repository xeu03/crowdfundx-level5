import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OnboardingBanner } from './OnboardingBanner';
import * as contracts from '../lib/contracts';

vi.mock('../lib/contracts', () => ({
  fetchTokenBalance: vi.fn(),
}));

const ADDRESS = 'GBOKCW7UCWXFKOZFK2OQKE3NFRFID5BYWZZIKBGH257SZK2GT4HOFWFB';

describe('OnboardingBanner', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.mocked(contracts.fetchTokenBalance).mockReset().mockResolvedValue(0n);
  });

  it('hides for users without a connected wallet', () => {
    render(<OnboardingBanner walletAddress={null} onGetCfx={() => {}} />);
    expect(screen.queryByTestId('onboarding-banner')).not.toBeInTheDocument();
  });

  it('shows the three-step checklist and checks funded steps', async () => {
    vi.mocked(contracts.fetchTokenBalance).mockResolvedValue(50_000_000n);
    render(<OnboardingBanner walletAddress={ADDRESS} onGetCfx={() => {}} />);
    expect(screen.getByText(/Connect your wallet/)).toBeInTheDocument();
    expect(await screen.findByText(/Get test CFX \(balance: 5 CFX\)/)).toBeInTheDocument();
    expect(screen.getByText(/Back your first campaign/)).toBeInTheDocument();
  });

  it('can be dismissed permanently', async () => {
    const user = userEvent.setup();
    render(<OnboardingBanner walletAddress={ADDRESS} onGetCfx={() => {}} />);
    await user.click(screen.getByLabelText('Dismiss onboarding checklist'));
    expect(screen.queryByTestId('onboarding-banner')).not.toBeInTheDocument();
    expect(localStorage.getItem('cfx-onboarding-dismissed')).toBe('1');
  });
});
