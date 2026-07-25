# sports-calendar-v3

Static single-page sports calendar (`index.html` + `favicon.jpg`), auto-deployed to Vercel from this repo's `main` branch.

## Never add a client-side login/password gate

A full-page password modal (`<input type="password">` styled as a login screen) was briefly live on this
site in mid-2026 (added in `0e041f0`, removed in `a3a979e`). That pattern — a full-screen prompt demanding
a password before showing content — is exactly what Google Safe Browsing's automated classifiers flag as
"social engineering," and it's the most likely reason the deployment got marked as a dangerous site even
though nothing malicious was actually happening.

**Do not build a custom JS password/login overlay for this site again**, even temporarily. If access
control is ever needed, use Vercel's built-in deployment protection (Project Settings → Deployment
Protection) instead — it password-gates the whole deployment at the edge and never renders a login-styled
page to crawlers or visitors.

## Safe Browsing monitor

`.github/workflows/safe-browsing-check.yml` + `scripts/check-safe-browsing.mjs` check the live deployment
URL daily against the Google Safe Browsing API and open a GitHub issue if it's ever flagged again. Keep
`SITE_URL` in the workflow file in sync whenever the Vercel project (and therefore its `.vercel.app` URL)
is renamed.
