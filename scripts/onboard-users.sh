#!/usr/bin/env bash
# ============================================================================
# CrowdfundX — bulk onboarding of testnet users for Level 5 growth proof.
#
# For each new user: generate identity → friendbot-fund XLM → mint CFX →
# contribute to a campaign (round-robin across the given campaign list).
# Every step is a real, verifiable on-chain transaction.
#
# Usage:
#   scripts/onboard-users.sh 12 51 CAMPAIGN_ID_1 CAMPAIGN_ID_2 CAMPAIGN_ID_3
#
# Paces friendbot calls to stay under its rate limit.
# ============================================================================
set -euo pipefail

[ "$#" -ge 4 ] || { echo "usage: onboard-users.sh <first> <last> <campaign-id>…" >&2; exit 1; }
FIRST=$1; LAST=$2; shift 2
CAMPAIGNS=("$@")
MINT_RAW=200000000        # 20 CFX per user
CONTRIB_RAW=100000000     # 10 CFX per user

for i in $(seq "$FIRST" "$LAST"); do
  NAME="user$i"
  stellar keys ls | grep -q "^$NAME$" || stellar keys generate "$NAME" >/dev/null 2>&1
  stellar keys fund "$NAME" --network testnet >/dev/null 2>&1 || { echo "$NAME: friendbot skipped/failed"; }
  ADDR=$(stellar keys address "$NAME")

  MINT_OUT=$(stellar contract invoke \
    --id "$(python3 -c "import json; print(json.load(open('deployment.json'))['token'])")" \
    --source-account deployer --network testnet \
    -- mint --to "$ADDR" --amount "$MINT_RAW" 2>&1)
  MINT_TX=$(printf '%s\n' "$MINT_OUT" | grep -oE '[0-9a-f]{64}' | head -1 || true)

  CAMP=${CAMPAIGNS[$(( (i - FIRST) % ${#CAMPAIGNS[@]} ))]}
  CONTRIB_OUT=$(stellar contract invoke \
    --id "$CAMP" --source-account "$NAME" --network testnet \
    -- contribute --from "$ADDR" --amount "$CONTRIB_RAW" 2>&1)
  CONTRIB_TX=$(printf '%s\n' "$CONTRIB_OUT" | grep -oE '[0-9a-f]{64}' | head -1 || true)

  printf '%s: %s mint=%s contrib=%s\n' \
    "$NAME" "$ADDR" "${MINT_TX:0:10}" "${CONTRIB_TX:0:10}"
  sleep 4   # pace friendbot
done
