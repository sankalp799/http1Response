const http = require('http');
const fs = require('fs');
const url = require('url');
const path= require('path');
const routers = require('./http-routers.list');
let stringDecoder = require('string_decoder').StringDecoder;
let controller = require('./controller.js')

let parseJsonObj = (data) => {
    try{
        let obj = JSON.parse(data);
        return obj;
    }catch(e){
        console.log(e.message);
        return {};
    }
};

let mainServer = (req, res) => {
    let parsedURL = url.parse(req.url, true);
    let pathname = parsedURL.pathname;
    pathname = pathname.replace(/^\/+|\/+$/g, '');
    console.log(`path: ${pathname}`);

    let query = parsedURL.query;
    let header = req.headers;
    let method = req.method.toLowerCase();
    let buffer = "";
    let decoder = new stringDecoder('UTF-8');

    req.on('data', (data) => {
        buffer += decoder.write(data);
    });

    req.on('end', () => {
        buffer += decoder.end();

        // chose handler
        let handler = typeof(routers[pathname]) !== 'undefined' ? routers[pathname] : controller.notFound;

        handler = pathname.indexOf('public/') > -1 ? controller.public : handler;
        
        let data = {
            path: pathname,
            method: method,
            query: query,
            headers: header,
            payload: parseJsonObj(buffer),
        };

        handler(data, (statusCode, payload, type) => {
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            type = typeof(type) == 'string' ? type.toLocaleLowerCase() : 'json';
            
            if(type=='json'){
                payload = JSON.stringify(payload);
            }
            if(type == 'favicon'){
                res.setHeader('Content-Type', 'image/x-icon');
                payload = typeof(payload) !== 'undefined' ? payload : '';
            }
            if(type == 'html'){
                res.setHeader('Content-Type', 'text/html');
                payload = typeof(payload) == 'string' ? payload : "";
            }
            if(type == 'js'){
                res.setHeader('Content-Type', 'text/javascript');
                payload = typeof(payload) !== 'undefined' ? payload : '';
            }
            if(type == 'css'){
                res.setHeader('Content-Type', 'text/css');
                payload = typeof(payload) !== 'undefined' ? payload : '';
            }
            if(type == 'png'){
                res.setHeader('Content-Type', 'image/png');
                payload = typeof(payload) !== 'undefined' ? payload : '';
            }
            if(type == 'jpg'){
                res.setHeader('Content-Type', 'image/png');
                payload = typeof(payload) !== 'undefined' ? payload : '';
            }
            
            res.writeHead(statusCode);
            res.end(payload);

            if(statusCode == 200)
                 console.log('\x1b[32m%s\x1b[0m', method.toUpperCase() + ' /' + pathname + ' ' + statusCode);
            else
                console.log('\x1b[31m%s\x1b[0m', method.toUpperCase() + ' /' + pathname + ' ' + statusCode);

        });
    });

};

let server = http.createServer(mainServer);


server.listen(3000, (err) => {
    if(!err)
        console.log(`Server listening to port: ${process.env.port || 3000}`);
    else
        console.log('[ERROR] ' + err.message);
});