# Missing Money Method

A free public educational tool that helps people find legitimate unclaimed-property resources and understand how to search for money that may already belong to them.

**Live application:** https://money-missing-method.vercel.app

**Sponsored by CREIGNIFICENT LLC.**

## Business Model

The public unclaimed-property search guide remains free. Users who find a possible claim can optionally purchase a **$27 one-time Claim Packet** for organizational and document-preparation assistance.

The Claim Packet includes:

- Personalized claim checklist
- Document checklist
- Claim cover-letter template
- Follow-up letter template
- California digital-asset notes when applicable
- Browser-generated printable/PDF packet

Government searches and claim filing may be available free. The paid packet does not guarantee recovery and is not legal, tax, estate, or financial advice.

## Technology

- HTML / CSS / JavaScript
- Vercel serverless functions
- Stripe Checkout
- GitHub
- Vercel

## Required Vercel Environment Variable

`STRIPE_SECRET_KEY`

Use a Stripe test secret key while testing. Replace it with the live secret key only when the checkout flow is approved for production.

## Payment Flow

1. User searches for unclaimed property using free resources.
2. User opens `/claim-packet.html`.
3. `/api/create-checkout-session` creates a one-time $27 Stripe Checkout Session.
4. Stripe returns the buyer to `/claim-packet.html?session_id=...`.
5. `/api/verify-payment` retrieves the Checkout Session and confirms `payment_status === "paid"`.
6. Only after verification does the claim-intake form unlock.
7. The completed packet is generated in the browser and can be printed or saved as PDF.

## Privacy and Security

The claim intake intentionally tells users not to enter Social Security numbers, driver's-license numbers, bank information, passwords, wallet seed phrases, or private keys. The packet is generated client-side and no claim database is included in this version.

Stripe handles payment-card entry. The Stripe secret key stays server-side in Vercel environment variables and must never be committed to GitHub.

## Repository Structure

- `index.html` — free public guide
- `claim-packet.html` — optional paid Claim Packet checkout/intake/generator
- `api/create-checkout-session.js` — creates Stripe Checkout Session
- `api/verify-payment.js` — verifies successful payment before unlocking intake
- `package.json` — Stripe dependency
- `social-preview.png` — social sharing image
- `README.md` — project documentation
- `SECURITY.md` — security and privacy guidance

## Deployment

The production application is deployed through Vercel from this repository.

Before production launch:

1. Add `STRIPE_SECRET_KEY` to the Vercel project.
2. Deploy the feature branch as a preview.
3. Complete a Stripe test-mode purchase.
4. Confirm the intake remains locked without a paid Checkout Session.
5. Confirm the packet generates and prints correctly after payment.
6. Merge the feature branch to `main` only after the test passes.

## Safety and Disclaimer

Missing Money Method is an independent educational resource. It is not a government agency and does not hold, approve, process, or distribute unclaimed funds. Users should verify all claim procedures directly with the official government agency responsible for the property.

Created by Tc.CREIG.

**Sponsored by CREIGNIFICENT LLC.**
