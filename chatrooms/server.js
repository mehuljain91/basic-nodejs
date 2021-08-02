const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const cache = {};

const send404 = (res) => {
    res.writeHead(404, { "Content-Type": "text/plain" })
    res.write('Error 404: resource not found')
    res.end();
}

const sendFile = (res, filePath, fileContents) => {
    res.writeHead(200, { "Content-Type": mime.getType(path.basename(filePath)) });
    res.end(fileContents);
}

const serveStatic = (res, cache, absPath) => {
    if (cache[absPath]) {
        sendFile(res, absPath, cache[absPath])
    } else {
        fs.exists(absPath, (exists) => {
            if (exists) {
                fs.readFile(absPath, (err, data) => {
                    if (err) {
                        send404(res)
                    } else {
                        cache[absPath] = data;
                        sendFile(res, absPath, data)
                    }
                })
            } else {
                send404(res);
            }
        })
    }
}

const server = http.createServer((req, res) => {
    let filePath = false;
    if (req.url === '/') {
        filePath = 'public/index.html'
    } else {
        filePath = 'public' + req.url;
    }

    const absPath = './' + filePath;
    serveStatic(res, cache, absPath)
})

server.listen(5000, () => {
    console.log("Listening at 5000...")
})

const chatServer = require('./lib/chat_server');
chatServer.listen(server)