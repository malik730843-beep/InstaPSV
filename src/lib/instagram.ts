/**
 * Instagram Graph API Utility
 * 
 * This utility uses the Instagram Graph API to fetch data.
 * Official Docs: https://developers.facebook.com/docs/instagram-api/guides/business-discovery
 */

const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const BASE_URL = 'https://graph.facebook.com/v21.0';

export interface IGProfile {
    id?: string;
    username: string;
    name?: string;
    biography?: string;
    profile_picture_url?: string;
    followers_count?: number;
    follows_count?: number;
    media_count?: number;
    media?: {
        data: IGMedia[];
    };
    stories?: {
        data: IGMedia[];
    };
}

export interface IGMedia {
    id: string;
    caption?: string;
    media_url: string;
    media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
    timestamp: string;
    permalink: string;
    thumbnail_url?: string;
    like_count?: number;
    comments_count?: number;
}

/**
 * Helper to extract username from Instagram URL
 */
export function parseUsername(input: string): string {
    if (!input) return '';
    let result = input.trim();
    try {
        if (result.includes('instagram.com/')) {
            // Get everything after instagram.com/
            const path = result.split('instagram.com/')[1];
            // Take the first segment (the username)
            const firstPart = path.split('/')[0];
            // Remove any query parameters like ?utm_source=...
            result = firstPart.split('?')[0];
        }
    } catch (e) {
        console.error("URL parsing failed:", e);
    }

    // Clean up @ and spaces
    result = result.replace(/[@]/g, '').trim();
    console.log(`Parsed username from "${input}" -> "${result}"`);
    return result;
}

/**
 * Step 1: Get the Facebook Pages linked to the User
 */
async function getPages() {
    const res = await fetch(`${BASE_URL}/me/accounts?access_token=${ACCESS_TOKEN}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.data; // List of pages
}

/**
 * Step 2: Get the Instagram Business Account ID from a Page ID
 */
async function getIGBusinessAccount(pageId: string) {
    const res = await fetch(`${BASE_URL}/${pageId}?fields=instagram_business_account&access_token=${ACCESS_TOKEN}`);
    const data = await res.json();
    if (data.error) return null;
    return data.instagram_business_account?.id;
}

/**
 * Main function to find your own Business ID
 */
export async function getMyIGBusinessId() {
    try {
        const pages = await getPages();
        if (!pages || pages.length === 0) {
            throw new Error("No Facebook Pages found linked to this account.");
        }

        // Try each page until we find an IG Business Account
        for (const page of pages) {
            const igId = await getIGBusinessAccount(page.id);
            if (igId) return igId;
        }

        throw new Error("No Instagram Business Accounts found linked to your pages.");
    } catch (error) {
        console.error("Error finding IG Business ID:", error);
        return null;
    }
}

/**
 * Business Discovery: Fetch details of ANOTHER public Business/Creator account
 * @param myIgId Your own Business Account ID
 * @param targetUsername The username you want to "scrape"
 */
export async function discoverProfile(myIgId: string, targetUsername: string): Promise<IGProfile | null> {
    const fields = `business_discovery.username(${targetUsername}){username,name,biography,profile_picture_url,followers_count,follows_count,media_count,media{id,caption,media_url,media_type,timestamp,permalink,thumbnail_url,like_count,comments_count},stories{id,caption,media_url,media_type,timestamp,permalink,thumbnail_url}}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s Timeout

    try {
        const res = await fetch(`${BASE_URL}/${myIgId}?fields=${fields}&access_token=${ACCESS_TOKEN}`, {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        const data = await res.json();

        if (data.error) {
            console.error("Business Discovery Error:", data.error.message);
            throw new Error(data.error.message);
        }

        const rawProfile = data.business_discovery;

        // Strict Normalization
        const normalizedProfile: IGProfile = {
            username: rawProfile.username,
            name: rawProfile.name, // Keep name for UI
            biography: rawProfile.biography,
            profile_picture_url: rawProfile.profile_picture_url,
            followers_count: rawProfile.followers_count,
            follows_count: rawProfile.follows_count, // Optional but good to have
            media_count: rawProfile.media_count,
            media: rawProfile.media, // Keep media structure as is for now, or further normalize if needed
            // explicit undefined for stories to ensure we don't accidentally rely on it if not requested
            // Stories are strictly not part of the core cache requirements but good to keep if API returns them.
            // Requirement says: "Username, bio, profile picture, followers count, posts count, public media/posts list"
            // So we strictly return these.
        };

        return normalizedProfile;
    } catch (error: any) {
        if (error.name === 'AbortError') {
            console.error("Fetch Timeout: Meta API took longer than 5s");
            throw new Error("Meta API request timed out");
        }
        console.error("Fetch Error:", error);
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}
