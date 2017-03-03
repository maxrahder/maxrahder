console.log('loading saveTree');

var fs = require("fs");
var file = require("file");

module.exports = saveTree;

function saveTree(req, res) {
    console.log('running saveTree');

    var b = req.body;
    var data = b.data;
    var app = b.app;

    var path = '../' + app + '/resources/pages/tree.json';
    console.log('\nSaving ' + path);
    fs.writeFile(path, data, 'utf8', function() {
        console.log('after fs.saveTree');
        res.send('after fs.saveTree');
    });

}
