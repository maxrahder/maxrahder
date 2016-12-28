var fs = require("fs");
var file = require("file");

file.walk('./Nouveau/Data', function(o, path, dirs, files) {
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (file.match(/.json$/)) {
            readFile(files[i]);
        }
    }
});

function readFile(fileName) {
    fs.readFile(
        fileName,
        'utf8',
        function(error, contents) {
            var data = convertItem(JSON.parse(contents));
            var s = JSON.stringify(data);
            // console.log(s);
            // console.log('\n');
            fs.writeFile(('./Temp/' + fileName), s, 'utf8', function() {
                console.log('after fs.writeFile');
            });
        }
    );
}

function convertItem(item) {
    var o = {
        id: item.fileId,
        i18n: {
            _default: {
                "title": item.text,
                "translated": true
            }
        }
    };
    if (item.children) {
        o.children = [];
        for (var i = 0; i < item.children.length; i++) {
            o.children.push(item.children[i]);
        }
    } else {
        item.leaf = true;
    }
    return o;
}
