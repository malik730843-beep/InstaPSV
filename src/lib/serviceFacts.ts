// Correct factual product descriptions while preserving the rest of legal copy.
export function correctServiceFacts(html: string): string {
    return html
        .replace('InstaPSV does not host or store any media (images, videos, or audios) on its servers.', 'Profile responses may be cached for up to 24 hours, and downloads may pass through our server.')
        .replace("All displayed content is streamed in real-time directly from Instagram's public CDN servers.", 'Media display depends on external source URLs and provider availability.')
        .replace('We do NOT store, host, or archive any media files (videos, photos, stories, highlights) on our servers.', 'Profile responses may be cached for up to 24 hours, and downloads may pass through our server.')
        .replace('All content viewed through our tools is streamed directly from Instagram’s public CDN (Content Delivery Network).', 'Media display depends on external source URLs and provider availability.')
        .replace('InstaPSV does not require or request your Instagram login credentials, passwords, or personal information.', 'InstaPSV does not request Instagram login credentials. Site account, credit and payment features process information as described in the Privacy Policy.');
}
