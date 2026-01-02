const https = require('https');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('\n🔐 Instagram Long-Lived Token Generator\n');
console.log('You will need:');
console.log('1. App ID (from Meta Developers)');
console.log('2. App Secret (from Meta Developers)');
console.log('3. Short-Lived Token (from Graph API Explorer)\n');

const ask = (query) => new Promise((resolve) => rl.question(query, resolve));

async function generateToken() {
    try {
        const appId = await ask('Enter App ID: ');
        const appSecret = await ask('Enter App Secret: ');
        const shortToken = await ask('Enter Short-Lived Token: ');

        console.log('\nExchanging token...');

        const url = `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortToken}`;

        https.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const json = JSON.parse(data);

                    if (json.error) {
                        console.error('\n❌ Error:', json.error.message);
                    } else if (json.access_token) {
                        console.log('\n✅ SUCCESS! Here is your Long-Lived Token (valid for ~60 days):\n');
                        console.log(json.access_token);
                        console.log('\n👉 Copy this token and update your .env.local file:');
                        console.log(`INSTAGRAM_ACCESS_TOKEN=${json.access_token}`);
                    } else {
                        console.log('\nUnknown response:', json);
                    }
                } catch (e) {
                    console.error('Error parsing response:', e);
                }
                rl.close();
            });

        }).on('error', (err) => {
            console.error('Error making request:', err.message);
            rl.close();
        });

    } catch (err) {
        console.error(err);
        rl.close();
    }
}

generateToken();
