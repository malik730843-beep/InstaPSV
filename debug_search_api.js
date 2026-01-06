
const http = require('http');

const url = 'http://localhost:3000/api/profile/search?username=sumaiyyabukhshofficial';

console.log("Fetching from:", url);

http.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
                console.error("API Error:", parsed.error);
            } else {
                console.log("Username:", parsed.username);
                console.log("Stories Count:", parsed.stories ? parsed.stories.data?.length : 'UNDEFINED');
                // Check highlights too just in case
                console.log("Highlights Count:", parsed.highlights ? parsed.highlights.data?.length : 'UNDEFINED');
            }
        } catch (e) {
            console.log("Response text:", data);
        }
    });

}).on('error', (err) => {
    console.error('Error:', err.message);
});
