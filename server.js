const http = require("http");
const fs = require("fs");
const apiRegex = /\/api\/(.*)/;

var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'football',
  password : 'Exz2Vcc9GJFYVe78',
  database : 'football'
});
 
connection.connect();

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
        // Select írása.
        // Az eredmény visszaküldése stringify formátumban.
        connection.query(`SELECT * FROM ${urlParts[0]}`, function(err, results) {
            res.end(JSON.stringify(results));
        })
        

    } else {
        sendFile(res, "./public" + req.url);
    }
}

// TODO: delete functionality.
function delResponse(req, res) {
    res.end("Delete: "+req.url);
}

// Handle Post request.
function postResponse(req, res) {
    var data = "";
    req.on('data', function(pack) {
        data += pack;
    });
    req.on('end', function() {
        res.end( data );
    });
}

// Create new record.
function putResponse(req, res) {
    var data = "";
    req.on('data', function(pack) {
        data += pack;
    });
    req.on('end', function() {
        data = JSON.parse(data);
        let q = `
            INSERT INTO club (name, code, fkey)
            VALUES ('${data.name}', '${data.code}', '${data.key}');        
        `;

        connection.query(q, function(err, results){
            res.end( JSON.stringify(results) );
        });
        
    
    });
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