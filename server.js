const express = require('express');
const app = express();
const PORT = 4000;
const cors = require('cors')
const fs = require('fs')

let https = require('https');
let subscriptionKey = '2c4e20faf74b44a9aaba249757131c56';

let host = 'api.cognitive.microsoft.com';
let path = '/bing/v7.0/search';

app.use(express.static('app'));
app.use(express.static('build/contracts'));
app.use(cors())

app.get('/file', (req, res) => {
  let file = fs.readFileSync("./data/convertcsv.json");
  res.json(JSON.parse(file));
})

app.get('/api', (req, res) => {
    let term = req.query.term;
    console.log('Searching the Web for: ' + term);
    let request_params = {
            method : 'GET',
            hostname : host,
            path : path + '?q=' + encodeURIComponent(term),
            headers : {
                'Ocp-Apim-Subscription-Key' : subscriptionKey,
            }
    };

    let req2 = https.request(request_params, function (response) {
        let body = '';
        response.on('data', function (d) {
            body += d;
        });
        response.on('end', function () {
            console.log('\nRelevant Headers:\n');
            for (var header in response.headers)
                // header keys are lower-cased by Node.js
                if (header.startsWith("bingapis-") || header.startsWith("x-msedge-"))
                     console.log(header + ": " + response.headers[header]);
            body = JSON.parse(body);
            res.json(body.images.value);
        });
        response.on('error', function (e) {
            console.log('Error: ' + e.message);
        });
    });
    req2.end();
});

app.listen(PORT, () => {
    console.log(`app is running on ${PORT}`)
})
