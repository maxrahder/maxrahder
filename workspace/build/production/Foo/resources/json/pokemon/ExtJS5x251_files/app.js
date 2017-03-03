Ext.Loader.setPath('Engine', '../Engine/app');
Ext.course = 'ExtJS5x251'; // Kludge so Engine knows the course number
Ext.Loader.setConfig({
    disableCaching: true // true is the default
});
Ext.require('Engine.Application');
Ext.application({
    name: 'ExtJS5x251',
    extend: 'Engine.Application',

    init: function() {

        Engine.Global.javaScriptViewerHeadHtml = ['<link rel="stylesheet" href="resources/stylesheets/screen.css"/>'];

        // What a hack. I couldn't figure out any other way of overriding the property.
        // The package loads AFTER this class, so I had to put it somewhere that would
        // get executed later.
        EditView.view.editview.PreTagEditAndView.prototype.defaultLibrary = 'ext5';
    }
});
