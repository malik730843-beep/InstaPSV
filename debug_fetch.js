const http = require('http');

const url = 'http://localhost:3000/api/instagram/profile?username=cristiano';

http.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log(data);
    });

}).on('error', (err) => {
    console.error('Error:', err.message);
});
