var fs = require("fs");
var file = require("file");
var express = require('express');

var app = express();

setupCORS(app);

app.get('/', function(req, res) {
    res.send('Hello World!');
});

// Required request query fields: app, language, id
// saveContent?id=2015-05-27_15-17_30-242_Z.md&language=_default&app=foo
// Content saved to Foo/resources/pages/content/_default/2015-05-27_15-17_30-242_Z.md
app.get('/saveContent', function(req, res) {
    saveFile(req, res);
});

// Required request query fields: app, id, data
// saveContent?id=2015-05-27_15-17_30-242_Z&app=foo&data={foo=bar}
// Node saved to Foo/resources/pages/nodes/2015-05-27_15-17_30-242_Z.json
app.get('/saveNode', function(req, res) {
    saveNode(req, res);
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});

function saveNode(req, res) {
    var id = req.query.id;
    var app = req.query.app;
    var data = decodeURI(req.query.data);
    var path = '../' + app + '/resources/pages/nodes/_test.json';
    console.log('Saving ' + path);
    console.log(data);
    fs.writeFile(path, data, 'utf8', function() {
        console.log('after fs.writeFile');
        res.send('after fs.writeFile');
    });
};

function saveFile(req, res) {
    console.log(req.query);
    var file = req.query.file;
    var s = '{foo=bar}';
    var path = '../temp/' + file;
    res.send('Attempting to write to ' + path);
    // if (file) {
    //     fs.writeFile(path, s, 'utf8', function() {
    //         console.log('after fs.writeFile');
    //         // res.send('after fs.writeFile');
    //     });
    // }
}


function setupCORS(app) {
    // TODO: We're allowing anyone to use the service. This would be dangerous if
    // we weren't just running locally. In theory, we should set the origin
    // to be limited to localhost:1841.
    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
        res.header('Access-Control-Expose-Headers', 'Content-Length');
        res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
        if (req.method === 'OPTIONS') {
            return res.sendStatus(200);
        } else {
            return next();
        }
    });
}
