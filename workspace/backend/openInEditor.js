var oie = require('open-in-editor');
var fs = require("fs");
var makeDirPath = require("mkdirp");

module.exports = openInEditor;

var editor = oie.configure({
    editor: 'atom'
}, function(err) {
    console.error('Something went wrong: ' + err);
});

// If the file already exists, just open it in the editor.
// If it does NOT, then copy the _default version to the
// language folder, and edit that.

function openInEditor(req, res) {
    // Request must specify: id, app, language, resulting in opening
    // var path = '../' + app + '/resources/pages/content/' + language + '/' + id + '.md';
    // If the _default does not exist, create it.
    // If the file does not exist
    //     o create it
    //     o If there is a _default, copy its content
    var b = req.body;

    var defaultContent = getFileContent(b.app, '_default', b.id);
    var content = getFileContent(b.app, b.language, b.id, defaultContent);

    var path = getPathAndFile(b.app, b.language, b.id);
    editor.open(path)
        .then(function() {
            console.log('Success opening ' + path + ' in Atom.');
        }, function(err) {
            console.error('Something went wrong opening ' + path + 'in Atom.\n' + err);
        });

}

function getFileContent(app, language, id, defaultContent) {
    // Returns the contents of the file. If the file does not exist, it is created.
    defualtContent = (defaultContent || '');
    languagePath = getPath(app, language);
    var result = '';
    if (!fs.existsSync(languagePath)) {
        makeDirPath.makeDirPathSync(languagePath);
    }
    languagePathFile = getPathAndFile(app, language, id);
    if (fs.existsSync(languagePathFile)) {
        result = fs.readFileSync(languagePathFile);
    } else {
        fs.writeFileSync(languagePathFile, defaultContent); // Create if it doesn't exist, fails if path does not exist.
        result = defaultContent;
    }
    return result;
}

function getPath(app, language) {
    return '../' + app + '/resources/pages/content/' + language;
}

function getPathAndFile(app, language, id) {
    return getPath(app, language) + '/' + id + '.md';
}
