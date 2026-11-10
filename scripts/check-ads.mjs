import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const publisher = 'pub-4159510249644161';
const expected = `google.com, ${publisher}, DIRECT, f08c47fec0942fa0`;

function checkAds(text) {
    assert(!text.includes('\uFEFF'), 'ads.txt must not contain a byte-order mark');
    assert(!/<(?:html|!doctype)/i.test(text), 'ads.txt returned HTML');
    assert(text.split(/\r?\n/).some(line => line.trim() === expected),
        `ads.txt is missing the expected seller: ${expected}`);
}

// Runs before every build, so a missing/incorrect file fails the deployment.
checkAds(await readFile(new URL('../public/ads.txt', import.meta.url), 'utf8'));
const layout = await readFile(new URL('../src/app/layout.tsx', import.meta.url), 'utf8');
assert(layout.includes(`'google-adsense-account': 'ca-${publisher}'`),
    'AdSense ownership metadata must match public/ads.txt');
console.log('PASS: versioned ads.txt and AdSense ownership ID');

const urlIndex = process.argv.indexOf('--url');
if (urlIndex !== -1) {
    assert(process.argv[urlIndex + 1], 'Usage: npm run check:ads -- --url https://instapsv.com');
    const base = new URL(process.argv[urlIndex + 1]);
    const hosts = new Set([base.hostname, base.hostname.startsWith('www.')
        ? base.hostname.slice(4) : `www.${base.hostname}`]);
    const origins = base.hostname === 'localhost' || base.hostname === '127.0.0.1'
        ? [base.origin]
        : [...hosts].flatMap(host => [`http://${host}`, `https://${host}`]);
    const agents = ['Mozilla/5.0', 'Mediapartners-Google', 'AdsBot-Google', 'Googlebot'];
    const results = await Promise.allSettled(origins.flatMap(origin => agents.map(async agent => {
        const response = await fetch(`${origin}/ads.txt`, {
            headers: { 'User-Agent': agent },
            signal: AbortSignal.timeout(30000),
        });
        assert.equal(response.status, 200, `${origin}/ads.txt (${agent}): HTTP ${response.status}`);
        assert(response.headers.get('content-type')?.startsWith('text/plain'),
            `${origin}/ads.txt must be text/plain`);
        checkAds(await response.text());
        console.log(`PASS: ${origin}/ads.txt (${agent}) -> ${response.url}`);
    })));
    for (const result of results) {
        if (result.status === 'rejected') {
            console.error(`FAIL: ${result.reason.message}`);
            process.exitCode = 1;
        }
    }
}
