import { useUsdDisplay } from '../hooks/useUsdDisplay';

/** Small header switch: show approximate USD next to CFX amounts. */
export function UsdToggle() {
  const { showUsd, toggleUsd } = useUsdDisplay();
  return (
    <button
      type="button"
      className={`usd-toggle ${showUsd ? 'usd-toggle--on' : ''}`}
      onClick={toggleUsd}
      title="Show approximate USD values next to CFX"
      data-testid="usd-toggle"
    >
      USD
    </button>
  );
}
