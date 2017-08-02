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

function indexer(filePath, fn) {
    fs.readFile(filePath, "utf8", function(err, data) {
        if (err) {
            return console.log(err);
        }

        let jsonData = JSON.parse(data);

        for (var i = 0; i < jsonData.data.length; i++) {
            jsonData.data[i].id = (i+1);
        }

        // Visszaírás.        
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 4), "utf8", function(err, data) {
            if (err) {
                return console.log(err);
            }
            console.log("Index done.");
            fn();
        });
    });
}

// Get kérések kiszolgálása.
function getResponse(req, res) {
    if (req.url == "/") {
        sendFile(res, "./view/index.html");
    } else if (apiRegex.test(req.url)) {
        const urlParts = req.url.match(apiRegex)[1].split('/');

        if (urlParts[1] == "index") {
            indexer("./api/"+urlParts[0]+".json", function() {
                res.end("ok");
            });
            return;
        }        

        fs.readFile("./api/"+urlParts[0]+".json", "utf8", function(err, data) {
            if (err) {
                return res.end("file not found");
            }

            // Parse data.
            // Get item from data array by id.
            // Stringify item.
            // Send item to the browser.
            let jsonData = JSON.parse(data);
            if (urlParts.length == 1) {
                return res.end( JSON.stringify(jsonData.data) );
            }

            var clubIndex = {};
            for (i=0; i< jsonData.data.length; i++) {
                
                if (jsonData.data[i].id == urlParts[1]) {
                    clubIndex = (jsonData.data[i]);
                    break;
                }
            }
            res.end(JSON.stringify(clubIndex));          
        });

    } else {
        sendFile(res, "./public" + req.url);
    }
}

// TODO: delete functionality.
function delResponse(req, res) {
    res.end("Delete: "+req.url);
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