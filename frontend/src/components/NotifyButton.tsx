import { useEffect, useState } from 'react';
import { useToast } from '../hooks/useToast';
import { notificationState, requestNotificationPermission } from '../lib/notifications';

interface NotifyButtonProps {
  campaignName: string;
}

/**
 * Opt-in "notify me when milestones release" bell. Browser notifications
 * only — no email infra required.
 */
export function NotifyButton({ campaignName }: NotifyButtonProps) {
  const { push } = useToast();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(notificationState() === 'granted');
  }, []);

  const enable = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setEnabled(true);
      push('success', `You'll get notified about ${campaignName} milestones`);
    } else {
      push('error', 'Notifications are blocked by the browser');
    }
  };

  if (enabled) {
    return (
      <button type="button" className="button button--ghost button--small" disabled>
        🔔 Notifications on
      </button>
    );
  }

  return (
    <button
      type="button"
      className="button button--ghost button--small"
      onClick={() => void enable()}
      data-testid="notify-button"
    >
      🔔 Notify me about milestones
    </button>
  );
}
