# AdSense investigation — November 10, 2026 (PKT)

## What was confirmed

- The screenshot says **Getting ready**, not rejected. Its ads.txt observation is dated November 2, 2026 at 7:07 AM PKT.
- The live file returned HTTP 200, plain text, and the expected seller record on November 10. All 16 combinations of HTTP/HTTPS, www/apex, and browser/Mediapartners-Google/AdsBot-Google/Googlebot passed.
- The deployed host is Vercel. HTTP and www redirect to `https://instapsv.com/ads.txt`.
- The existing tracked `public/ads.txt` was already in the correct Next.js location, and middleware already excluded it. There is no evidence of a database-generated or temporarily uploaded ads.txt file in this checkout.
- The exact cause of the earlier failed crawl is **unconfirmed**. A successful check today cannot exclude earlier downtime, an older deployment, or hosting firewall challenges. Check Vercel request/firewall logs for `/ads.txt` around Google's failed crawl; no hosting logs were available in this task.

## Changes in this checkout

- Build preflight fails if the versioned file is missing, has a BOM/HTML, lacks the current seller record, or disagrees with ownership metadata.
- Explicit plain-text and revalidation headers for ads.txt; retained static delivery independent of database/auth/rate limiting.
- robots.txt no longer queries Supabase and explicitly permits ads.txt.
- AdSense ownership metadata remains consistent with ads.txt even if a different ID is saved in the CMS. Changing publishers requires updating both tracked values.
- Authentication now protects all `/api/admin/*` endpoints through middleware. Admin screens attach the Supabase session token. Removed offline login bypass and the hardcoded administrator allowlist; configure `ADMIN_EMAIL` with the real admin email(s).
- Admin metadata is now exported by the actual server layout. Added noindex headers for admin and API routes.
- Removed the hardcoded aggregate rating that had no supporting review data in code.
- Fixed the footer FAQ destination and added the matching section anchor.
- The active contact form previously claimed success without delivering anything. It now prepares an email explicitly and tells visitors to send it in their email app. The active newsletter signup similarly simulated success; replaced it with a contact link. Confirm that `support@instapsv.com` receives mail.

## Deploy and verify

1. Deploy this checkout. For Vercel, set the project Root Directory to `InstaPSV` if the repository contains the outer folder; use `npm run build`. Public assets must be included in every production deployment. Custom standalone Docker output must also copy `public/` and `.next/static/` into the runtime image.
2. Keep `public/ads.txt` committed. Its record is `google.com, pub-4159510249644161, DIRECT, f08c47fec0942fa0`. Confirm that this publisher ID belongs to the AdSense account in the screenshot; account ownership was not independently verified.
3. Run `npm run check:ads -- --url https://instapsv.com` after deployment. All domain variants and crawler agents must pass. Ensure hosting firewall/bot protection does not challenge ads.txt or robots.txt. A spoofed user-agent test does not prove Google IPs are allowed by hosting rules.
4. In AdSense, open the existing site and use Check for updates if offered. Allow Google time to crawl again. Do not delete and re-add the site to try to reset review.
5. If Not found persists, inspect hosting logs for response status, redirect destination, and bot challenges. Compare the displayed last-updated date. Check both A and AAAA DNS records and all configured domains in the hosting dashboard.

For local integration checks: `npm run build`, then `npm run start -- --port 3100`, then in another terminal `npm run test:publishing`. It checks static crawler responses and unauthenticated GET/POST denial for every admin API. These tests intentionally do not change database records.

## Approval work that code alone cannot settle

- Google decides approval separately from ads.txt authorization. Original, useful editorial content, a working tool, clear navigation, and proper rights to content remain essential. Viewing or downloading public Instagram media does not establish permission to monetize or republish it. Review actual CMS articles and displayed media; adding generic filler pages cannot guarantee approval.
- Confirm the published About, Contact, privacy, terms, and disclaimer content is accurate. CMS content overrides fallback text. Verify mailbox ownership and all privacy claims against actual analytics, stored searches, authentication, payments, and third-party API behavior.
- Confirm testimonials and marketing privacy claims are supportable. The removed aggregate rating should only return with real review evidence.
- Legacy ad components include custom full-screen overlays and third-party banner scripts; they were not imported into the active public pages found in this checkout. Do not activate custom popups/interstitials or place Google ads over search/download controls without reviewing Google's placement rules. `public/sw.js` imports an external advertising worker; check whether an older deployment registered it before enabling or retaining push monetization. Its registration was not found in current source.
- No certified consent management platform was found in active code. Before serving personalized Google ads in the EEA, UK, or Switzerland, configure Google's Privacy & messaging solution or another Google-certified CMP in the account. A homemade cookie banner is not a substitute for that certification.
- A valid verification meta tag is already present. AdSense ad serving should be configured after the site is Ready; no unapproved ad slots or invented slot IDs were added.

## Google references

- https://support.google.com/adsense/answer/7679060 — crawler reachability, status codes, redirects, and recrawl delay.
- https://support.google.com/adsense/answer/12170222 — site review and ads.txt are separate statuses; avoid removing/resubmitting sites.
- https://support.google.com/adsense/answer/7299563 — original content and navigation readiness.
- https://support.google.com/adsense/answer/1346295 — ad placement policies.
- https://support.google.com/adsense/answer/13554116 — certified CMP requirements.

These changes are local until deployed. No AdSense account setting or production deployment was changed during this investigation.

## Validation results

- Final `npm run build`: passed, including TypeScript and all 51 generated routes. Next.js reports its existing middleware-to-proxy deprecation warning.
- ESLint for the new scripts, robots route, authenticated fetch helper, contact/newsletter components, admin server layout, and Next config: passed. This was a focused check, not a claim that the whole legacy codebase is lint-clean.
- `npm run test:publishing` against the production server: passed. All 15 admin endpoints denied unauthenticated GET and POST, including spoofed crawler and offline-bypass headers (30 denied requests). Crawler GET/HEAD, MIME type, middleware exclusion, and robots checks passed.
- Local ads.txt checks passed with all four user agents. The live site passed all 16 domain/protocol/user-agent combinations before deployment.
- A real admin login and authenticated write flow were not exercised; no account credentials or database writes were used for validation.
