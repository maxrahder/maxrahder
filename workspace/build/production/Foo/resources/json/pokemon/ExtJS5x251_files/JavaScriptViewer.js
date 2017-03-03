/*
A JavaScriptViewer is the iframe that contains specified JavaScript.

If it immutable -- as you create it you specify library URLs and the JavaScript being rendered.
All configs are required.
*/
Ext.define('EditView.view.editview.JavaScriptViewer', {

    extend: 'Ext.ux.IFrame',
    xtype: 'javascriptviewer',

    statics: {
        touch2: {
            libraryHeadHtml: [
                '<link rel="stylesheet" href="//extjs.cachefly.net/touch/sencha-touch-2.4.1/resources/css/sencha-touch.css">'
            ],
            scriptUrls: ['//extjs.cachefly.net/touch/sencha-touch-2.4.1/sencha-touch-all.js'],
            wrapTheCode: 'Ext.application({ name: "LivePreview", launch: function() {\n{0}\n}});'
        },
        ext4: {
            libraryHeadHtml: ['<link rel="stylesheet" href="//extjs.cachefly.net/ext/gpl/4.2.1/resources/css/ext-all-neptune.css">'],
            scriptUrls: ['//extjs.cachefly.net/ext/gpl/4.2.1/ext-all-rtl.js'],
            wrapTheCode: 'Ext.application({ name: "LivePreview", launch: function() {\n{0}\n}});'
        },
        ext5: {
            libraryHeadHtml: [
                '<link rel="stylesheet" href="//cdn.sencha.com/ext/commercial/5.1.1/build/packages/ext-theme-crisp/build/resources/ext-theme-crisp-all.css">',
                '<link rel="stylesheet" href="//cdn.sencha.com/ext/commercial/5.1.1/build/packages/ext-ux/build/crisp/resources/ext-ux-all.css">',
                '<link rel="stylesheet" href="//cdn.sencha.com/ext/commercial/5.1.1/build/packages/sencha-charts/build/crisp/resources/sencha-charts-all.css">',
                '<link rel="stylesheet" href="resources/stylesheets/screen.css">'
            ],
            scriptUrls: [
                '//cdn.sencha.com/ext/commercial/5.1.1/build/ext-all.js',
                '//cdn.sencha.com/ext/commercial/5.1.1/build/packages/sencha-charts/build/sencha-charts.js',
                '//cdn.sencha.com/ext/commercial/5.1.1/build/packages/ext-ux/build/ext-ux.js',
                '//cdn.sencha.com/ext/commercial/5.1.1/build/packages/ext-theme-crisp/build/ext-theme-crisp.js'
            ],
            wrapTheCode: 'Ext.application({ name: "LivePreview", launch: function() {\n{0}\n}});'
        },
        classic: {
            libraryHeadHtml: [

                '<link rel="stylesheet" href="//training.sencha.com/student/ext-6.0.0/build/classic/theme-triton/resources/theme-triton-all.css">',
                '<link rel="stylesheet" href="//training.sencha.com/student/ext-6.0.0/build/packages/ux/classic/classic/resources/ux-all.css">',
                '<link rel="stylesheet" href="//training.sencha.com/student/ext-6.0.0/build/packages/charts/classic/classic/resources/charts-all.css">',
                '<link rel="stylesheet" href="resources/stylesheets/screen.css">',

                '<link rel="stylesheet" href="//training.sencha.com/student/ext-6.0.0.415/pivot/build/neptune/resources/pivot-all.css">'

            ],
            scriptUrls: [

                '//training.sencha.com/student/ext-6.0.0/build/ext-all.js',
                '//training.sencha.com/student/ext-6.0.0/build/classic/theme-triton/theme-triton.js',
                '//training.sencha.com/student/ext-6.0.0/build/packages/charts/classic/charts.js',
                '//training.sencha.com/student/ext-6.0.0/build/packages/ux/classic/ux.js',

                '//training.sencha.com/student/ext-6.0.0.415/pivot/build/pivot.js'

            ],
            wrapTheCode: 'Ext.application({ name: "LivePreview", launch: function() {\n{0}\n}});'
        },
        modern: {
            libraryHeadHtml: [

                '<link rel="stylesheet" href="//training.sencha.com/student/ext-6.0.0/build/modern/theme-neptune/resources/theme-neptune-all.css">',
                '<link rel="stylesheet" href="//training.sencha.com/student/ext-6.0.0/build/packages/ux/modern/modern-neptune/resources/ux-all.css">',
                '<link rel="stylesheet" href="//training.sencha.com/student/ext-6.0.0/build/packages/charts/modern/modern-neptune/resources/charts-all.css">',
                '<link rel="stylesheet" href="resources/stylesheets/screen.css">'

            ],
            scriptUrls: [

                '//training.sencha.com/student/ext-6.0.0/build/ext-modern-all.js',
                '//training.sencha.com/student/ext-6.0.0/build/modern/theme-neptune/theme-neptune.js',
                '//training.sencha.com/student/ext-6.0.0/build/packages/charts/modern/charts.js',
                '//training.sencha.com/student/ext-6.0.0/build/packages/ux/modern/ux.js'

            ],
            wrapTheCode: 'Ext.application({ name: "LivePreview", launch: function() {\n{0}\n}});'
        }
    },

    config: {
        library: null,
        // All are required
        headHtml: [],
        libraryHeadHtml: [],
        javaScript: '',
        scriptUrls: [],
        wrapTheCode: ''

    },

    constructor: function(config) {
        var c = config.library ? EditView.view.editview.JavaScriptViewer[config.library] : {};
        config = Ext.apply(c, config);
        this.callParent(arguments);
    },

    onRender: function() {
        this.callParent();
        this.runJavaScript(this.getJavaScript());
    },

    destroy: function() {
        this.getFrame().contentWindow.onerror = null;
        this.callParent();
    },

    runJavaScript: function(javascript) {
        var me = this;

        var doc = me.getDoc();

        // open() replaces whatever document was there. This component is re-created every time it's
        // used. When I tried to dynamically insert the app in the existing iframe, nothing happened
        // (although the DOM looked ok).
        // I'm still using open() though, because it's the only way I could figure out to set the doctype.
        doc.open();
        doc.write('<!DOCTYPE html>');
        doc.close();

        me.getFrame().contentWindow.onerror = function(message, source, line, column, error) {
            line--; // Our code IS inserted on the second relative line
            if (error) {
                doc.body.innerHTML = '<p>' + error.message + ' on line ' + line + ', column ' + column + '.</p>';
            } else {
                doc.body.innerHTML = '<p>' + message + '</p>';
            }
        }

        var head = me.getDoc().head;


        //----- Insert <head> content -----

        var headHtml = me.getLibraryHeadHtml().join('');
        if (headHtml) {
            Ext.DomHelper.insertHtml('afterBegin', head, headHtml);
        }
        var headHtml = me.getHeadHtml().join('');
        if (headHtml) {
            Ext.DomHelper.insertHtml('afterBegin', head, headHtml);
        }


        //----- Sequentially and recursively load the scripts -----

        function sequentiallyLoadScriptUrls(urls) {
            if (urls.length === 0) {
                // This is the last thing to be loaded.
                var innerHtml = Ext.String.format(me.getWrapTheCode(), javascript);
                var script = doc.createElement('script');
                script.type = 'text/javascript';
                script.innerHTML = innerHtml;
                head.appendChild(script);
                return;
            }
            var url = urls.shift();
            var script = doc.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            script.onload = function() {
                sequentiallyLoadScriptUrls(urls);
            }
            head.appendChild(script);
        }
        // If we don't clone the URLs array the original will be emptied
        // out as its items are shift()ed off.
        var urls = Ext.Array.clone(me.getScriptUrls());
        sequentiallyLoadScriptUrls(urls);

    }
});