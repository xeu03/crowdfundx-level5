import { useToast } from '../hooks/useToast';
import { shortAddress } from '../lib/format';

interface GetCfxModalProps {
  walletAddress: string | null;
  onClose: () => void;
}

/**
 * "Where do I get CFX?" — the answer used to be buried in the docs
 * (user feedback: "Took me a while to find the faucet"). This modal walks a
 * new user through it in three steps.
 */
export function GetCfxModal({ walletAddress, onClose }: GetCfxModalProps) {
  const { push } = useToast();

  const copyAddress = async () => {
    if (!walletAddress) return;
    try {
      await navigator.clipboard.writeText(walletAddress);
      push('success', 'Address copied');
    } catch {
      push('error', 'Could not copy — clipboard unavailable');
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Get test CFX">
      <div className="card modal">
        <h3>Get test CFX</h3>
        <ol className="get-cfx-steps">
          <li>
            <strong>Connect your wallet</strong>
            {walletAddress ? (
              <p className="detail-hint">
                Connected:{' '}
                <button
                  type="button"
                  className="leaderboard-address"
                  onClick={() => void copyAddress()}
                  title="Click to copy"
                >
                  {shortAddress(walletAddress)}
                </button>
              </p>
            ) : (
              <p className="detail-hint">Use the Connect Wallet button in the header.</p>
            )}
          </li>
          <li>
            <strong>Share your address</strong>
            <p className="detail-hint">
              CFX is minted by the platform admin (a demo faucet). Send your
              address to the admin — in the real flow, users would buy CFX
              with fiat through a Stellar anchor.
            </p>
          </li>
          <li>
            <strong>Back a campaign</strong>
            <p className="detail-hint">
              Once the mint arrives (seconds on testnet), your balance shows
              in the header and you can contribute right away.
            </p>
          </li>
        </ol>
        <button type="button" className="button button--primary button--block" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  );
}
