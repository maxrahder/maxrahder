var oie = require('open-in-editor');

module.exports = openInEditor;

var editor = oie.configure({
    editor: 'atom'
}, function(err) {
    console.error('Something went wrong: ' + err);
});

function openInEditor(req, res) {
    // Request must specify: id, app, language, resulting in opening
    // var path = '../' + app + '/resources/pages/content/' + language + '/' + id + '.md';

    var b = req.body;
    var path = '../' + b.app + '/resources/pages/content/' + b.language + '/' + b.id + '.md';

    editor.open(path)
        .then(function() {
            console.log('Success opening ' + path);
        }, function(err) {
            console.error('Something went wrong opening ' + path + '\n' + err);
        });
}
