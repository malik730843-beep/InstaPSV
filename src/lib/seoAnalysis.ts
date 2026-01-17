export interface SEOIssue {
    type: 'critical' | 'warning' | 'good';
    message: string;
    details?: string;
}

export interface SEOAnalysisResult {
    score: number;
    issues: SEOIssue[];
    stats: {
        wordCount: number;
        keywordDensity: number;
        readingTime: number;
    };
}

// Power words list (truncated for brevity, can be expanded)
const POWER_WORDS = [
    'amazing', 'ultimate', 'exclusive', 'essential', 'proven', 'secret', 'powerful',
    'instant', 'expert', 'guide', 'complete', 'new', 'best', 'top', 'review',
    'how to', 'why', 'what', 'hack', 'trick', 'strategy', 'master', 'simple'
];

// Positive sentiment words
const POSITIVE_WORDS = [
    'good', 'great', 'excellent', 'amazing', 'love', 'best', 'better', 'success',
    'win', 'happy', 'positive', 'perfect', 'beautiful', 'easy', 'simple', 'grow',
    'improve', 'boost', 'benefit', 'safe', 'secure', 'trust', 'strong'
];

// Negative sentiment words (sometimes good for urgency/problems)
const NEGATIVE_WORDS = [
    'bad', 'worst', 'stop', 'avoid', 'never', 'fail', 'mistake', 'error', 'danger',
    'risk', 'warn', 'scam', 'loss', 'difficult', 'hard', 'weak', 'problem', 'fix'
];

export function calculateSEOScore(
    content: string,
    keyword: string,
    title: string,
    description: string,
    slug: string
): SEOAnalysisResult {
    const issues: SEOIssue[] = [];
    let score = 0;

    // Normalize inputs
    const cleanContent = content.replace(/<[^>]*>/g, ' '); // simple strip tags
    const lowerContent = cleanContent.toLowerCase();
    const lowerKeyword = keyword.toLowerCase().trim();
    const lowerTitle = title.toLowerCase().trim();
    const lowerDesc = description.toLowerCase().trim();
    const lowerSlug = slug.toLowerCase().trim();

    const wordCount = cleanContent.split(/\s+/).filter(w => w.length > 0).length;
    const readingTime = Math.ceil(wordCount / 200);

    // 1. Keyword Focus (Critical)
    if (!lowerKeyword) {
        issues.push({ type: 'critical', message: 'No focus keyword set.' });
        return { score: 0, issues, stats: { wordCount, keywordDensity: 0, readingTime } };
    }

    // 2. Keyword in Title (10 pts)
    if (lowerTitle.includes(lowerKeyword)) {
        score += 10;
        issues.push({ type: 'good', message: 'Focus keyword found in SEO Title.' });
    } else {
        issues.push({ type: 'critical', message: 'Focus keyword not found in SEO Title.' });
    }

    // 3. Keyword at beginning of Title (5 pts)
    if (lowerTitle.startsWith(lowerKeyword)) {
        score += 5;
        issues.push({ type: 'good', message: 'Focus keyword appears at the beginning of SEO Title.' });
    }

    // 4. Keyword in Meta Description (10 pts)
    if (lowerDesc.includes(lowerKeyword)) {
        score += 10;
        issues.push({ type: 'good', message: 'Focus keyword found in Meta Description.' });
    } else {
        issues.push({ type: 'critical', message: 'Focus keyword not found in Meta Description.' });
    }

    // 5. Keyword in URL (10 pts)
    if (lowerSlug.includes(lowerKeyword.replace(/\s+/g, '-'))) {
        score += 10;
        issues.push({ type: 'good', message: 'Focus keyword found in URL.' });
    } else {
        issues.push({ type: 'warning', message: 'Focus keyword not found in URL slug.' });
    }

    // 6. Keyword in Content (10 pts)
    const keywordCount = (lowerContent.match(new RegExp(lowerKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    const keywordDensity = (keywordCount / (wordCount || 1)) * 100;

    if (keywordCount > 0) {
        score += 10;
        issues.push({ type: 'good', message: 'Focus keyword found in content.' });

        // Density Check (Optimal: 0.5% - 2.5%)
        if (keywordDensity >= 0.5 && keywordDensity <= 2.5) {
            score += 5;
            issues.push({ type: 'good', message: `Keyword density is good (${keywordDensity.toFixed(2)}%).` });
        } else if (keywordDensity > 2.5) {
            issues.push({ type: 'warning', message: `Keyword density is high (${keywordDensity.toFixed(2)}%). Try to reduce it.` });
        } else {
            issues.push({ type: 'warning', message: `Keyword density is low (${keywordDensity.toFixed(2)}%).` });
        }
    } else {
        issues.push({ type: 'critical', message: 'Focus keyword not found in content.' });
    }

    // 7. Keyword in Introduction (First 10% or 100 words) (5 pts)
    const introText = lowerContent.substring(0, Math.min(lowerContent.length, 500));
    if (introText.includes(lowerKeyword)) {
        score += 5;
        issues.push({ type: 'good', message: 'Focus keyword found in introduction.' });
    } else {
        issues.push({ type: 'warning', message: 'Focus keyword not found in the first 10% of content.' });
    }

    // 8. Content Length (10 pts)
    if (wordCount >= 600) {
        score += 10;
        issues.push({ type: 'good', message: `Content is ${wordCount} words long. Good job!` });
    } else if (wordCount >= 300) {
        score += 5;
        issues.push({ type: 'warning', message: `Content is ${wordCount} words. Recommended minimum is 600 words.` });
    } else {
        issues.push({ type: 'critical', message: `Content is too short (${wordCount} words). Minimum 600 words recommended.` });
    }

    // 9. Check Heading tags presence (5 pts)
    if (content.match(/<h[2-6]/i)) {
        score += 5;
        issues.push({ type: 'good', message: 'Subheadings detected.' });
    } else {
        issues.push({ type: 'warning', message: 'No subheadings (H2, H3, etc) found. Use them to structure your content.' });
    }

    // 10. External Links (5 pts)
    // Matches <a href="http..." but excludes current domain or relative links (heuristic)
    if ((content.match(/href="https?:\/\/(?!instapsv\.com)/gi) || []).length > 0) {
        score += 5;
        issues.push({ type: 'good', message: 'External links found.' });
    } else {
        issues.push({ type: 'warning', message: 'No external outbound links found. Add regular links to high-authority sites.' });
    }

    // 11. Internal Links (5 pts)
    if ((content.match(/href="(\/|https:\/\/instapsv\.com)/gi) || []).length > 0) {
        score += 5;
        issues.push({ type: 'good', message: 'Internal links found.' });
    } else {
        issues.push({ type: 'warning', message: 'No internal links found. Link to other posts on your site.' });
    }

    // 12. Power Word in Title (Premium) (5 pts)
    const hasPowerWord = POWER_WORDS.some(pw => lowerTitle.includes(pw));
    if (hasPowerWord) {
        score += 5;
        issues.push({ type: 'good', message: 'Title contains power words. Good for CTR!' });
    } else {
        issues.push({ type: 'warning', message: 'Title lacks power words. Add words like "Best", "Review", "Guide", "Ultimate".' });
    }

    // 13. Sentiment Analysis (Premium) (5 pts)
    // Heuristic: Check density of positive/negative words vs total words
    const positiveCount = POSITIVE_WORDS.filter(w => lowerContent.includes(w)).length;
    const negativeCount = NEGATIVE_WORDS.filter(w => lowerContent.includes(w)).length;

    if (positiveCount > 0 || negativeCount > 0) {
        score += 5;
        // Just acknowledging presence is enough for "Sentiment" check usually
        const tone = positiveCount > negativeCount ? 'Positive' : (negativeCount > positiveCount ? 'Negative/Urgent' : 'Neutral');
        issues.push({ type: 'good', message: `Content sentiment appears to be ${tone}.` });
    }

    // 14. Title Length (5 pts)
    if (title.length >= 30 && title.length <= 60) {
        score += 5;
        issues.push({ type: 'good', message: 'Title length is optimal.' });
    } else {
        issues.push({ type: 'warning', message: `Title is ${title.length} chars. Optimal is 30-60 characters.` });
    }

    return {
        score: Math.min(100, score),
        issues: issues.sort((a, b) => {
            // Sort critical first
            if (a.type === 'critical' && b.type !== 'critical') return -1;
            if (a.type !== 'critical' && b.type === 'critical') return 1;
            if (a.type === 'warning' && b.type === 'good') return -1;
            if (a.type === 'good' && b.type === 'warning') return 1;
            return 0;
        }),
        stats: {
            wordCount,
            keywordDensity,
            readingTime
        }
    };
}
