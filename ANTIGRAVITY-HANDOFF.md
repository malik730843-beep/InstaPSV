# Antigravity continuation prompt

Continue the InstaPSV content and product-quality remediation in `E:\InstaPSV WITH .ENV FILE\InstaPSV`. Read `CONTENT-IMPLEMENTATION-PLAN.md` and `CONTENT-VALIDATION.md` first. The user received an AdSense **Low value content** rejection and wants substantial improvements before resubmission. Never promise approval, a fixed review time, a required word count or that AI rewriting alone solves the issue.

The user subsequently selected Claude's supplied plan. Its verbatim copy is `CLAUDE-IMPLEMENTATION-PLAN.md`; the current item-by-item audit is `CLAUDE-PLAN-STATUS.md`. That audit supersedes older four-article descriptions below. Six complete articles, three downloads, author/editorial notes, category filtering, source-managed offline fallback and translation-key parity are now implemented. Check final validation results before doing more development. Do not undo these later changes or reintroduce the original blank static fallback records.

## Critical live finding

On November 12, 2026 (PKT), a read-only request to `https://instapsv.com/api/profile/search?username=instagram` returned HTTP 500 with a Meta error stating the access token expired September 30, 2026. Do not expose `.env.local` or credential values. The owner must renew/re-authorize the Meta integration and update `INSTAGRAM_ACCESS_TOKEN` in the production hosting configuration. Confirm the configured business account, permissions and actual supported profile coverage after renewal. If fresh lookups still fail, investigate the actual provider response and current official Meta documentation. Do not claim the tool works based on a build or cached result alone.

The local code now maps known expired-token errors to a visitor-friendly 503 response and tells visitors no search credits were used. This does not renew the credential or change the production deployment.

## What changed

- `src/lib/toolGuides.ts` and `src/components/seo/ToolGuidePage*`: distinct profile, story, video and Highlights guidance grounded in the actual implementation.
- `ViewerGuide.tsx`, homepage and Features: useful feature matrix, instructions and troubleshooting; removed homepage testimonials and hardcoded usage totals from rendering.
- `src/lib/reviewedContent.ts`: four reachable article revisions plus About, Contact and Privacy corrections. Existing CMS post `instagram-story-viewer` collides with a tool route and is excluded from listings. Do not delete CMS records to resolve this.
- Content corrections apply to old published records. Authenticated admin GETs load the reviewed version. A CMS record saved after `CONTENT_REVIEWED_AT` takes precedence; drafts and signed preview content remain isolated. No database migration or production write has been run.
- `siteRoutes.ts`: central static slug reservations; new post slugs avoid shadowed routes.
- Pricing, FAQ and Checkout: consistent credits, source limits and manual activation. No promise of full Highlights, original HD, zero logging or instant payment approval.
- Highlights page is noindex and omitted from sitemap because full collection retrieval is not implemented. Search UI no longer sells Pro access to missing Highlights or empty Stories data.
- Hashtag tool is accurately described as a local category list, not AI/live trend data or a shadowban guarantee.
- Added editorial policy and two downloadable plain-text worksheets in `public/resources`.
- Global schema now identifies the website without a fake free offer, false breadcrumb hierarchy or nonfunctional query-string search action.
- `/posts` redirects to the real blog; blog category links filter server-side; `/pages` FAQ destination and duplicates repaired.
- Corrected active translated hero, FAQ and footer copy across all eight non-English locales. Main English guides declare `lang="en"`.
- Fixed font custom-property scope so readable configured/system sans-serif fonts apply.
- `serviceFacts.ts` corrects specific inaccurate operational claims in Terms/Disclaimer without replacing their remaining provisions.

## Validation and remaining release work

Check the current validation file rather than assuming all checks passed. Commands: `npx tsc --noEmit`, `npm run build`, start local production server on 3100, `npm run test:content`, `npm run test:publishing`. The content checks include CMS revision precedence, real article rendering, canonicals, Highlights noindex and sitemap exclusion, archive redirect, translated homepages and worksheet downloads. Use network-enabled execution for Google Fonts and Supabase reads if the sandbox blocks them. Do not weaken tests to hide failures.

Complete desktop/mobile visual verification after the final build. Inspect main-page internal links, policy content and truthful pricing. Validate at least one fresh provider lookup after the owner fixes the token. Confirm that the support mailbox works, operator details are accurate, rights to monetize displayed media are established, and production advertising/consent settings match the privacy copy.

Deploy only the reviewed implementation when the user authorizes deployment. Verify the actual production pages, `/ads.txt`, `/robots.txt`, `/sitemap.xml`, noindex state and the working lookup after deployment. Do not request the next AdSense review while the main tool remains broken. No AdSense account action has been taken.

## Preserve existing work

Before this content task, the checkout already had changes to `src/app/[slug]/page.tsx`, both admin post editors, `src/lib/adminFetch.ts`, plus untracked `src/lib/postPreview.ts`, `src/app/api/admin/posts/preview/` and scratch scripts. Preserve the signed-preview/authentication work. Do not run scratch payment/user seeding or upgrade scripts. Do not reset the working tree, overwrite secrets, invent reviews/traffic/user statistics or activate legacy advertising overlays/service workers.

Google references: https://support.google.com/adsense/answer/7299563 and https://developers.google.com/search/docs/fundamentals/creating-helpful-content.
