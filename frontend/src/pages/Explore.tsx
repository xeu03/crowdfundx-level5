import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CampaignCard } from '../components/CampaignCard';
import { GetCfxModal } from '../components/GetCfxModal';
import { OnboardingBanner } from '../components/OnboardingBanner';
import { CampaignListSkeleton } from '../components/Skeleton';
import { ErrorState } from '../components/ErrorState';
import { useCampaigns } from '../hooks/useCampaigns';
import { useEventStream } from '../hooks/useEventStream';
import { FACTORY_ADDRESS, isConfigured } from '../config';
import { formatCFX } from '../lib/format';
import type { DecodedEvent } from '../lib/types';

interface ExploreProps {
  walletAddress: string | null;
}

export function Explore({ walletAddress }: ExploreProps) {
  // Bumped by live factory events so the registry + stats stay current.
  const [refreshKey, setRefreshKey] = useState(0);
  const [showGetCfx, setShowGetCfx] = useState(false);
  const { campaigns, stats, loading, error, reload } = useCampaigns(refreshKey);

  // History backfill replays many events at once — debounce the reload so a
  // burst of events triggers a single registry refresh.
  const bumpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onEvent = useCallback((event: DecodedEvent) => {
    if (event.name !== 'campaign_created' && event.name !== 'contribution_tracked') {
      return;
    }
    if (bumpTimer.current) return;
    bumpTimer.current = setTimeout(() => {
      bumpTimer.current = null;
      setRefreshKey((k) => k + 1);
    }, 1_500);
  }, []);

  useEventStream({
    contractIds: isConfigured ? [FACTORY_ADDRESS] : [],
    onEvent,
    enabled: isConfigured,
  });

  if (!isConfigured) {
    return (
      <div className="container">
        <ErrorState
          title="Not connected to a deployment yet"
          message="Run scripts/deploy.sh and set VITE_FACTORY_ADDRESS / VITE_TOKEN_ADDRESS in frontend/.env, or follow the README quickstart."
        />
      </div>
    );
  }

  return (
    <div className="container">
      {showGetCfx && (
        <GetCfxModal walletAddress={walletAddress} onClose={() => setShowGetCfx(false)} />
      )}
      <OnboardingBanner walletAddress={walletAddress} onGetCfx={() => setShowGetCfx(true)} />
      <section className="hero">
        <h1>Fund ideas that matter</h1>
        <p>
          All-or-nothing crowdfunding on Stellar Soroban — milestone payouts,
          instant refunds, and every contribution verifiable on-chain.
        </p>
        <div className="hero__stats">
          <div className="stat-tile" data-testid="stat-campaigns">
            <strong>{stats ? stats.campaignCount : '—'}</strong>
            <span>campaigns</span>
          </div>
          <div className="stat-tile" data-testid="stat-raised">
            <strong>{stats ? formatCFX(stats.totalRaised) : '—'}</strong>
            <span>CFX raised</span>
          </div>
          <div className="stat-tile">
            <strong>100%</strong>
            <span>on-chain</span>
          </div>
        </div>
        <Link to="/create" className="button button--primary button--large">
          Start a campaign
        </Link>
      </section>

      <section className="explore-section" aria-label="Campaigns">
        <div className="explore-section__header">
          <h2>Live campaigns</h2>
          <span className="explore-section__live" aria-hidden="true">
            <span className="live-dot" /> streaming events
          </span>
        </div>

        {loading && campaigns.length === 0 ? (
          <CampaignListSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : campaigns.length === 0 ? (
          <div className="empty-state">
            <p>No campaigns yet — be the first to launch one.</p>
            <Link to="/create" className="button button--primary">
              Create the first campaign
            </Link>
          </div>
        ) : (
          <div className="card-grid">
            {campaigns.map((info) => (
              <CampaignCard key={info.address} info={info} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
