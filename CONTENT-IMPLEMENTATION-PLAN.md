# InstaPSV content and product quality plan

Created November 12, 2026 (Asia/Karachi). Objective: give visitors an accurate, useful tool and original guidance before another AdSense review. Approval and its timing are Google's decisions; no implementation can promise them.

The user later selected Claude's implementation plan. See `CLAUDE-IMPLEMENTATION-PLAN.md` for that supplied plan and `CLAUDE-PLAN-STATUS.md` for the verified completion audit. The final implementation contains six full articles and three downloadable resources. This document retains the earlier investigation context.

## Evidence and root causes

The rejection screenshot explicitly reports **Low value content**. It does not identify a specific URL or provide a score. The following are confirmed code/content defects, not a claim to know Google's internal review rationale:

| Finding | Evidence | Required outcome |
| --- | --- | --- |
| Repeated marketing paragraphs and absolute privacy promises | Homepage translations and four original tool pages | Distinct guides describing actual inputs, outputs, examples, limitations and troubleshooting |
| Unsupported usage totals and testimonials | Hero constants and testimonial translation records | Remove from public rendering unless genuine evidence is supplied |
| Price and entitlement contradictions | Free claims on tool pages; Pro gates in InstagramSearch and MediaViewer | Describe credits, manual activation, coverage and paid controls consistently |
| Incomplete Highlights feature | discoverProfile does not request collections; UI only displays supplied covers | Explain limitation; remove purchase promises; noindex this incomplete destination and omit it from sitemap |
| Cached data advertised as live | Search route caches profile responses for 24 hours | Explain cache age and how to interpret missing results |
| False article archive | /posts contains mock records pointing to missing pages | Redirect to real /blog |
| CMS article collides with /instagram-story-viewer | Published post has the same slug as a dedicated app route | Keep tool route; exclude colliding article card and sitemap record |
| Privacy boilerplate and unsupported operational claims | Published About/Privacy/Contact, including www.website.com | Describe actual request, credit, account, payment and cache behavior |
| Misleading structured data | Global free offer, Highlights downloader, fake navigation hierarchy, unused search query action | Retain only truthful site identity; page-specific markup must match visible behavior |

## Implementation sequence and acceptance criteria

1. **Product truth and original guidance.** Rewrite homepage, Features and the four tool destinations; remove fake metrics and testimonials. Each guide must help complete a distinct task without requiring a search or a purchase. Keep meaningful internal links and readable mobile layout.
2. **Editorial repairs.** Replace the four reachable CMS articles with task-specific checklists, worked examples or worksheets. Label invented example figures. Do not invent first-hand tests, market research, author credentials or citations. Keep the old URLs to preserve existing links.
3. **Consistency.** Correct Pricing, pricing FAQs, metadata, schema, advertising copy and language variants. Never sell a complete archive, guaranteed original HD, unlimited provider capacity, zero logging, instant manual approval or a live hashtag trend feed.
4. **CMS maintenance.** Make versioned corrections reviewable without silently preventing future CMS edits. Preserve signed draft preview and admin changes already present in this workspace. Document how content is migrated or edited.
5. **Technical validation.** Run TypeScript, focused ESLint, production build and local HTTP checks. Confirm canonical URLs, noindex, sitemap exclusion, actual article rendering, /posts redirect, policy copy and internal destinations. Visually inspect desktop and mobile. Exercise a real supported lookup only if available without exposing credentials or spending money; do not claim successful product coverage from rendering tests.
6. **Release and review.** Deploy the validated changes, verify production responses, mailbox operation and actual tool coverage, then request AdSense review through the site owner's account. This checkout is not deployed merely because a build passes.

## Work completed before this plan

- Rewrote four tool pages using toolGuides.ts and ToolGuidePage.tsx.
- Added a useful homepage feature matrix and troubleshooting guide; removed unsupported social proof from public homepage rendering.
- Drafted four versioned article revisions and revised About, Contact and Privacy copy in reviewedContent.ts.
- Removed misleading hashtag metadata/schema and revised picker explanations.
- Redirected the mock /posts archive, repaired the FAQ archive link and removed the Highlights sitemap entry.
- First production build passed (52 routes); TypeScript and focused lint passed. Desktop homepage and Story guide were visually inspected. Subsequent fixes require a fresh final build.

## Owner facts that code cannot invent

- The real operator/editor identity, qualifications and business details, if the owner wants them published.
- Whether support@instapsv.com receives and answers mail; do not fabricate an SLA or mailbox test.
- The current production Meta permissions, token validity, supported account coverage and successful Stories availability.
- Which advertising scripts, legacy service workers and consent platform are actually active in production, and the operator's record-retention schedule.
- Rights to monetize third-party media. Displaying publicly accessible media does not establish those rights. Helpful articles cannot cure an unsupported monetization model.

These are practical release checks, not a hidden requirement to reach a particular article count, word count, traffic level or waiting period.

## Sources

- Google AdSense: https://support.google.com/adsense/answer/7299563 — original relevant content and clear navigation.
- Google Search: https://developers.google.com/search/docs/fundamentals/creating-helpful-content — people-first content, demonstrable value, accurate claims; no preferred word count.
- Google Publisher Policies: https://support.google.com/publisherpolicies/answer/11035931 — avoid unsupported services, keyword stuffing and doorway pages.

Final implementation status and verification results are recorded in CONTENT-VALIDATION.md. Remaining release work and a reusable Antigravity prompt are recorded in ANTIGRAVITY-HANDOFF.md.
