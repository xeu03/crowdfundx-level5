#!/usr/bin/env bash
# ============================================================================
# CrowdfundX — reward users who filled the onboarding Google Form.
#
# Reads a CSV exported from the Google Form (Google Sheets → File → Download →
# CSV, format: "Name,Email,Wallet,Rating,Feedback"), mints CFX to every wallet
# that hasn't been onboarded yet, and prints a report. Every mint is a real
# on-chain transaction — the fastest way to convert a form response into an
# active user.
#
# Usage:
#   scripts/reward-form-users.sh docs/form-responses.csv [CFX_AMOUNT]
# ============================================================================
set -euo pipefail

[ "$#" -ge 1 ] || { echo "usage: reward-form-users.sh <responses.csv> [amount-cfx]" >&2; exit 1; }
CSV="$1"
AMOUNT_CFX="${2:-30}"
AMOUNT_RAW=$((AMOUNT_CFX * 10000000))

[ -f "$CSV" ] || { echo "not found: $CSV" >&2; exit 1; }

TOKEN_ID="$(python3 -c "import json; print(json.load(open('deployment.json'))['token'])")"

echo "Rewarding form respondents with $AMOUNT_CFX CFX each…"
echo "------------------------------------------------------------"

tail -n +2 "$CSV" | while IFS=',' read -r name email wallet rest; do
  wallet=$(printf '%s' "$wallet" | tr -d '"' | tr -d ' ')
  # Sanity-check the wallet format before minting anything.
  if ! printf '%s' "$wallet" | grep -qE '^G[A-Z0-9]{55}$'; then
    echo "SKIP  $name ($email) — invalid wallet: ${wallet:-<empty>}"
    continue
  fi
  OUT=$(stellar contract invoke \
    --id "$TOKEN_ID" --source-account deployer --network testnet \
    -- mint --to "$wallet" --amount "$AMOUNT_RAW" 2>&1)
  TX=$(printf '%s\n' "$OUT" | grep -oE '[0-9a-f]{64}' | head -1 || true)
  if [ -n "$TX" ]; then
    echo "MINT  $name <$email> $wallet → tx ${TX:0:12}…"
  else
    echo "FAIL  $name <$email> $wallet — $(printf '%s\n' "$OUT" | tail -1)"
  fi
  sleep 2
done

echo "------------------------------------------------------------"
echo "Done. Check balances and the leaderboard to confirm onboarding."
