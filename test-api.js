// Test script to verify API endpoints are working
const https = require('https');

const testGeminiAPI = () => {
    const data = JSON.stringify({
        prompt: "Test prompt for API verification"
    });

    const options = {
        hostname: 'calculadora-eta-umber.vercel.app',
        port: 443,
        path: '/api/gemini',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    console.log('🧪 Testing Gemini API endpoint...');
    console.log('URL:', `https://${options.hostname}${options.path}`);

    const req = https.request(options, (res) => {
        console.log('Status Code:', res.statusCode);
        console.log('Headers:', res.headers);

        let responseData = '';
        res.on('data', (chunk) => {
            responseData += chunk;
        });

        res.on('end', () => {
            console.log('Response:', responseData);
            if (res.statusCode === 200) {
                console.log('✅ API is working correctly!');
            } else {
                console.log('❌ API returned error:', res.statusCode);
            }
        });
    });

    req.on('error', (error) => {
        console.error('❌ Request failed:', error);
    });

    req.write(data);
    req.end();
};

// Run the test
testGeminiAPI();
