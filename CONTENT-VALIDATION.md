# Content validation and release status

Updated November 12, 2026 (Asia/Karachi).

## Latest credential update

The owner supplied a replacement token, which was saved only to the ignored `.env.local` as `INSTAGRAM_ACCESS_TOKEN`. Meta accepted it (`/me` returned HTTP 200). However, the actual profile integration still failed because the token cannot access the configured Instagram Business account; `/me/accounts` returned no linked Pages. Correct account access/permissions before claiming the lookup works. The earlier expired-token finding below is historical.

Vercel synchronization has not happened. No authenticated CLI/project link was available, and browser sign-in was handed to the owner. Automatic approval review blocked observing the Google SSO page; wait for the owner to finish sign-in and return to Vercel before continuing. Do not inspect the Google account page or work around that restriction. No token values are recorded in this document.

## Confirmed

- Screenshot rejection: **Low value content**; no URL-level cause provided by Google.
- Published CMS audit: five articles and five pages read without modifying database records. One article slug collides with a dedicated tool route.
- Live profile lookup: HTTP 500; Meta token expired September 30, 2026. This is an unresolved production configuration blocker. Renew the integration and verify a fresh lookup before another review.
- Earlier production build passed with 52 routes before subsequent changes. TypeScript and focused ESLint passed for the initial guides, revision module and later core content modules.
- Desktop homepage and Story guide were visually inspected before the final pricing/CMS consistency changes.

## Final checks

- Final `npm run build`: **passed**, 54 generated routes. The existing Next.js middleware-to-proxy deprecation warning remains.
- `npx tsc --noEmit`: **passed** after the completed source changes.
- Focused ESLint for the new content/revision/taxonomy modules, guide components, disabled testimonial component, editorial/FAQ pages and content test script: **passed**. This is not a claim that the entire legacy repository is lint-clean.
- `git diff --check`: **passed**. Existing line-ending normalization notices do not represent whitespace errors.
- `npm run test:content`: **passed** against the final local production build. It checks 18 main destinations including all six article bodies, canonical metadata, one H1, Highlights noindex, sitemap exclusions/deduplication, archive/FAQ redirects, three resource responses, real blog links, eight translated homepage variants and Research/Creators/Guides category membership.
- Content regressions: **passed** for complete static article bodies, non-backdated fallback dates, CMS precedence, explicit unpublish exclusions and draft isolation. Source catalog checks confirm active interface keys exist across all nine valid BOM-free JSON files.
- `npm run test:publishing`: **passed**, including ads.txt GET/HEAD, robots/geographic exclusions and unauthenticated GET/POST rejection on all 16 admin endpoints (32 denial checks).
- `npm run check:ads -- --url https://instapsv.com`: **passed** for the tracked seller record and all 16 live protocol/domain/user-agent combinations. These requests do not establish that every genuine Google source IP is allowed by hosting firewall rules.
- Desktop blog and mobile blog/article inspected using a 390px viewport. Category navigation worked, long article headings were readable, and the page had no horizontal overflow. The temporary viewport override was reset. Category mapping and translation fixes were subsequently covered by the final HTTP suite.
- Local lookup with the current expired integration: **verified HTTP 503** with `PROFILE_PROVIDER_UNAVAILABLE` and a visitor-friendly message. The production baseline remains HTTP 500 until code deployment and token renewal; successful provider coverage has **not** been established.

The local test server was stopped after verification. No production deployment or AdSense request was performed. See `CLAUDE-PLAN-STATUS.md` for the complete audit against the user-selected plan.

## CMS correction behavior

`reviewedContent.ts` provides corrections to old published records. Public pages, listings and admin GETs use the same correction functions. Saving in the CMS creates a later `updated_at`, which takes precedence over the versioned correction. Draft content is not overwritten. This allows editing the corrected text normally after deployment without needing a manual database migration.

The correction module is versioned source and should remain until every affected CMS record has been saved with the reviewed content. Removing it earlier would expose the old text again. `staticBlogPosts.ts` supplies six complete articles for missing CMS slugs; the two new guides are code-managed until added to the CMS. Available CMS records that explicitly unpublish an article are respected. No database writes, payment changes, deployments or AdSense submissions were performed during this task.

## Owner checks before release

1. Renew the Meta integration and update production `INSTAGRAM_ACCESS_TOKEN`; verify business account and permissions without posting credentials in chat.
2. Test one fresh supported public profile. Confirm any promised premium feature separately; complete highlight collections are not implemented.
3. Verify the support mailbox, real operator details and actual retention practices.
4. Confirm rights for monetized third-party media and active ad/consent behavior. Content rewrites alone cannot establish these facts.
5. Deploy, verify production responses and only then decide whether to request AdSense review.
