# CrowdfundX — Decentralized Crowdfunding on Stellar Soroban

> **Level 5 — Blue Belt Submission** (built on the Level 3/4 base)
> A production-ready, end-to-end Stellar dApp: three Soroban smart contracts with
> inter-contract communication, live event streaming, a React frontend,
> full test suites, CI/CD pipelines — plus 50+ users, feedback-driven iteration,
> on-chain leaderboards, analytics, monitoring and a pitch deck.

<!-- ═══════════════════ Submission checklist ═══════════════════ -->

| Checklist item | Link |
| --- | --- |
| Public GitHub repository | https://github.com/xeu03/crowdfundx-level5 |
| Live deployed application | https://crowdfundx-level5.netlify.app/ |
| Contract deployment address (factory) | [`CB46HW3YW5XVMBQLHOSKTLQ5SQBPDPIUDPG2U6JOCDGMHLBNLI5PHJO7`](https://stellar.expert/explorer/testnet/contract/CB46HW3YW5XVMBQLHOSKTLQ5SQBPDPIUDPG2U6JOCDGMHLBNLI5PHJO7) |
| Transaction hash (contract interaction) | [`99e010fe3dc8f34f1f8da37a48d192afd8c79da64a5206c0e285915c34537ac9`](https://stellar.expert/explorer/testnet/tx/99e010fe3dc8f34f1f8da37a48d192afd8c79da64a5206c0e285915c34537ac9) (contribution hitting the goal) |
| PPT / Pitch deck | [Live deck](https://xeu03.github.io/crowdfundx-level5/pitch-deck.html) (GitHub Pages — arrow keys to present, Ctrl+P to export PDF) |
| Proof of 50+ users | [Leaderboard](https://crowdfundx-level5.netlify.app/#/leaderboard) — **51 wallets** with verified on-chain transactions (56 contribution events) |
| Screenshots of transaction activity | Leaderboard + factory `get_stats` + stellar.expert links (see Screenshots below) |
| User feedback iteration summary | [See below](#user-feedback--what-we-shipped) |

## Google Form onboarding (user details + Excel)

Per the Level 5 onboarding requirements, a Google Form collects structured
details from every user:

1. **Form fields**: `Name` (short answer) · `Email` (email) · `Stellar wallet
   address` (short answer) · `Product rating 1–5` (linear scale) · `Feedback`
   (paragraph, optional)
2. Share the form link with onboarded users after they contribute.
3. **Export**: Form → Responses → Link to Sheets → File → Download → **Microsoft
   Excel (.xlsx)** → save as `docs/user-feedback.xlsx` in this repo.
4. Link the exported sheet here:

> ✅ **[`docs/user-feedback.xlsx`](docs/user-feedback.xlsx)** — 52 responses collected
> (avg rating **4.4/5**, distribution: 24×5★, 23×4★, 5×3★).
> Form link: https://docs.google.com/forms/d/e/1FAIpQLSckIRo2WsZPDaOIsAZmvhVOYfe0nqF-iEBczwoE12F25e5niA/viewform?usp=sharing&ouid=114456630518840323606

## User feedback → what we shipped

Every shipped Level 5 feature traces back to a real feedback item:

| Feedback (from the in-app widget) | What changed | Commit |
| --- | --- | --- |
| “Would love USD amounts shown next to CFX” | USD display toggle (header switch, cards, detail, contribute form) with `VITE_CFX_USD_RATE` | [`93c4cb7`](https://github.com/xeu03/crowdfundx-level5/commit/93c4cb7) |
| “Would be great to get notifications when a milestone is released” | Opt-in browser notifications on `milestone_released` / `goal_reached` | [`20720ab`](https://github.com/xeu03/crowdfundx-level5/commit/20720ab) |
| “Took me a while to find the faucet” | Live CFX balance in the header, “How to get CFX” modal, 3-step onboarding checklist for new users | [`3d803f7`](https://github.com/xeu03/crowdfundx-level5/commit/3d803f7) |
| “I'd like more campaigns to choose from” | 3 new live campaigns (Hackathon Bounty Board, Community Radio, Solar Charging Stations) + 40 more onboarded wallets with real txs | on-chain (testnet) |

## Next phase — improvement plan (from the collected feedback)

1. **Anchor rails (Q4)**: the top request is fiat — USDC-denominated campaigns
   and creator payouts to bank accounts through Stellar anchors
   (SEP-24/SEP-6/SEP-12). Kickoff: [`#issue-anchor-rails`](https://github.com/xeu03/crowdfundx-level5/issues)
2. **Retention loop**: milestone notifications → recurring backers; add email
   digests via the backend once anchors are live.
3. **Onboarding speed**: one-click faucet (rate-limited mint button in-app) so
   new users never leave the app for tokens.
4. **Creator analytics**: campaign dashboards (conversion, contributor
   retention) surfaced from the existing event pipeline.
5. **Mainnet audit**: contract audit + fuzz suite before the 2027 mainnet
   launch (roadmap in the [pitch deck](https://xeu03.github.io/crowdfundx-level5/pitch-deck.html)).

## Screenshots

![CrowdfundX home](docs/screenshots/home.png)

![Campaigns](docs/screenshots/campaigns.png)

![Leaderboard — 51 wallets](docs/screenshots/leaderboard.png)

![Feedback summary](docs/screenshots/feedback.png)

<!-- ════════════════════════════════════════════════════════════════════════════════════ -->