const fs = require('fs');
const path = require('path');

const pages = [
  'anonymous-instagram-viewer',
  'anonymous-instagram-downloader',
  'instagram-story-viewer',
  'instagram-reels-downloader',
  'instagram-profile-viewer',
  'instagram-photo-downloader',
  'instagram-highlights-viewer',
  'instagram-hashtag-generator',
  'posts',
  'pricing'
];

const basePath = path.join(__dirname, 'src', 'app');

for (const p of pages) {
  const filePath = path.join(basePath, p, 'page.tsx');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if it already has alternates
    if (!content.includes('alternates: {')) {
      const metadataMatch = content.match(/(export const metadata:\s*Metadata\s*=\s*{)/);
      if (metadataMatch) {
        content = content.replace(
          metadataMatch[1],
          `${metadataMatch[1]}\n    alternates: {\n        canonical: '/${p}',\n    },`
        );
      } else {
        const metadataMatch2 = content.match(/(export const metadata\s*=\s*{)/);
        if (metadataMatch2) {
            content = content.replace(
            metadataMatch2[1],
            `${metadataMatch2[1]}\n    alternates: {\n        canonical: '/${p}',\n    },`
            );
        }
      }
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${p}`);
    } else {
      console.log(`Skipped ${p} (already has alternates)`);
    }
  } else {
    console.log(`Not found: ${p}`);
  }
}
