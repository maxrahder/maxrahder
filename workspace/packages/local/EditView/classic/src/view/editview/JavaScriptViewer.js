/*
A JavaScriptViewer is the iframe that contains specified JavaScript.

It is immutable -- as you create it you specify library URLs and the JavaScript being rendered.
All configs are required.
*/
Ext.define('EditView.view.editview.JavaScriptViewer', {
    requires: ['EditView.util.SenchaCdnToken'],
    extend: 'Ext.ux.IFrame',
    xtype: 'javascriptviewer',

    statics: {
        touch2: {
            version: 'Sencha Touch 2.4.1',
            libraryHeadHtml: [
                '<link rel="stylesheet" href="//extjs.cachefly.net/touch/sencha-touch-2.4.1/resources/css/sencha-touch.css">'
            ],
            scriptUrls: ['//extjs.cachefly.net/touch/sencha-touch-2.4.1/sencha-touch-all.js'],
            wrapTheCode: 'Ext.application({ name: "LivePreview", launch: function() {\n{0}\n}});'
        },
        ext4: {
            version: 'Sencha Ext JS 4.2.1',
            libraryHeadHtml: ['<link rel="stylesheet" href="//extjs.cachefly.net/ext/gpl/4.2.1/resources/css/ext-all-neptune.css">'],
            scriptUrls: ['//extjs.cachefly.net/ext/gpl/4.2.1/ext-all-rtl.js'],
            wrapTheCode: 'Ext.application({ name: "LivePreview", launch: function() {\n{0}\n}});'
        },
        ext5: {
            version: 'Sencha 5.1.1',
            libraryHeadHtml: [
                '<link rel="stylesheet" href="//cdn.sencha.com/ext/commercial/5.1.1/build/packages/ext-theme-crisp/build/resources/ext-theme-crisp-all.css">',
                '<link rel="stylesheet" href="//cdn.sencha.com/ext/commercial/5.1.1/build/packages/ext-ux/build/crisp/resources/ext-ux-all.css">',
                '<link rel="stylesheet" href="//cdn.sencha.com/ext/commercial/5.1.1/build/packages/sencha-charts/build/crisp/resources/sencha-charts-all.css">',
                '<link rel="stylesheet" href="resources/stylesheets/frame.css">'
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
            version: 'Sencha Ext JS 6.2.0.981, classic toolkit',
            libraryHeadHtml: [

                '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">',

                '<link rel="stylesheet" href="_resources/ext-6.2-build/classic/theme-triton/resources/theme-triton-all.css">',
                '<link rel="stylesheet" href="_resources/ext-6.2-build/packages/ux/classic/triton/resources/ux-all.css">',
                '<link rel="stylesheet" href="_resources/ext-6.2-build/packages/charts/classic/triton/resources/charts-all.css">',

                // '<link rel="stylesheet" href="resources/stylesheets/frame.css">',

                '<link rel="stylesheet" href="_resources/ext-6.2-addons/packages/pivot/build/classic/triton/resources/pivot-all.css">',
                '<link rel="stylesheet" href="_resources/ext-6.2-addons/packages/calendar/build/classic/triton/resources/calendar-all.css">'

            ],
            scriptUrls: [

                '_resources/ext-6.2-build/ext-all.js',
                '_resources/ext-6.2-addons/packages/exporter/build/classic/exporter.js',
                '_resources/ext-6.2-build/classic/theme-triton/theme-triton.js',
                '_resources/ext-6.2-build/packages/charts/classic/charts.js',
                '_resources/ext-6.2-build/packages/ux/classic/ux.js',
                '_resources/ext-6.2-addons/packages/pivot/build/classic/pivot.js',
                '_resources/ext-6.2-addons/packages/calendar/build/classic/calendar-debug.js'

            ],

            wrapTheCode: '{0};'
        },
        modern: {
            version: 'Sencha Ext JS 6.2.0.981, modern toolkit',
            libraryHeadHtml: [

                '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">',
                '<meta name="apple-mobile-web-app-capable" content="yes" id="ext-element-8">',
                '<meta name="apple-touch-fullscreen" content="yes" id="ext-element-9">',

                '<link rel="stylesheet" href="_resources/ext-6.2-build/modern/theme-triton/resources/theme-triton-all.css">',
                '<link rel="stylesheet" href="_resources/ext-6.2-build/packages/charts/modern/modern-triton/resources/charts-all.css">'

                // '<link rel="stylesheet" href="resources/stylesheets/frame.css">'

            ],
            scriptUrls: [

                '_resources/ext-6.2-build/ext-modern-all-debug.js',
                '_resources/ext-6.2-build/modern/theme-triton/theme-triton.js',
                '_resources/ext-6.2-build/packages/charts/modern/charts.js'

            ],
            wrapTheCode: '{0}'
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
        var me = this;
        me.callParent();
        // EditView.util.SenchaCdnToken.refresh(function() {
        me.runJavaScript(me.getJavaScript());
        // });
    },

    destroy: function() {
        // TODO: I can't remember what this code regarding onerror is all about.
        // Maybe that's the event handler set up as the iframe was created, and
        // we're just cleaning up.
        if (this.iframeEl && this.iframeEl.contentWindow) {
            this.iframeEl.contentWindow.onerror = null;
        }
        this.callParent();
    },


    html: '<iframe width="100%" height="100%" frameborder="0"></iframe>',

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
        };

        var head = me.getDoc().head;


        //----- Insert <head> content -----

        var headHtml = me.getLibraryHeadHtml().join('');
        if (headHtml) {
            Ext.DomHelper.insertHtml('afterBegin', head, headHtml);
        }
        headHtml = me.getHeadHtml().join('');
        if (headHtml) {
            Ext.DomHelper.insertHtml('afterBegin', head, headHtml);
        }


        //----- Sequentially and recursively load the scripts -----

        function sequentiallyLoadScriptUrls(urls) {
            var script, url, innerHtml;
            if (urls.length === 0) {
                // This is the last thing to be loaded.
                innerHtml = Ext.String.format(me.getWrapTheCode(), javascript);
                script = doc.createElement('script');
                script.type = 'text/javascript';
                script.innerHTML = innerHtml;
                head.appendChild(script);
                return;
            }
            url = urls.shift();
            script = doc.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            script.onload = function() {
                sequentiallyLoadScriptUrls(urls);
            };
            head.appendChild(script);
        }
        // If we don't clone the URLs array the original will be emptied
        // out as its items are shift()ed off.
        var urls = Ext.Array.clone(me.getScriptUrls());
        sequentiallyLoadScriptUrls(urls);

    }
});
