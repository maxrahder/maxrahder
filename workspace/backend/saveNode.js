console.log('loading saveNode');

var fs = require("fs");
var file = require("file");

module.exports = saveNode;

function saveNode(req, res) {
    console.log('running saveNode');

    var b = req.body;

    var id = b.id;
    var data = b.data;
    var app = b.app;

    var path = '../' + app + '/resources/pages/nodes/' + id + '.json';
    console.log('\nSaving ' + path);
    fs.writeFile(path, data, 'utf8', function() {
        console.log('after fs.writeFile');
        res.send('after fs.writeFile');
    });

}
