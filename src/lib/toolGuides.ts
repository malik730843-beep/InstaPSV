export type ToolGuide = {
    slug: string;
    title: string;
    description: string;
    tab: 'POSTS' | 'STORIES' | 'HIGHLIGHTS' | 'REELS';
    availability: string;
    sections: { heading: string; paragraphs: string[]; items?: string[] }[];
    faqs: { question: string; answer: string }[];
};

// Keep product claims tied to InstagramSearch, discoverProfile and the search API.
export const toolGuides: ToolGuide[] = [
    {
        slug: 'anonymous-instagram-viewer',
        title: 'Instagram Profile Viewer',
        description: 'Look up supported public Instagram profiles without entering Instagram credentials. Learn what the results include and how to interpret missing data.',
        tab: 'POSTS',
        availability: 'Searches use credits. The current integration is designed for supported public Business and Creator accounts; a public personal account may not resolve. Private accounts are not supported.',
        sections: [
            { heading: 'Look up a profile, not a post link', paragraphs: ['Enter the account handle, such as @example.studio, or its profile URL. A username identifies an account; a /p/ or /reel/ URL identifies a single media item and is not supported by this search. If the creator renamed the account, use the handle shown on their current profile.', 'The results can include the profile name, biography, profile image, follower and following counts, and a selection of media returned by the provider. Counts are totals, not lists of the people following the account. Missing fields should be treated as unavailable information rather than zero activity.'] },
            { heading: 'A practical way to compare public accounts', paragraphs: ['Start with a specific question: how does a shop explain its delivery options, or how does a creator introduce a series? Read the bio and a few returned captions, then record the account handle, the date you checked, and links to the examples. Separate what the account actually says from your interpretation.', 'Follower counts alone do not measure sales, trust, or audience quality. The returned media is a sample, not necessarily the complete publication history. Avoid making a growth claim from one cached snapshot.'], items: ['For your own account, check whether the bio clearly explains what you offer.', 'For a research comparison, use the same question and observation date for each account.', 'Keep links to the original posts so that context and attribution are preserved.'] },
            { heading: 'Why a public profile can return no results', paragraphs: ['Public visibility does not guarantee API access. A personal account, changed username, provider restriction, expired access token, or temporary rate limit can stop a lookup. A failed search does not prove that the creator blocked you or deleted their account.', 'Check the handle first. If the page reports a rate limit, wait before retrying. If multiple known public Business or Creator accounts fail, report the error through Contact with the time and the message shown. Do not send passwords or access tokens.'] },
            { heading: 'What “without Instagram login” means here', paragraphs: ['The search form does not ask you to connect your Instagram account. This does not make web browsing untraceable: the site and its infrastructure process requests, and media may load from external hosts. Read the privacy policy before using the service.', 'This viewer is not a profile-visitor detector. Do not confuse aggregate account statistics with a named list of people who visited a profile.'] },
        ],
        faqs: [
            { question: 'Can I see a complete follower list?', answer: 'No. The current profile view displays follower and following counts when available, not a complete list of those accounts.' },
            { question: 'Are the results live?', answer: 'Not necessarily. Profile responses can be cached for up to 24 hours. Counts, captions and media availability can change after a result is cached.' },
            { question: 'Can this open a private profile?', answer: 'No. Use Instagram and the account owner’s normal access controls for private content.' },
        ],
    },
    {
        slug: 'instagram-story-viewer',
        title: 'Instagram Story Viewer',
        description: 'Check story availability for supported public accounts, understand Pro access, and troubleshoot missing or expired stories.',
        tab: 'STORIES',
        availability: 'Story viewing is gated to Pro in the current interface. Access also depends on the provider returning story data; paying does not guarantee stories for an account. Confirm availability with support before buying for this feature.',
        sections: [
            { heading: 'Check availability before expecting a story', paragraphs: ['Enter a public account username, then check the Stories results. This lookup cannot recover a story simply because it once existed. Story access depends on the source, account eligibility and the content still being available.', 'A profile can load successfully while its Stories tab is empty. Profile information and story media are different data: a biography or a post grid is not evidence that the provider can also supply stories.'] },
            { heading: 'Stories, posts and highlights answer different questions', paragraphs: ['A story is a temporary update. A post is a feed item. A highlight is a collection the creator chooses to keep on their profile. If you need an ongoing reference such as opening hours, first look for a current bio, linked website or permanent post instead of relying on an old story.', 'This tool does not provide the account owner’s private story archive, Close Friends updates, direct messages, or removed stories. Do not treat an empty result as proof that an account has not published anything.'] },
            { heading: 'Troubleshoot an empty Stories tab', paragraphs: ['Use this order to avoid wasting searches on repeated requests that cannot change the source data.'], items: ['Check that the username is current and the account is public.', 'Read the on-screen plan requirement. A Pro lock is different from an empty provider response.', 'If the profile loads but no stories appear, the provider may not supply stories for that account.', 'Results may be cached for up to 24 hours. Refreshing repeatedly does not necessarily retrieve newer content.', 'If an available story will not play, check your connection and retry later; its media link may have expired.'] },
            { heading: 'Use story information with context', paragraphs: ['For a product announcement, record the creator’s handle and when you saw it, then check their official website before acting on a price or availability claim. Temporary updates can become outdated quickly.', 'The form does not require Instagram credentials, but this is not a guarantee of complete anonymity or zero logging. Do not use the service to harass someone or evade their privacy choices.'] },
        ],
        faqs: [
            { question: 'Is story viewing free?', answer: 'The current interface requires Pro for story viewing. Profile searches use credits. Check Pricing and confirm source availability before paying for a particular use case.' },
            { question: 'Can it recover expired or deleted stories?', answer: 'No. There is no recovery archive in this tool. It can only display data available from the source.' },
            { question: 'Does a missing story mean the account is private?', answer: 'No. An empty response may reflect provider limitations, expired content, caching or a connection error. It does not establish the account’s privacy status.' },
        ],
    },
    {
        slug: 'instagram-highlights-viewer',
        title: 'Instagram Highlights: Availability and Limits',
        description: 'Understand what the current Highlights view can display, why collections may be missing, and where to check the creator’s original highlights.',
        tab: 'HIGHLIGHTS',
        availability: 'Limited feature: the current integration does not request highlight collections. The interface can show supplied cover data, but does not open a complete highlight story archive. Do not purchase Pro expecting a full Highlights downloader.',
        sections: [
            { heading: 'What this page currently supports', paragraphs: ['The Highlights tab is present in the interface and has a Pro gate, but the profile integration does not currently request highlight collections. A cover or collection title, if supplied, is not the set of photos and videos inside that collection.', 'For a complete collection, open the creator’s profile on Instagram and follow the access requirements shown there. This page documents the limitation so you can decide whether the tool fits your task before using credits or buying a plan.'] },
            { heading: 'Highlights are curated collections, not a complete archive', paragraphs: ['Creators choose which stories to retain as highlights and can edit or remove those collections. A collection title such as “Delivery” or “Events” is a useful starting point, but it does not confirm that every detail inside is current.', 'If you are checking a shop’s policy, compare the information with its current website or ask the shop directly. If you are collecting references, keep the original profile link and record your observation date.'] },
            { heading: 'How to interpret missing or incomplete results', paragraphs: ['A public profile may have highlights on Instagram while this tool shows none. That discrepancy can reflect the integration’s coverage rather than an action by the creator. Repeatedly refreshing or upgrading cannot add a data source that is not implemented.'], items: ['A cover is a preview image, not a downloadable collection.', 'An empty collection view does not prove that the account has no highlights.', 'Private accounts and the owner’s unpublished story archive are outside this tool’s scope.', 'Report a misleading result with the public handle and error message; never share account credentials.'] },
        ],
        faqs: [
            { question: 'Can I download an entire highlight collection here?', answer: 'No. The current implementation does not retrieve and play all stories in a highlight collection.' },
            { question: 'Will upgrading make missing highlights appear?', answer: 'A plan change does not change provider coverage. Confirm that the feature you need is supported before purchasing.' },
            { question: 'Where can I check a creator’s highlights?', answer: 'Visit the creator’s original Instagram profile and use the access options provided by Instagram. Respect private account restrictions.' },
        ],
    },
    {
        slug: 'instagram-reels-downloader',
        title: 'Instagram Reels Viewer and Download Guide',
        description: 'Find returned public videos by username, understand Pro download access, and solve playback and file-saving problems.',
        tab: 'REELS',
        availability: 'Viewing uses search credits; downloads require Pro in the current interface. The Reels tab groups returned video items and is not a complete Reels catalog. File quality depends on the source.',
        sections: [
            { heading: 'Find a video using the creator’s username', paragraphs: ['Enter the public account handle, not a Reel link. The lookup returns a selection of media for supported accounts. The Reels tab filters that selection for video items; it may include other video posts and can omit older Reels.', 'Play the item you need and check its caption and source before saving it. If it is missing, use the original creator’s profile rather than assuming the video was deleted. This tool does not search Instagram’s full video catalog.'] },
            { heading: 'What the download button saves', paragraphs: ['The download action uses the media URL returned by the provider. It does not retrieve the creator’s original editing project, upscale the footage, or guarantee a particular resolution. Compression, audio availability and embedded watermarks can differ between files.', 'Pro access enables the download control in this interface. It cannot restore a removed video, unlock a private account, or extend the lifetime of an expired media URL. Check the displayed plan terms before purchasing.'] },
            { heading: 'If playback works but saving fails', paragraphs: ['A playable preview and a downloadable file can use different links. If the source URL expires, repeat the lookup later rather than repeatedly pressing Download. A cached response can continue to contain an old URL until it refreshes.'], items: ['On mobile, check your browser’s Downloads list and the Files app before assuming the file is missing.', 'If a video opens in a browser tab, use the browser’s available save option; behavior varies by browser.', 'If the saved file has no audio or lower resolution, compare it with the source. The tool cannot reconstruct missing tracks or detail.', 'For repeated errors, report the time, public handle, browser and visible error through Contact.'] },
            { heading: 'Keep source context when saving references', paragraphs: ['Save the original post link alongside the file so you can find the creator and caption again. A downloaded file by itself can lose publication context, credits or later corrections.', 'The download button does not grant reuse rights. For material you plan to publish or use commercially, obtain permission covering the video and its audio, or use your own licensed material. See the site’s terms and disclaimer.'] },
        ],
        faqs: [
            { question: 'Are downloads free?', answer: 'No. Downloads are a Pro feature in the current interface. Viewing supported returned videos uses search credits.' },
            { question: 'Does the tool remove watermarks or guarantee HD?', answer: 'No. It saves the available media file; existing watermarks and source compression may remain. There is no guaranteed resolution.' },
            { question: 'Can I paste a Reel URL?', answer: 'This search expects an account username or profile URL. Direct Reel-link lookup is not implemented in this interface.' },
        ],
    },
];
