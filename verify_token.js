
const fs = require('fs');
const path = require('path');

// 1. Manually load .env.local because dotenv might not be installed
const envPath = path.resolve(process.cwd(), '.env.local');
let accessToken = '';

try {
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/^INSTAGRAM_ACCESS_TOKEN=["']?(.*?)["']?$/m);
        if (match) {
            accessToken = match[1].trim();
            // Remove quotes if present explicitly (though regex handles capturing group inside quotes)
            if ((accessToken.startsWith('"') && accessToken.endsWith('"')) ||
                (accessToken.startsWith("'") && accessToken.endsWith("'"))) {
                accessToken = accessToken.slice(1, -1);
            }
        }
    }
} catch (e) {
    console.error("Error reading .env.local:", e);
}

if (!accessToken) {
    console.error("❌ No INSTAGRAM_ACCESS_TOKEN found in .env.local");
    process.exit(1);
}

console.log(`Checking token from file: ${accessToken.substring(0, 10)}...`);

// 2. Test the token against Instagram API
// Using 'me' endpoint which requires a valid token
const url = `https://graph.facebook.com/v21.0/me?fields=id,name&access_token=${accessToken}`;

fetch(url)
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            console.error("❌ Token Verification Failed:");
            console.error(JSON.stringify(data.error, null, 2));
            process.exit(1);
        } else {
            console.log("✅ Token is VALID!");
            console.log("User ID:", data.id);
            console.log("User Name:", data.name);
            process.exit(0);
        }
    })
    .catch(err => {
        console.error("❌ Network or Script Error:");
        console.error(err);
        process.exit(1);
    });
