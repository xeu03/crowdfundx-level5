import { useEffect, useState } from 'react';
import { fetchTokenBalance } from '../lib/contracts';
import { formatCFX, shortAddress } from '../lib/format';
import { useToast } from '../hooks/useToast';
import type { WalletState } from '../hooks/useWallet';

export function WalletButton({ wallet }: { wallet: WalletState }) {
  const { push } = useToast();
  const { address, connecting, error, connect, disconnect } = wallet;
  const [balance, setBalance] = useState<bigint | null>(null);

  useEffect(() => {
    if (!address) {
      setBalance(null);
      return;
    }
    let cancelled = false;
    const load = () =>
      fetchTokenBalance(address)
        .then((b) => {
          if (!cancelled) setBalance(b);
        })
        .catch(() => {});
    void load();
    const timer = setInterval(load, 30_000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [address]);

  if (address) {
    return (
      <div className="wallet-chip">
        <span className="wallet-chip__balance" title="Your CFX balance">
          {balance === null ? '…' : formatCFX(balance)} CFX
        </span>
        <span className="wallet-chip__address" title={address}>
          {shortAddress(address)}
        </span>
        <button
          type="button"
          className="button button--small button--ghost"
          onClick={() => {
            disconnect();
            push('info', 'Wallet disconnected');
          }}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="wallet-connect">
      {error && (
        <button
          type="button"
          className="button button--small button--danger-quiet"
          title={error}
          onClick={() => push('error', error)}
        >
          ⚠
        </button>
      )}
      <button
        type="button"
        className="button button--primary button--small"
        onClick={() => void connect()}
        disabled={connecting}
        data-testid="connect-wallet"
      >
        {connecting ? 'Connecting…' : 'Connect Wallet'}
      </button>
    </div>
  );
}
