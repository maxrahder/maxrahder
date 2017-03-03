// >node index.js
// >nodemon index.js
// To edit the slide deck, use a terminal window and navigate to the backend/
// directory, and start the backend app via "node index.js". The server listens
// on port 3000. To debug, use "nodemon index.js", which will monitor changes to
// source and restart the server automatically.


var bodyParser = require("body-parser");
var express = require('express');

var app = express();

app.use(bodyParser.json({
    limit: '5mb'
})); // support json encoded bodies

setupCORS(app);

app.get('/', function(req, res) {
    res.send('Hello World!');
});


// OPEN IN ATOM
// Required request query fields: app, id, language
var openInEditor = require('./openInEditor');
app.post('/openInEditor', function(req, res) {
    openInEditor(req, res);
});

// SAVE NODE
// Required request query fields: app, id, data
// Node saved to Foo/resources/pages/nodes/2015-05-27_15-17_30-242_Z.json
var saveNode = require('./saveNode');
app.post('/saveNode', function(req, res) {
    saveNode(req, res);
});

// SAVE CONTENT
// Required request query fields: app, id, data
// Node saved to something like Foo/resources/pages/content/_default/2015-05-27_15-17_30-242_Z.md
var saveContent = require('./saveContent');
app.post('/saveContent', function(req, res) {
    saveContent(req, res);
});

// SAVE TREE
// Required request query fields: app, data
// Node saved to Foo/resources/pages/tree.json
var saveTree = require('./saveTree');
app.post('/saveTree', function(req, res) {
    saveTree(req, res);
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});

// ---------------------

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
