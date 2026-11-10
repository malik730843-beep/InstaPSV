import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';

const origin = new URL(process.argv[2] || 'http://localhost:3100');
assert(['localhost', '127.0.0.1'].includes(origin.hostname), 'Run these API access tests against a local server only');
const request = (path, options = {}) => fetch(new URL(path, origin), {
    ...options, signal: AbortSignal.timeout(10000),
});

const ads = await request('/ads.txt', { headers: { 'User-Agent': 'Mediapartners-Google', 'x-vercel-ip-country': 'IL' } });
assert.equal(ads.status, 200);
assert.match(ads.headers.get('content-type'), /^text\/plain/);
assert.match(await ads.text(), /google\.com, pub-4159510249644161, DIRECT, f08c47fec0942fa0/);
assert.equal((await request('/ads.txt', { method: 'HEAD' })).status, 200);
const robots = await request('/robots.txt');
assert.equal(robots.status, 200);
assert.match(await robots.text(), /Allow: \/ads\.txt/);
console.log('PASS: crawler GET/HEAD, text response, geographic middleware exclusion, robots.txt');

const files = await readdir(new URL('../src/app/api/admin/', import.meta.url), { recursive: true });
for (const file of files.filter(file => /(?:^|[/\\])route\.ts$/.test(file))) {
    const path = '/api/admin/' + file.replace(/[/\\]?route\.ts$/, '').replaceAll('\\', '/');
    for (const method of ['GET', 'POST']) {
        const response = await request(path, { method, headers: { 'User-Agent': 'AdsBot-Google', 'X-Admin-Offline-Bypass': 'true' } });
        assert.equal(response.status, 401, `${method} ${path} must require authentication`);
    }
    console.log(`PASS: ${path} rejects unauthenticated GET and POST, including spoofed crawler/bypass headers`);
}
