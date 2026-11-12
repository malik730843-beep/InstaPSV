import Link from 'next/link';
import styles from '@/components/seo/ToolGuidePage.module.css';

export default function ViewerGuide() {
    return <div className={styles.main} style={{ paddingTop: 40 }} lang="en">
        <section className={styles.section} id="features">
            <h2>Choose the tool that fits your task</h2>
            <p>InstaPSV looks up supported public Instagram Business and Creator accounts. You do not enter Instagram credentials. Public visibility alone does not guarantee a result, and this service does not open private accounts.</p>
            <div className={styles.tableWrap}><table>
                <caption>Current features and access limits</caption>
                <thead><tr><th scope="col">Your task</th><th scope="col">Where to start</th><th scope="col">What to expect</th></tr></thead>
                <tbody>
                    <tr><th scope="row">Read a bio or inspect returned posts</th><td><Link href="/anonymous-instagram-viewer">Profile viewer</Link></td><td>Search credits apply. A sample of media and available profile counts, not complete follower lists.</td></tr>
                    <tr><th scope="row">Browse returned video items</th><td><Link href="/instagram-reels-downloader">Reels guide</Link></td><td>Videos returned by the source. Downloads require Pro; resolution and catalog completeness vary.</td></tr>
                    <tr><th scope="row">Check story availability</th><td><Link href="/instagram-story-viewer">Story guide</Link></td><td>Pro gate and provider limits apply. Confirm coverage before purchasing for Stories.</td></tr>
                    <tr><th scope="row">Open a highlight collection</th><td><Link href="/instagram-highlights-viewer">Highlights limitations</Link></td><td>Full collection retrieval is not implemented. Use the creator’s original Instagram profile.</td></tr>
                    <tr><th scope="row">Find hashtag ideas</th><td><Link href="/instagram-hashtag-generator">Hashtag picker</Link></td><td>Suggestions from a local category list, not live trend or popularity measurements.</td></tr>
                </tbody>
            </table></div>
        </section>
        <section className={styles.section} id="how-it-works">
            <h2>Make your first lookup useful</h2>
            <ol>
                <li><strong>Use a current account handle.</strong> Enter @example.studio or its profile URL. Direct post and Reel links are not supported by the username search.</li>
                <li><strong>Check the result and the plan notice.</strong> A loaded profile does not guarantee Stories or Highlights. Search credits and premium controls are shown in the interface; see <Link href="/pricing">Pricing</Link> for plan details.</li>
                <li><strong>Keep the source and date.</strong> If you use a caption or count in research, keep the original post link and observation date. Cached profile responses may be up to 24 hours old.</li>
            </ol>
        </section>
        <section className={styles.section}>
            <h2>Use a worksheet for your next research task</h2>
            <p>The <Link href="/analyze-competitors-instagram-profiles-safely">public profile research guide</Link> shows how to compare account messaging, record source links and separate evidence from assumptions. <a href="/resources/profile-research-worksheet.txt" download>Download the research worksheet</a> to use with your own observations.</p>
        </section>
        <section className={styles.section}>
            <h2>When a search does not give you what you expected</h2>
            <p><strong>No profile:</strong> check the spelling and whether it is a supported public Business or Creator account. A public personal account may not resolve through this integration.</p>
            <p><strong>Profile loads, media is missing:</strong> the provider may return a limited selection or omit that media type. An empty tab does not establish that the creator has no content.</p>
            <p><strong>Rate limit or connection error:</strong> wait before trying again. Repeated refreshes do not bypass a provider restriction or force cached data to update.</p>
            <p><strong>Still stuck:</strong> <Link href="/contact">report the issue</Link> with the public handle, page URL, approximate time and visible error. Never send an Instagram password or access token.</p>
        </section>
        <section className={styles.section}>
            <h2>Privacy and responsible use</h2>
            <p>Using a form without Instagram login does not make a browsing session untraceable. Requests pass through site infrastructure, and media may be delivered by external hosts. Account, credit and payment features also process information when used. Read the <Link href="/privacy-policy">privacy policy</Link> for details.</p>
            <p>Keep the creator’s context and attribution when collecting references. A public post or a download control does not grant permission to republish the media. InstaPSV is independent of Instagram and Meta.</p>
        </section>
    </div>;
}
