const http = require("http");
const fs = require("fs");
const apiRegex = /\/api\/(.*)/;

const server = http.createServer( function(req, res) {
    console.log(req.url);
    let method = req.method.toLowerCase();
    switch(method) {
        case "get": getResponse(req, res);
            break;
        case "post": postResponse(req, res);
            break;
        case "put": putResponse(req, res);
            break;
        case "delete": delResponse(req, res);
            break;
        default: res.end();
    }
});

// Get kérések kiszolgálása.
function getResponse(req, res) {
    if (req.url == "/") {
        sendFile(res, "./view/index.html");
    } else if (apiRegex.test(req.url)) {
        let urlParts = req.url.match(apiRegex)[1].split('/');
        fs.readFile("./api/"+urlParts[0]+".json", "utf8", function(err, data) {
            if (err) {
                return res.end("file not found");
            }
            res.end( data );            
        });

    } else {
        sendFile(res, "./public" + req.url);
    }
}

// Index file kiszolgálása.
function sendFile(res, filePath) {
    fs.readFile(filePath, "utf8", function(err, data) {
        if (err) {
            console.log(err);
            return res.end("file not found");
        }

        res.end(data);
    });
}

server.listen(3333);