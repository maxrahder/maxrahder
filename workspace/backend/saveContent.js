console.log('loading saveContent');

var fs = require("fs");
var file = require("file");

module.exports = saveContent;

function saveContent(req, res) {
    console.log('running saveContent');

    var b = req.body;

    var id = b.id;
    var data = b.data;
    var app = b.app;
    var language = b.language;

    var path = '../' + app + '/resources/pages/content/' + language + '/' + id + '.md';
    console.log('\nSaving ' + path);
    fs.writeFile(path, data, 'utf8', function() {
        console.log('after saveContent');
        res.send('after saveContent');
    });

}
