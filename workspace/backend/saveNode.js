console.log('loading saveNode');

var fs = require("fs");
var file = require("file");

module.exports = saveNode;

function saveNode(req, res) {
    console.log('running saveNode');

    var id = req.query.id;
    var app = req.query.app;
    var data = decodeURI(req.query.data);

    var path = '../' + app + '/resources/pages/nodes/' + id + '.json';
    console.log('\nSaving ' + path);
    console.log(data);
    fs.writeFile(path, data, 'utf8', function() {
        console.log('after fs.writeFile');
        res.send('after fs.writeFile');
    });


};
