import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const origin = new URL(process.argv[2] || 'http://localhost:3100');
assert(['localhost', '127.0.0.1'].includes(origin.hostname), 'Use a local production server');
const english = JSON.parse(await readFile(new URL('../src/messages/en.json', import.meta.url), 'utf8'));
for (const locale of ['de', 'fr', 'es', 'it', 'nl', 'da', 'no', 'sv']) {
    const messages = JSON.parse(await readFile(new URL(`../src/messages/${locale}.json`, import.meta.url), 'utf8'));
    for (const namespace of ['nav', 'hero', 'faq', 'footer', 'blog']) {
        for (const key of Object.keys(english[namespace])) {
            assert(key in messages[namespace], `missing translated interface key: ${locale}.${namespace}.${key}`);
        }
    }
}
const source = await readFile(new URL('../src/lib/reviewedContent.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const revisionUrl = `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`;
const revisions = await import(revisionUrl);
const staticSource = await readFile(new URL('../src/lib/staticBlogPosts.ts', import.meta.url), 'utf8');
const staticCompiled = ts.transpileModule(staticSource, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
    .replace(/(['"])\.\/reviewedContent\1/, JSON.stringify(revisionUrl));
const staticArticles = await import(`data:text/javascript;base64,${Buffer.from(staticCompiled).toString('base64')}`);
assert.equal(staticArticles.STATIC_BLOG_POSTS.length, 6);
for (const article of staticArticles.STATIC_BLOG_POSTS) {
    assert.match(article.content, /<h2>/, `populated offline article: ${article.slug}`);
    assert.equal(article.created_at, revisions.CONTENT_REVIEWED_AT, 'fallback dates must not invent a publication history');
}
assert.equal(staticArticles.mergeStaticPosts([{ slug: 'view-instagram-stories-anonymously', content: 'CMS wins' }])
    .find(post => post.slug === 'view-instagram-stories-anonymously').content, 'CMS wins');
assert(!staticArticles.mergeStaticPosts([], new Set(['view-instagram-stories-anonymously']))
    .some(post => post.slug === 'view-instagram-stories-anonymously'), 'honor unpublished CMS slugs');
const old = { slug: 'view-instagram-stories-anonymously', status: 'published', updated_at: '2026-11-01T00:00:00Z', title: 'Old', content: 'Old' };
assert.notEqual(revisions.applyReviewedPost(old).content, 'Old', 'old published article receives correction');
const newer = { ...old, updated_at: '2026-12-01T00:00:00Z', content: 'Later CMS edit' };
assert.equal(revisions.applyReviewedPost(newer).content, 'Later CMS edit', 'a later CMS save wins');
assert.equal(revisions.applyReviewedPost({ ...old, status: 'draft' }).content, 'Old', 'draft content remains untouched');
const oldPage = { ...old, slug: 'about' };
assert.notEqual(revisions.applyReviewedPage(oldPage).content, 'Old');
assert.equal(revisions.applyReviewedPage({ ...oldPage, updated_at: newer.updated_at }).content, 'Old', 'later page edit wins');
console.log('PASS: published revisions, future CMS edits and draft isolation');

const get = async (path, options = {}) => {
    const response = await fetch(new URL(path, origin), { signal: AbortSignal.timeout(25000), ...options });
    return { response, html: await response.text() };
};
const mainText = html => (html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, ' ');
const cases = [
    ['/', /Choose the tool that fits your task/, /500K\+|50K\+|100% (?:invisible|anonymous)/i],
    ['/features', /Features and availability/],
    ['/anonymous-instagram-viewer', /A practical way to compare public accounts/],
    ['/instagram-story-viewer', /Troubleshoot an empty Stories tab/],
    ['/instagram-reels-downloader', /If playback works but saving fails/],
    ['/instagram-highlights-viewer', /does not request highlight collections/],
    ['/instagram-hashtag-generator', /local category list/, /100% Shadowban Safe|skyrocket|AI-Powered Categorization/i],
    ['/pricing', /6 credits/, /100% Anonymous|Instant Activation|Browse Saved Highlights/i],
    ['/about', /cache/],
    ['/contact', /must send it/],
    ['/privacy-policy', /search-credit|credit deduction/i, /www\.website\.com/i],
    ['/editorial-policy', /Examples and evidence/],
    ['/view-instagram-stories-anonymously', /Do not rely on invisibility tricks/],
    ['/analyze-competitors-instagram-profiles-safely', /Shop A/],
    ['/how-to-set-fair-rates-for-sponsored-content-in-2026', /invented example inputs/],
    ['/social-media-burnout-2026', /six-hour week/],
    ['/instagram-reels-downloader-guide', /download the troubleshooting checklist/i],
    ['/instagram-hashtag-strategy-guide', /Work through a small candidate set/],
];
for (const [path, required, forbidden] of cases) {
    const { response, html } = await get(path);
    assert.equal(response.status, 200, path);
    const text = mainText(html);
    assert.match(text, required, path);
    if (forbidden) assert.doesNotMatch(text, forbidden, path);
    assert.equal((html.match(/<h1\b/gi) || []).length, 1, `one h1: ${path}`);
    const canonicalPath = path === '/' ? '' : path;
    assert.match(html, new RegExp(`<link rel="canonical" href="https://instapsv\\.com${canonicalPath}/?"`), `canonical: ${path}`);
    assert.doesNotMatch(html, /"@type":"SoftwareApplication"/, 'removed misleading global offer schema');
    if (path === '/instagram-highlights-viewer') assert.match(html, /name="robots" content="noindex, follow"/);
    console.log(`PASS: ${path}`);
}
const { response: archive } = await get('/posts', { redirect: 'manual' });
assert.equal(archive.status, 308);
assert.equal(archive.headers.get('location'), '/blog');
const { response: faq } = await get('/faq', { redirect: 'manual' });
assert.equal(faq.status, 308);
assert.equal(faq.headers.get('location'), '/#faq');
const { html: sitemap } = await get('/sitemap.xml');
assert.doesNotMatch(sitemap, /<loc>[^<]*\/instagram-highlights-viewer<\/loc>/);
assert.equal((sitemap.match(/<loc>[^<]*\/instagram-story-viewer<\/loc>/g) || []).length, 1);
assert.match(sitemap, /\/editorial-policy<\/loc>/);
for (const path of ['/resources/profile-research-worksheet.txt', '/resources/content-project-brief.txt', '/resources/reels-download-checklist.txt']) {
    const { response, html } = await get(path);
    assert.equal(response.status, 200);
    assert.match(html, /WORKSHEET|PROJECT BRIEF|Troubleshooting Checklist/);
}
const { html: blog } = await get('/blog');
assert.match(mainText(blog), /A Repeatable Public Instagram Profile Research Worksheet/);
assert.doesNotMatch(mainText(blog), /Instagram Story Viewer: Watch Instagram Stories Anonymously with InstaPSV/);
assert.match(blog, /href="\/blog\?category=/, 'categories must navigate');
for (const locale of ['de', 'fr', 'es', 'it', 'nl', 'da', 'no', 'sv']) {
    const { html } = await get('/', { headers: { Cookie: `NEXT_LOCALE=${locale}` } });
    assert.doesNotMatch(mainText(html), /100%/);
    assert.doesNotMatch(html, />\s*(?:faq\.title(?:Start|Highlight|End)|nav\.pricing)\s*</, 'no missing-message labels');
}
console.log('PASS: archive redirect, sitemap, worksheets, real blog links and eight translated home variants');

for (const [category, title] of [
    ['research', /A Repeatable Public Instagram Profile Research Worksheet/],
    ['creators', /Build a Sponsored Content Quote from Scope and Assumptions/],
    ['guides', /Before Using an Instagram Story Viewer/],
]) {
    const { response, html } = await get(`/blog?category=${category}`);
    assert.equal(response.status, 200);
    assert.match(mainText(html), title, `category must include its revised CMS article: ${category}`);
}
console.log('PASS: Research, Creators and Guides categories include revised CMS articles');
