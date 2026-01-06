const http = require('http');

const url = 'http://localhost:3000/api/instagram/profile?username=https://www.instagram.com/sumaiyyabukhshofficial?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==';

http.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            console.log("Username:", parsed.username);
            console.log("Stories:", JSON.stringify(parsed.stories, null, 2));
        } catch (e) {
            console.log("Response text:", data);
        }
    });

}).on('error', (err) => {
    console.error('Error:', err.message);
});
