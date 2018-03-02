'use strict';

let https = require('https');
// let fetch = require('node-fetch');
let subscriptionKey = '2c4e20faf74b44a9aaba249757131c56';

let host = 'api.cognitive.microsoft.com';
let path = '/bing/v7.0/search';

let term = 'Virat Kohli';

let response_handler = function (response) {
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
        console.log(body.images.value.map(i => i.contentUrl));
        return new Promise(body);
    });
    response.on('error', function (e) {
        console.log('Error: ' + e.message);
    });
};

let bing_web_search = function (search) {
  console.log('Searching the Web for: ' + term);
  let request_params = {
        method : 'GET',
        hostname : host,
        path : path + '?q=' + encodeURIComponent(search),
        headers : {
            'Ocp-Apim-Subscription-Key' : subscriptionKey,
        }
    };

    let req = https.request(request_params, response_handler);
    req.end();
}


// let response_handler = function (response) {
//     let body = '';
//     response.on('data', function (d) {
//         body += d;
//     });
//     response.on('end', function () {
//         console.log('\nRelevant Headers:\n');
//         for (var header in response.headers)
//             // header keys are lower-cased by Node.js
//             if (header.startsWith("bingapis-") || header.startsWith("x-msedge-"))
//                  console.log(header + ": " + response.headers[header]);
//         body = JSON.parse(body);
//         console.log(body.images.value.map(i => i.contentUrl));
//         return body;
//     });
//     response.on('error', function (e) {
//         console.log('Error: ' + e.message);
//     });
// };

// let bing_web_search = function (search) {
//     console.log('Searching the Web for: ' + term);
//     let request_params = {
//         method : 'GET',
//         headers : {
//             'Ocp-Apim-Subscription-Key' : subscriptionKey,
//         }
//     };
//     let url = host + path + '?q=' + encodeURIComponent(search);
//     return fetch(url, request_params)
//     .then(res => res.json());
// }

module.exports = bing_web_search