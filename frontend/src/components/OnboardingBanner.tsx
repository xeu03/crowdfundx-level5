import { useEffect, useState } from 'react';
import { fetchTokenBalance } from '../lib/contracts';
import { formatCFX } from '../lib/format';

const DISMISSED_KEY = 'cfx-onboarding-dismissed';

interface OnboardingBannerProps {
  walletAddress: string | null;
  onGetCfx: () => void;
}

/**
 * Three-step onboarding checklist for connected users with no activity yet.
 * Dismissible; each step checks itself off automatically where possible.
 */
export function OnboardingBanner({ walletAddress, onGetCfx }: OnboardingBannerProps) {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(DISMISSED_KEY) === '1',
  );
  const [balance, setBalance] = useState<bigint | null>(null);

  useEffect(() => {
    if (!walletAddress) {
      setBalance(null);
      return;
    }
    let cancelled = false;
    fetchTokenBalance(walletAddress)
      .then((b) => {
        if (!cancelled) setBalance(b);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [walletAddress]);

  if (dismissed || !walletAddress) return null;

  const steps = [
    { label: 'Connect your wallet', done: true },
    { label: `Get test CFX${balance !== null ? ` (balance: ${formatCFX(balance)} CFX)` : ''}`, done: (balance ?? 0n) > 0n },
    { label: 'Back your first campaign', done: false },
  ];

  return (
    <div className="card onboarding-banner" data-testid="onboarding-banner">
      <div className="onboarding-banner__header">
        <h3>👋 Welcome to CrowdfundX — 3 steps to your first contribution</h3>
        <button
          type="button"
          className="button button--ghost button--small"
          onClick={() => {
            localStorage.setItem(DISMISSED_KEY, '1');
            setDismissed(true);
          }}
          aria-label="Dismiss onboarding checklist"
        >
          ✕
        </button>
      </div>
      <ol className="onboarding-steps">
        {steps.map((step) => (
          <li key={step.label} className={step.done ? 'onboarding-step--done' : ''}>
            <span className="onboarding-step__check">{step.done ? '✓' : '○'}</span>
            {step.label}
            {step.label.startsWith('Get test CFX') && !step.done && (
              <button type="button" className="link-button" onClick={onGetCfx}>
                (how?)
              </button>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
