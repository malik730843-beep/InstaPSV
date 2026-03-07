
const fs = require('fs');
const path = require('path');
const envPath = path.resolve(process.cwd(), '.env.local');

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    console.log('File length:', envContent.length);
    console.log('First 50 chars:', JSON.stringify(envContent.substring(0, 50)));
    const regex = /^INSTAGRAM_ACCESS_TOKEN=["']?(.*?)["']?$/m;
    const match = envContent.match(regex);
    console.log('Match found:', !!match);
    if (match) {
        console.log('Captured group 1:', JSON.stringify(match[1]));
    }
} else {
    console.log('File does not exist');
}
